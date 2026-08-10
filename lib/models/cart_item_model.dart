import 'package:coin_original_mobile/models/product_model.dart';

class CartItemModel {
  final String id;
  final ProductModel product;
  final int quantity;

  const CartItemModel({
    required this.id,
    required this.product,
    required this.quantity,
  });

  double get totalPrice => product.price * quantity;

  factory CartItemModel.fromMap(Map<String, dynamic> map, String id) {
    final rawProductMap = map['product'] as Map<String, dynamic>?;
    final productMap = rawProductMap ?? _buildFallbackProductSnapshot(map);
    final productId = (map['productId'] ?? productMap['id'] ?? '') as String;

    return CartItemModel(
      id: id,
      product: ProductModel.fromMap(productMap, productId),
      quantity: _toInt(map['quantity']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'productId': product.id,
      'quantity': quantity,
    };
  }

  Map<String, dynamic> toMapWithProductSnapshot() {
    return {
      'id': id,
      'productId': product.id,
      'quantity': quantity,
      'product': product.toMap(),
    };
  }

  CartItemModel copyWith({
    String? id,
    ProductModel? product,
    int? quantity,
  }) {
    return CartItemModel(
      id: id ?? this.id,
      product: product ?? this.product,
      quantity: quantity ?? this.quantity,
    );
  }
}

Map<String, dynamic> _buildFallbackProductSnapshot(Map<String, dynamic> map) {
  final image = (map['image'] ?? '') as String;

  return {
    'id': (map['productId'] ?? map['id'] ?? '') as String,
    'name': (map['name'] ?? '') as String,
    'description': '',
    'price': map['price'] ?? 0,
    'images': image.isEmpty ? const <String>[] : [image],
    'image': image,
    'categoryId': '',
    'categoryName': '',
    'brand': map['brand'],
    'createdAt': DateTime.now().toIso8601String(),
    'variants': [
      if ((map['size'] ?? '').toString().isNotEmpty) (map['size'] ?? '').toString(),
    ],
  };
}

int _toInt(dynamic value) {
  if (value is int) return value;
  if (value is num) return value.toInt();
  if (value is String && value.isNotEmpty) {
    return int.tryParse(value) ?? 0;
  }
  return 0;
}
