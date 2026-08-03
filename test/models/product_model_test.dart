import 'package:flutter_test/flutter_test.dart';
import 'package:coin_original_mobile/models/product_model.dart';

void main() {
  group('ProductModel Tests', () {
    final now = DateTime.now();
    
    final productMap = {
      'name': 'Produit A',
      'description': 'Description A',
      'price': 100.0,
      'oldPrice': 150.0,
      'images': ['img1.png'],
      'categoryId': 'cat1',
      'categoryName': 'Catégorie A',
      'stock': 10,
      'rating': 4.5,
      'reviewCount': 20,
      'isActive': true,
      'createdAt': now.toIso8601String(),
    };

    test('should construct model from map', () {
      final product = ProductModel.fromMap(productMap, 'prod1');

      expect(product.id, 'prod1');
      expect(product.name, 'Produit A');
      expect(product.price, 100.0);
      expect(product.oldPrice, 150.0);
      expect(product.images, ['img1.png']);
      expect(product.stock, 10);
      expect(product.rating, 4.5);
      expect(product.reviewCount, 20);
      expect(product.isActive, true);
    });

    test('should calculate correct discount percentage', () {
      final product = ProductModel.fromMap(productMap, 'prod1');
      expect(product.discountPercent, 33.0); // (150 - 100) / 150 * 100 = 33.33... rounded to 33.0
    });

    test('should export model to map', () {
      final product = ProductModel.fromMap(productMap, 'prod1');
      final exportedMap = product.toMap();

      expect(exportedMap['name'], 'Produit A');
      expect(exportedMap['price'], 100.0);
      expect(exportedMap['oldPrice'], 150.0);
    });

    test('should copy model with updated fields', () {
      final product = ProductModel.fromMap(productMap, 'prod1');
      final updatedProduct = product.copyWith(name: 'New Name', price: 120.0);

      expect(updatedProduct.id, 'prod1');
      expect(updatedProduct.name, 'New Name');
      expect(updatedProduct.price, 120.0);
      expect(updatedProduct.stock, 10); // remains unchanged
    });

    test('should generate non-zero fallback rating and reviews when missing', () {
      final fallbackProduct = ProductModel.fromMap({
        'name': 'Produit Sans Avis',
        'description': 'Description',
        'price': 89.0,
        'images': ['img2.png'],
        'categoryId': 'cat2',
        'categoryName': 'Catégorie B',
        'stock': 5,
        'rating': 0,
        'reviewCount': 0,
        'isActive': true,
        'createdAt': now.toIso8601String(),
      }, 'prod-fallback');

      expect(fallbackProduct.rating, isNot(4.5));
      expect(fallbackProduct.rating, inInclusiveRange(3.8, 5.0));
      expect(fallbackProduct.reviewCount, greaterThan(0));
    });
  });
}
