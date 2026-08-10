import 'package:flutter/material.dart';
import 'package:coin_original_mobile/models/cart_item_model.dart';
import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/services/cart_service.dart';
import 'package:coin_original_mobile/services/firebase_service.dart';

class CartProvider extends ChangeNotifier {
  final CartService _cartService = CartService();
  static const String _guestUserId = '__guest__';

  List<CartItemModel> _items = [];
  bool _isLoading = false;
  String? _error;
  int _itemCount = 0;

  List<CartItemModel> get items => _items;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get itemCount => _itemCount;

  double get totalPrice =>
      _items.fold(0, (sum, item) => sum + item.totalPrice);

  int get totalItems =>
      _items.fold(0, (sum, item) => sum + item.quantity);

  String get _effectiveUserId => FirebaseService.currentUserId ?? _guestUserId;

  void _refreshItemCount() {
    _itemCount = _items.fold<int>(0, (sum, item) => sum + item.quantity);
  }

  Future<void> loadCart() async {
    final userId = _effectiveUserId;

    _setLoading(true);
    _error = null;

    try {
      _items = await _cartService.getCartItems(userId);
      _refreshItemCount();
      _setLoading(false);
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
    }
  }

  Future<bool> addToCart(ProductModel product, {int quantity = 1}) async {
    final userId = _effectiveUserId;

    _setLoading(true);
    _error = null;
    try {
      await _cartService.addToCart(userId, product, quantity: quantity);
      await loadCart();
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<void> updateQuantity(String itemId, int quantity) async {
    final userId = _effectiveUserId;

    _setLoading(true);
    try {
      await _cartService.updateQuantity(userId, itemId, quantity);
      await loadCart();
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
    }
  }

  Future<void> removeFromCart(String itemId) async {
    final userId = _effectiveUserId;

    _setLoading(true);
    try {
      await _cartService.removeFromCart(userId, itemId);
      await loadCart();
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
    }
  }

  Future<void> clearCart() async {
    final userId = _effectiveUserId;

    _setLoading(true);
    try {
      await _cartService.clearCart(userId);
      _items = [];
      _refreshItemCount();
      _setLoading(false);
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
    }
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}
