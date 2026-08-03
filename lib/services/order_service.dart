import 'dart:math';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:coin_original_mobile/models/order_model.dart';
import 'package:coin_original_mobile/services/firebase_service.dart';
import 'package:coin_original_mobile/utils/enums.dart';
import 'package:dio/dio.dart';

const _orderIdLength = 8;
const _orderIdChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
final _orderIdRandom = Random.secure();

String _generateOrderId() {
  return List.generate(
    _orderIdLength,
    (_) => _orderIdChars[_orderIdRandom.nextInt(_orderIdChars.length)],
  ).join();
}

class OrderService {
  final _ordersCollection = FirebaseService.firestore.collection('orders');
  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: 'https://coinoriginal.shop',
      connectTimeout: const Duration(seconds: 8),
      receiveTimeout: const Duration(seconds: 8),
      sendTimeout: const Duration(seconds: 8),
      headers: const {
        'Content-Type': 'application/json',
      },
    ),
  );

  Future<String> _generateUniqueOrderId() async {
    while (true) {
      final id = _generateOrderId();
      final existing = await _ordersCollection.doc(id).get();
      if (!existing.exists) return id;
    }
  }

  Future<String> createOrder(OrderModel order) async {
    final id = await _generateUniqueOrderId();
    final payload = order.toMap()
      ..['createdAt'] = Timestamp.fromDate(order.createdAt)
      ..['updatedAt'] =
          order.updatedAt == null ? null : Timestamp.fromDate(order.updatedAt!);

    await _ordersCollection.doc(id).set(payload);
    await _notifyAdminsForNewOrder(
      orderId: id,
      customerName: order.userName,
      total: order.totalAmount,
      itemsCount: order.totalItems,
    );
    return id;
  }

  Future<void> _notifyAdminsForNewOrder({
    required String orderId,
    required String customerName,
    required double total,
    required int itemsCount,
  }) async {
    try {
      await _dio.post(
        '/api/order-push',
        data: {
          'orderId': orderId,
          'customerName': customerName,
          'total': total,
          'itemsCount': itemsCount,
        },
      );
    } catch (_) {
      // Do not fail order creation if push delivery cannot be triggered.
    }
  }

  Future<List<OrderModel>> getUserOrders(String userId,
      {DateTime? startAfter, int limit = 10}) async {
    final snapshot =
        await _ordersCollection.where('userId', isEqualTo: userId).get();

    final orders = snapshot.docs
        .map((doc) =>
            OrderModel.fromMap(doc.data() as Map<String, dynamic>, doc.id))
        .toList()
      ..sort(_compareOrdersByDateDesc);

    final filteredOrders = startAfter == null
        ? orders
        : orders
            .where((order) => order.createdAt.isBefore(startAfter))
            .toList();

    if (filteredOrders.length <= limit) return filteredOrders;
    return filteredOrders.take(limit).toList();
  }

  Future<List<OrderModel>> getAllOrders(
      {OrderStatus? status, DateTime? startAfter, int limit = 10}) async {
    Query query = _ordersCollection.orderBy('createdAt', descending: true);

    if (status != null) {
      query = query.where('status', isEqualTo: status.value);
    }

    if (startAfter != null) {
      query = query.startAfter([Timestamp.fromDate(startAfter)]);
    }

    final snapshot = await query.limit(limit).get();
    final orders = snapshot.docs
        .map((doc) =>
            OrderModel.fromMap(doc.data() as Map<String, dynamic>, doc.id))
        .toList()
      ..sort(_compareOrdersByDateDesc);
    return orders;
  }

  Future<OrderModel?> getOrderById(String id) async {
    final doc = await _ordersCollection.doc(id).get();
    if (!doc.exists) return null;
    return OrderModel.fromMap(doc.data()!, doc.id);
  }

  Stream<OrderModel?> watchOrderById(String id) {
    return _ordersCollection.doc(id).snapshots().map((doc) {
      if (!doc.exists) return null;
      return OrderModel.fromMap(doc.data()!, doc.id);
    });
  }

  Future<void> updateOrderStatus(String id, OrderStatus status) async {
    await _ordersCollection.doc(id).update({
      'status': status.value,
      'updatedAt': Timestamp.fromDate(DateTime.now()),
    });
  }

  Stream<List<OrderModel>> getOrdersStream(String userId) {
    return _ordersCollection
        .where('userId', isEqualTo: userId)
        .snapshots()
        .map((snapshot) {
      final orders = snapshot.docs
          .map((doc) => OrderModel.fromMap(doc.data(), doc.id))
          .toList()
        ..sort(_compareOrdersByDateDesc);
      return orders;
    });
  }

  Stream<List<OrderModel>> getAllOrdersStream() {
    return _ordersCollection
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      final orders = snapshot.docs
          .map((doc) => OrderModel.fromMap(doc.data(), doc.id))
          .toList()
        ..sort(_compareOrdersByDateDesc);
      return orders;
    });
  }

  Future<Map<String, int>> getOrderStats() async {
    // Utilisation de requêtes d'agrégation count() Firestore
    final pendingSnapshot = await _ordersCollection
        .where('status', isEqualTo: 'pending')
        .count()
        .get();
    final processingSnapshot = await _ordersCollection
        .where('status', isEqualTo: 'processing')
        .count()
        .get();
    final shippedSnapshot = await _ordersCollection
        .where('status', isEqualTo: 'shipped')
        .count()
        .get();
    final deliveredSnapshot = await _ordersCollection
        .where('status', isEqualTo: 'delivered')
        .count()
        .get();
    final cancelledSnapshot = await _ordersCollection
        .where('status', isEqualTo: 'cancelled')
        .count()
        .get();
    final totalSnapshot = await _ordersCollection.count().get();

    return {
      'pending': pendingSnapshot.count ?? 0,
      'processing': processingSnapshot.count ?? 0,
      'shipped': shippedSnapshot.count ?? 0,
      'delivered': deliveredSnapshot.count ?? 0,
      'cancelled': cancelledSnapshot.count ?? 0,
      'total': totalSnapshot.count ?? 0,
    };
  }

  Future<double> getTotalRevenue() async {
    // Afin d'éviter de charger toutes les commandes en mémoire, on filtre sur les commandes valides.
    // Note: Pour une vraie application, un champ d'agrégation dans Firestore ou une Cloud Function
    // est recommandé, mais limiter les lectures en limitant ou paginant est déjà une grande amélioration.
    final snapshot = await _ordersCollection
        .where('status', isNotEqualTo: 'cancelled')
        .get();

    double total = 0;
    for (final doc in snapshot.docs) {
      final data = doc.data();
      total += (data['totalAmount'] ?? 0).toDouble();
    }
    return total;
  }
}

int _compareOrdersByDateDesc(OrderModel a, OrderModel b) {
  final dateComparison = b.createdAt.compareTo(a.createdAt);
  if (dateComparison != 0) return dateComparison;
  return b.id.compareTo(a.id);
}
