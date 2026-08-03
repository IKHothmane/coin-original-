import 'package:coin_original_mobile/models/category_model.dart';
import 'package:coin_original_mobile/services/firebase_service.dart';

class CategoryService {
  final _categoriesCollection = FirebaseService.firestore.collection('categories');

  Future<List<CategoryModel>> getCategories() async {
    final snapshot = await _categoriesCollection.orderBy('name').get();
    return snapshot.docs
        .map((doc) => CategoryModel.fromMap(doc.data(), doc.id))
        .toList();
  }

  Future<CategoryModel?> getCategoryById(String id) async {
    final doc = await _categoriesCollection.doc(id).get();
    if (!doc.exists) return null;
    return CategoryModel.fromMap(doc.data()!, doc.id);
  }

  Future<String> addCategory(CategoryModel category) async {
    final doc = await _categoriesCollection.add(category.toMap());
    return doc.id;
  }

  Future<void> updateCategory(String id, Map<String, dynamic> data) async {
    await _categoriesCollection.doc(id).update(data);
  }

  Future<void> deleteCategory(String id) async {
    await _categoriesCollection.doc(id).delete();
  }

  Stream<List<CategoryModel>> getCategoriesStream() {
    return _categoriesCollection
        .orderBy('name')
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => CategoryModel.fromMap(doc.data(), doc.id))
            .toList());
  }
}
