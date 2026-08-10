import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/services/favorites_service.dart';
import 'package:flutter/material.dart';
import 'dart:async';

class FavoritesProvider extends ChangeNotifier {
  final List<ProductModel> _favorites = [];
  final FavoritesService _service = FavoritesService();
  StreamSubscription<List<ProductModel>>? _subscription;
  String? _uid;

  List<ProductModel> get favorites => List.unmodifiable(_favorites);
  int get count => _favorites.length;

  bool isFavorite(String productId) {
    return _favorites.any((product) => product.id == productId);
  }

  void syncWithAuth(String? uid) {
    if (_uid == uid) return;

    _uid = uid;
    _subscription?.cancel();
    _subscription = null;
    _favorites.clear();
    notifyListeners();

    if (uid == null) return;

    _subscription = _service.streamFavorites(uid).listen((items) {
      _favorites
        ..clear()
        ..addAll(items);
      notifyListeners();
    });
  }

  void toggleFavorite(ProductModel product) {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
      return;
    }

    _favorites.insert(0, product.copyWith(isFavorite: true));
    notifyListeners();

    final uid = _uid;
    if (uid != null) {
      _service.setFavorite(uid, product).catchError((_) {});
    }
  }

  void removeFavorite(String productId) {
    _favorites.removeWhere((product) => product.id == productId);
    notifyListeners();

    final uid = _uid;
    if (uid != null) {
      _service.removeFavorite(uid, productId).catchError((_) {});
    }
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }
}
