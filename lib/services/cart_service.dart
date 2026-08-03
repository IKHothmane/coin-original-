import 'package:coin_original_mobile/models/cart_item_model.dart';
import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/services/firebase_service.dart';

class CartService {
  static final Map<String, List<Map<String, dynamic>>> _guestCartStore = {};
  static const String _guestPrefix = '__guest__';
  get _cartsCollection => FirebaseService.firestore.collection('carts');

  String _getCartDocId(String userId) => 'cart_$userId';
  bool _isGuestUser(String userId) => userId.startsWith(_guestPrefix);

  List<Map<String, dynamic>> _guestItems(String userId) {
    return List<Map<String, dynamic>>.from(_guestCartStore[userId] ?? const []);
  }

  void _saveGuestItems(String userId, List<dynamic> items) {
    _guestCartStore[userId] = items
        .map((item) => Map<String, dynamic>.from(item as Map))
        .toList();
  }

  Future<List<CartItemModel>> getCartItems(String userId) async {
    if (_isGuestUser(userId)) {
      return _guestItems(userId)
          .map((item) => CartItemModel.fromMap(item, (item['id'] ?? '') as String))
          .toList();
    }

    final doc = await _cartsCollection.doc(_getCartDocId(userId)).get();
    if (!doc.exists) return [];

    final data = doc.data()!;
    final items = data['items'] as List<dynamic>? ?? [];

    final List<Future<CartItemModel?>> futures = items.map((item) async {
      final map = item as Map<String, dynamic>;
      final productId = map['productId'] ?? '';
      final itemId = map['id'] ?? '';
      final quantity = map['quantity'] ?? 1;
      final productSnapshot = map['product'] as Map<String, dynamic>?;

      if (productId.isEmpty) return null;

      ProductModel? product;

      final productDoc = await FirebaseService.firestore
          .collection('products')
          .doc(productId)
          .get();

      if (productDoc.exists) {
        product = ProductModel.fromMap(
          productDoc.data()!,
          productDoc.id,
        );
      } else if (productSnapshot != null) {
        product = ProductModel.fromMap(productSnapshot, productId);
      }

      if (product == null) return null;

      return CartItemModel(
        id: itemId,
        product: product,
        quantity: quantity,
      );
    }).toList();

    final results = await Future.wait(futures);
    return results.whereType<CartItemModel>().toList();
  }

  Future<void> addToCart(String userId, ProductModel product, {int quantity = 1}) async {
    if (_isGuestUser(userId)) {
      final items = _guestItems(userId);
      final existingIndex = items.indexWhere(
        (item) => item['productId'] == product.id,
      );

      if (existingIndex >= 0) {
        items[existingIndex]['quantity'] =
            (items[existingIndex]['quantity'] as int) + quantity;
        items[existingIndex]['product'] = product.toMap();
      } else {
        items.add({
          'id': DateTime.now().millisecondsSinceEpoch.toString(),
          'productId': product.id,
          'quantity': quantity,
          'product': product.toMap(),
        });
      }

      _saveGuestItems(userId, items);
      return;
    }

    final cartDoc = _cartsCollection.doc(_getCartDocId(userId));
    final doc = await cartDoc.get();

    List<dynamic> items = [];
    if (doc.exists) {
      items = List<dynamic>.from(doc.data()!['items'] ?? []);
    }

    final existingIndex = items.indexWhere(
      (item) => item['productId'] == product.id,
    );

    if (existingIndex >= 0) {
      items[existingIndex]['quantity'] =
          (items[existingIndex]['quantity'] as int) + quantity;
      items[existingIndex]['product'] = product.toMap();
    } else {
      items.add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'productId': product.id,
        'quantity': quantity,
        'product': product.toMap(),
      });
    }

    await cartDoc.set({
      'userId': userId,
      'items': items,
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  Future<void> updateQuantity(String userId, String itemId, int quantity) async {
    if (_isGuestUser(userId)) {
      final items = _guestItems(userId);
      final index = items.indexWhere((item) => item['id'] == itemId);

      if (index >= 0) {
        if (quantity <= 0) {
          items.removeAt(index);
        } else {
          items[index]['quantity'] = quantity;
        }
        _saveGuestItems(userId, items);
      }
      return;
    }

    final cartDoc = _cartsCollection.doc(_getCartDocId(userId));
    final doc = await cartDoc.get();

    if (!doc.exists) return;

    List<dynamic> items = List<dynamic>.from(doc.data()!['items'] ?? []);
    final index = items.indexWhere((item) => item['id'] == itemId);

    if (index >= 0) {
      if (quantity <= 0) {
        items.removeAt(index);
      } else {
        items[index]['quantity'] = quantity;
      }

      await cartDoc.update({
        'items': items,
        'updatedAt': DateTime.now().toIso8601String(),
      });
    }
  }

  Future<void> removeFromCart(String userId, String itemId) async {
    if (_isGuestUser(userId)) {
      final items = _guestItems(userId);
      items.removeWhere((item) => item['id'] == itemId);
      _saveGuestItems(userId, items);
      return;
    }

    final cartDoc = _cartsCollection.doc(_getCartDocId(userId));
    final doc = await cartDoc.get();

    if (!doc.exists) return;

    List<dynamic> items = List<dynamic>.from(doc.data()!['items'] ?? []);
    items.removeWhere((item) => item['id'] == itemId);

    await cartDoc.update({
      'items': items,
      'updatedAt': DateTime.now().toIso8601String(),
    });
  }

  Future<void> clearCart(String userId) async {
    if (_isGuestUser(userId)) {
      _guestCartStore.remove(userId);
      return;
    }

    await _cartsCollection.doc(_getCartDocId(userId)).delete();
  }
}
