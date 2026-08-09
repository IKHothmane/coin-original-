import 'package:flutter/material.dart';
import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/services/product_service.dart';

class ProductProvider extends ChangeNotifier {
  final ProductService _productService = ProductService();

  Stream<List<ProductModel>>? _productsStream;

  List<ProductModel> _products = [];
  List<ProductModel> _popularProducts = [];
  ProductModel? _selectedProduct;
  bool _isLoading = false;
  bool _isLoadingMore = false;
  bool _hasMore = true;
  String? _error;
  String _searchQuery = '';
  Future<void>? _homeLoadFuture;

  List<ProductModel> get products => _products;
  List<ProductModel> get popularProducts => _popularProducts;
  ProductModel? get selectedProduct => _selectedProduct;
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  bool get hasMore => _hasMore;
  String? get error => _error;
  String get searchQuery => _searchQuery;

  void listenToAllProducts() {
    // Annuler l'ancien stream s'il existe
    if (_productsStream != null) {
      _productsStream!.listen(null).cancel();
    }
    _isLoading = true;
    _error = null;
    notifyListeners();

    _productsStream = _productService.getAllProductsStream();
    _productsStream!.listen(
      (products) {
        _products = products;
        _isLoading = false;
        _error = null;
        notifyListeners();
      },
      onError: (e) {
        _error = e.toString();
        _isLoading = false;
        notifyListeners();
      },
    );
  }

  void stopListening() {
    _productsStream = null;
  }

  Future<void> loadHomeProducts({bool activeOnly = true, bool force = false}) {
    if (!force && _products.isNotEmpty) {
      if (_popularProducts.isEmpty) {
        _popularProducts =
            _productService.derivePopularProducts(_products);
        notifyListeners();
      }
      return Future.value();
    }

    return _homeLoadFuture ??=
        _loadHomeProductsInternal(activeOnly: activeOnly, force: force)
            .whenComplete(() => _homeLoadFuture = null);
  }

  Future<void> _loadHomeProductsInternal({
    required bool activeOnly,
    required bool force,
  }) async {
    _setLoading(true);
    _error = null;

    try {
      final products = await _productService.getHomeProducts(
        activeOnly: activeOnly,
      );
      _products = products;
      _popularProducts = _productService.derivePopularProducts(products);
      _hasMore = products.length >= 36;
      _setLoading(false);
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
    }
  }

  Future<void> loadCatalogProducts({bool activeOnly = true}) async {
    if (_products.isNotEmpty) return;
    await loadHomeProducts(activeOnly: activeOnly);
  }

  Future<void> loadProducts(
      {String? categoryId,
      bool isRefresh = true,
      bool activeOnly = true}) async {
    if (isRefresh) {
      _setLoading(true);
      _error = null;
      _products = [];
      _hasMore = true;
    } else {
      if (!_hasMore || _isLoadingMore || _isLoading) return;
      _setLoadingMore(true);
    }

    try {
      final DateTime? startAfter =
          !isRefresh && _products.isNotEmpty ? _products.last.createdAt : null;

      final newProducts = await _productService.getProducts(
        categoryId: categoryId,
        searchQuery: _searchQuery.isNotEmpty ? _searchQuery : null,
        startAfter: startAfter,
        limit: 10,
        activeOnly: activeOnly,
      );

      if (isRefresh) {
        _products = newProducts;
      } else {
        _products.addAll(newProducts);
      }

      _hasMore = newProducts.length == 10;

      if (isRefresh) {
        _setLoading(false);
      } else {
        _setLoadingMore(false);
      }
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      _setLoadingMore(false);
    }
  }

  Future<void> loadPopularProducts() async {
    if (_products.isNotEmpty) {
      _popularProducts = _productService.derivePopularProducts(_products);
      notifyListeners();
      return;
    }

    await loadHomeProducts();
  }

  Future<void> getProductById(String id) async {
    _setLoading(true);
    try {
      _selectedProduct = await _productService.getProductById(id);
      _setLoading(false);
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
    }
  }

  void search(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void clearSearch() {
    _searchQuery = '';
    notifyListeners();
  }

  Future<bool> addProduct(ProductModel product) async {
    try {
      await _productService.addProduct(product);
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> addProductWithId(String id, Map<String, dynamic> data) async {
    try {
      await _productService.addProductWithId(id, data);
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateProduct(String id, Map<String, dynamic> data) async {
    try {
      await _productService.updateProduct(id, data);
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteProduct(String id) async {
    try {
      await _productService.deleteProduct(id);
      // Le stream temps réel mettra à jour la liste automatiquement
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void _setLoadingMore(bool value) {
    _isLoadingMore = value;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
