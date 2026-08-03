import 'dart:async';

import 'package:coin_original_mobile/models/app_notification_model.dart';
import 'package:coin_original_mobile/models/order_model.dart';
import 'package:coin_original_mobile/services/local_notification_service.dart';
import 'package:coin_original_mobile/services/order_service.dart';
import 'package:flutter/material.dart';

Future<void> _debugReportNotifications(
  String hypothesisId,
  String location,
  String msg,
  Map<String, Object?> data,
) async {}

class NotificationsProvider extends ChangeNotifier {
  final OrderService _orderService = OrderService();

  StreamSubscription<List<OrderModel>>? _ordersSubscription;
  final Set<String> _knownOrderIds = <String>{};
  final Set<String> _readIds = <String>{};
  final Set<String> _dismissedIds = <String>{};

  List<AppNotificationModel> _notifications = const [];
  bool _isAdminListening = false;
  bool _primed = false;

  List<AppNotificationModel> get notifications => _notifications;
  int get unreadCount => _notifications.where((item) => !item.isRead).length;

  void ensureAdminListening() {
    if (_isAdminListening) return;
    _startAdminOrdersListener();
  }

  void syncWithAuth({required bool isAdmin}) {
    _debugReportNotifications(
      'C',
      'lib/providers/notifications_provider.dart:60',
      'sync with auth called',
      {
        'isAdmin': isAdmin,
        'isAdminListening': _isAdminListening,
      },
    );
    if (isAdmin) {
      _startAdminOrdersListener();
    } else {
      _stopAdminOrdersListener(clearNotifications: true);
    }
  }

  void markAsRead(String id) {
    _readIds.add(id);
    _notifications = _notifications
        .map((item) => item.id == id ? item.copyWith(isRead: true) : item)
        .toList(growable: false);
    notifyListeners();
  }

  void deleteNotification(String id) {
    _dismissedIds.add(id);
    _notifications =
        _notifications.where((item) => item.id != id).toList(growable: false);
    notifyListeners();
  }

  void markAllAsRead() {
    for (final item in _notifications) {
      _readIds.add(item.id);
    }
    _notifications = _notifications
        .map((item) => item.copyWith(isRead: true))
        .toList(growable: false);
    notifyListeners();
  }

  void _startAdminOrdersListener() {
    if (_isAdminListening) return;

    _isAdminListening = true;
    _debugReportNotifications(
      'C',
      'lib/providers/notifications_provider.dart:91',
      'starting notifications orders listener',
      {},
    );
    _ordersSubscription =
        _orderService.getAllOrdersStream().listen((orders) async {
      final sortedOrders = List<OrderModel>.from(orders)
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
      _debugReportNotifications(
        'C',
        'lib/providers/notifications_provider.dart:97',
        'notifications snapshot received',
        {
          'ordersCount': sortedOrders.length,
          'knownOrderIdsCount': _knownOrderIds.length,
          'primed': _primed,
        },
      );

      if (!_primed) {
        _knownOrderIds
          ..clear()
          ..addAll(sortedOrders.map((order) => order.id));
        _primed = true;
      } else {
        for (final order in sortedOrders) {
          if (_knownOrderIds.add(order.id)) {
            _debugReportNotifications(
              'C',
              'lib/providers/notifications_provider.dart:115',
              'new order detected for notification',
              {
                'orderId': order.id,
                'userName': order.userName,
                'totalItems': order.totalItems,
              },
            );
            await LocalNotificationService.instance.showOrderNotification(
              id: order.id.hashCode,
              title: 'Nouvelle commande recue',
              body:
                  '${order.userName} • ${order.totalItems} article(s) • ${order.totalAmount.toStringAsFixed(0)} DH',
            );
          }
        }
      }

      _notifications = sortedOrders
          .where((order) => !_dismissedIds.contains(order.id))
          .map(_buildOrderNotification)
          .toList(growable: false);
      notifyListeners();
    });
  }

  void _stopAdminOrdersListener({required bool clearNotifications}) {
    _ordersSubscription?.cancel();
    _ordersSubscription = null;
    _isAdminListening = false;
    _primed = false;
    _knownOrderIds.clear();
    _readIds.clear();
    _dismissedIds.clear();
    if (clearNotifications) {
      _notifications = const [];
      notifyListeners();
    }
  }

  AppNotificationModel _buildOrderNotification(OrderModel order) {
    final orderLabel =
        order.id.length > 8 ? order.id.substring(0, 8).toUpperCase() : order.id;
    return AppNotificationModel(
      id: order.id,
      title: 'Nouvelle commande #$orderLabel',
      body:
          '${order.userName} • ${order.totalItems} article(s) • ${order.totalAmount.toStringAsFixed(0)} DH',
      createdAt: order.createdAt,
      type: AppNotificationType.order,
      isRead: _readIds.contains(order.id),
      orderId: order.id,
    );
  }

  @override
  void dispose() {
    _ordersSubscription?.cancel();
    super.dispose();
  }
}
