import 'package:coin_original_mobile/models/address_model.dart';
import 'package:coin_original_mobile/models/cart_item_model.dart';
import 'package:coin_original_mobile/utils/enums.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class OrderModel {
  final String id;
  final String userId;
  final String userName;
  final String userEmail;
  final List<CartItemModel> items;
  final double totalAmount;
  final OrderStatus status;
  final DateTime createdAt;
  final AddressModel? address;
  final String? paymentMethod;
  final DateTime? updatedAt;

  const OrderModel({
    required this.id,
    required this.userId,
    required this.userName,
    required this.userEmail,
    required this.items,
    required this.totalAmount,
    this.status = OrderStatus.pending,
    required this.createdAt,
    this.address,
    this.paymentMethod,
    this.updatedAt,
  });

  int get totalItems => items.fold(0, (sum, item) => sum + item.quantity);

  factory OrderModel.fromMap(Map<String, dynamic> map, String id) {
    final customerData = map['customer'] as Map<String, dynamic>? ?? const {};
    final rawAddress = map['address'] is Map<String, dynamic>
        ? map['address'] as Map<String, dynamic>
        : null;
    final normalizedAddress =
        rawAddress ?? _buildAddressFromCustomer(customerData);
    final itemsData = (map['items'] as List<dynamic>? ?? const [])
        .map((item) => _normalizeOrderItem(item as Map<String, dynamic>))
        .toList();

    return OrderModel(
      id: id,
      userId: (map['userId'] ?? 'web-$id') as String,
      userName: (map['userName'] ?? customerData['fullName'] ?? '') as String,
      userEmail: (map['userEmail'] ?? customerData['email'] ?? '') as String,
      items: itemsData
          .map((item) =>
              CartItemModel.fromMap(item, (item['id'] ?? '') as String))
          .toList(),
      totalAmount: _toDouble(map['totalAmount'] ?? map['total']),
      status: OrderStatus.fromString((map['status'] ?? 'pending') as String),
      createdAt: _parseDate(map['createdAt']),
      address: normalizedAddress != null
          ? AddressModel.fromMap(
              normalizedAddress,
              (normalizedAddress['id'] ?? 'address') as String,
            )
          : null,
      paymentMethod: map['paymentMethod'] as String?,
      updatedAt: map['updatedAt'] == null ? null : _parseDate(map['updatedAt']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'userName': userName,
      'userEmail': userEmail,
      'items': items.map((item) => item.toMapWithProductSnapshot()).toList(),
      'totalAmount': totalAmount,
      'status': status.value,
      'createdAt': createdAt.toIso8601String(),
      'address': address?.toMap(),
      'paymentMethod': paymentMethod,
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  OrderModel copyWith({
    String? id,
    String? userId,
    String? userName,
    String? userEmail,
    List<CartItemModel>? items,
    double? totalAmount,
    OrderStatus? status,
    DateTime? createdAt,
    AddressModel? address,
    String? paymentMethod,
    DateTime? updatedAt,
  }) {
    return OrderModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      userName: userName ?? this.userName,
      userEmail: userEmail ?? this.userEmail,
      items: items ?? this.items,
      totalAmount: totalAmount ?? this.totalAmount,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      address: address ?? this.address,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

Map<String, dynamic>? _buildAddressFromCustomer(
    Map<String, dynamic> customerData) {
  if (customerData.isEmpty) return null;

  return {
    'id': 'customer-address',
    'street': (customerData['address'] ?? '') as String,
    'city': (customerData['city'] ?? '') as String,
    'postalCode': '',
    'country': 'Maroc',
    'phone': customerData['phone'] as String?,
  };
}

Map<String, dynamic> _normalizeOrderItem(Map<String, dynamic> item) {
  if (item['product'] is Map<String, dynamic>) return item;

  final image = (item['image'] ?? '') as String;

  return {
    ...item,
    'productId': item['productId'] ?? item['id'] ?? '',
    'product': {
      'id': item['productId'] ?? item['id'] ?? '',
      'name': item['name'] ?? '',
      'description': '',
      'price': item['price'] ?? 0,
      'images': image.isEmpty ? const <String>[] : [image],
      'image': image,
      'categoryId': '',
      'categoryName': '',
      'brand': item['brand'],
      'createdAt': DateTime.now().toIso8601String(),
      'variants': [
        if ((item['size'] ?? '').toString().isNotEmpty)
          (item['size'] ?? '').toString(),
      ],
    },
  };
}

double _toDouble(dynamic value) {
  if (value is num) return value.toDouble();
  if (value is String && value.isNotEmpty) {
    return double.tryParse(value) ?? 0;
  }
  return 0;
}

DateTime _parseDate(dynamic value) {
  if (value is DateTime) return value;
  if (value is Timestamp) return value.toDate();
  if (value is String && value.isNotEmpty) {
    final parsed = DateTime.tryParse(value);
    if (parsed != null) return parsed;

    final numericValue = int.tryParse(value);
    if (numericValue != null) {
      return _fromUnixOrMilliseconds(numericValue);
    }
    return DateTime.now();
  }
  if (value is int) {
    return _fromUnixOrMilliseconds(value);
  }
  if (value is num) {
    return _fromUnixOrMilliseconds(value.toInt());
  }
  if (value is Map) {
    final seconds = value['seconds'] ?? value['_seconds'];
    final nanoseconds = value['nanoseconds'] ?? value['_nanoseconds'] ?? 0;
    final secondsValue = seconds is num
        ? seconds.toInt()
        : int.tryParse(seconds?.toString() ?? '');
    final nanosecondsValue = nanoseconds is num
        ? nanoseconds.toInt()
        : int.tryParse(nanoseconds?.toString() ?? '');

    if (secondsValue != null) {
      return DateTime.fromMillisecondsSinceEpoch(
        (secondsValue * 1000) + ((nanosecondsValue ?? 0) ~/ 1000000),
      );
    }
  }
  if (value != null) {
    try {
      return (value as dynamic).toDate() as DateTime;
    } catch (_) {}
  }
  return DateTime.now();
}

DateTime _fromUnixOrMilliseconds(int value) {
  final milliseconds = value.abs() < 100000000000 ? value * 1000 : value;
  return DateTime.fromMillisecondsSinceEpoch(milliseconds);
}
