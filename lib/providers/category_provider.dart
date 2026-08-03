import 'package:flutter/material.dart';
import 'package:coin_original_mobile/models/category_model.dart';
import 'package:coin_original_mobile/services/category_service.dart';

class CategoryProvider extends ChangeNotifier {
  final CategoryService _categoryService = CategoryService();

  List<CategoryModel> _categories = [];
  CategoryModel? _selectedCategory;
  bool _isLoading = false;
  String? _error;

  List<CategoryModel> get categories => _categories;
  CategoryModel? get selectedCategory => _selectedCategory;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadCategories() async {
    _setLoading(true);
    _error = null;

    try {
      _categories = await _categoryService.getCategories();
      _setLoading(false);
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
    }
  }

  void selectCategory(CategoryModel? category) {
    _selectedCategory = category;
    notifyListeners();
  }

  Future<bool> addCategory(CategoryModel category) async {
    _setLoading(true);
    try {
      await _categoryService.addCategory(category);
      await loadCategories();
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<bool> updateCategory(String id, Map<String, dynamic> data) async {
    _setLoading(true);
    try {
      await _categoryService.updateCategory(id, data);
      await loadCategories();
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<bool> deleteCategory(String id) async {
    _setLoading(true);
    try {
      await _categoryService.deleteCategory(id);
      await loadCategories();
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
