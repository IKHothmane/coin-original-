import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/services/firebase_service.dart';

class FavoritesService {
  CollectionReference<Map<String, dynamic>> _collection(String uid) {
    return FirebaseService.firestore.collection('users').doc(uid).collection('favorites');
  }

  Stream<List<ProductModel>> streamFavorites(String uid) {
    return _collection(uid)
        .orderBy('favoritedAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ProductModel.fromMap(doc.data(), doc.id).copyWith(isFavorite: true))
            .toList());
  }

  Future<void> setFavorite(String uid, ProductModel product) async {
    await _collection(uid).doc(product.id).set(
      {
        ...product.copyWith(isFavorite: true).toMap(),
        'favoritedAt': FieldValue.serverTimestamp(),
      },
      SetOptions(merge: true),
    );
  }

  Future<void> removeFavorite(String uid, String productId) async {
    await _collection(uid).doc(productId).delete();
  }
}

