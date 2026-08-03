import 'package:flutter_test/flutter_test.dart';
import 'package:coin_original_mobile/models/order_model.dart';
import 'package:coin_original_mobile/models/cart_item_model.dart';
import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/utils/enums.dart';

void main() {
  group('OrderModel Tests', () {
    final product = ProductModel(
      id: 'prod1',
      name: 'Produit A',
      description: 'Desc',
      price: 25.0,
      categoryId: 'cat1',
      categoryName: 'Cat A',
      createdAt: DateTime.now(),
    );

    final items = [
      CartItemModel(id: 'item1', product: product, quantity: 2),
    ];

    test('should construct model from map and export to map', () {
      final now = DateTime.now();
      final order = OrderModel(
        id: 'order1',
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        items: items,
        totalAmount: 50.0,
        status: OrderStatus.processing,
        createdAt: now,
      );

      final map = order.toMap();

      expect(map['userId'], 'user1');
      expect(map['userName'], 'John Doe');
      expect(map['totalAmount'], 50.0);
      expect(map['status'], 'processing');

      final reconstructed = OrderModel.fromMap(map, 'order1');
      expect(reconstructed.id, 'order1');
      expect(reconstructed.status, OrderStatus.processing);
      expect(reconstructed.totalItems, 2);
    });
  });
}
