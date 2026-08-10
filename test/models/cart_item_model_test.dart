import 'package:flutter_test/flutter_test.dart';
import 'package:coin_original_mobile/models/cart_item_model.dart';
import 'package:coin_original_mobile/models/product_model.dart';

void main() {
  group('CartItemModel Tests', () {
    final product = ProductModel(
      id: 'prod1',
      name: 'Produit A',
      description: 'Desc',
      price: 15.0,
      categoryId: 'cat1',
      categoryName: 'Cat A',
      createdAt: DateTime.now(),
    );

    test('should construct model from map', () {
      final map = {
        'id': 'item1',
        'productId': 'prod1',
        'product': product.toMap(),
        'quantity': 3,
      };

      final cartItem = CartItemModel.fromMap(map, 'item1');

      expect(cartItem.id, 'item1');
      expect(cartItem.product.id, 'prod1');
      expect(cartItem.product.name, 'Produit A');
      expect(cartItem.quantity, 3);
    });

    test('should calculate correct totalPrice', () {
      final cartItem = CartItemModel(id: 'item1', product: product, quantity: 4);
      expect(cartItem.totalPrice, 60.0);
    });

    test('should export basic toMap for active cart', () {
      final cartItem = CartItemModel(id: 'item1', product: product, quantity: 2);
      final map = cartItem.toMap();

      expect(map['id'], 'item1');
      expect(map['productId'], 'prod1');
      expect(map['quantity'], 2);
      expect(map.containsKey('product'), isFalse); // active cart doesn't duplicate product data
    });

    test('should export complete toMapWithProductSnapshot for orders', () {
      final cartItem = CartItemModel(id: 'item1', product: product, quantity: 2);
      final map = cartItem.toMapWithProductSnapshot();

      expect(map['id'], 'item1');
      expect(map['productId'], 'prod1');
      expect(map['quantity'], 2);
      expect(map['product']['price'], 15.0); // snapshot price is preserved
    });
  });
}
