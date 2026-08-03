import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/providers/cart_provider.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('CartProvider guest flow', () {
    late CartProvider cartProvider;
    late ProductModel product;

    setUp(() async {
      cartProvider = CartProvider();
      product = ProductModel(
        id: 'prod-guest',
        name: 'Sneaker Guest',
        description: 'Produit test',
        price: 199.0,
        categoryId: 'shoes',
        categoryName: 'Chaussures',
        createdAt: DateTime(2026, 1, 1),
      );

      await cartProvider.clearCart();
    });

    test('adds item to guest cart without authentication', () async {
      final added = await cartProvider.addToCart(product, quantity: 2);

      expect(added, isTrue);
      expect(cartProvider.error, isNull);
      expect(cartProvider.items, hasLength(1));
      expect(cartProvider.items.first.product.id, product.id);
      expect(cartProvider.items.first.quantity, 2);
      expect(cartProvider.itemCount, 2);
      expect(cartProvider.totalPrice, 398.0);
    });

    test('updates, removes and clears guest cart items', () async {
      await cartProvider.addToCart(product);
      final itemId = cartProvider.items.first.id;

      await cartProvider.updateQuantity(itemId, 3);
      expect(cartProvider.items.first.quantity, 3);
      expect(cartProvider.itemCount, 3);

      await cartProvider.removeFromCart(itemId);
      expect(cartProvider.items, isEmpty);
      expect(cartProvider.itemCount, 0);

      await cartProvider.addToCart(product, quantity: 2);
      expect(cartProvider.items, isNotEmpty);

      await cartProvider.clearCart();
      expect(cartProvider.items, isEmpty);
      expect(cartProvider.itemCount, 0);
      expect(cartProvider.totalPrice, 0);
    });
  });
}
