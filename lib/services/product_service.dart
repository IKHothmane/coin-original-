import 'dart:developer' as dev;

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/services/firebase_service.dart';

/// === ProductService — Firestore pour `products` ===
///
///  MODE SÉCURISÉ PAR DÉFAUT (pas besoin d'index composite Firestore)
///  ---------------------------------------------------------------
///  Pour éviter l'erreur Firestore "The query requires an index" sur
///  `where(hidden) + orderBy(createdAt)` on utilise PAR DÉFAUT :
///    - Une requête SIMPLE `orderBy(createdAt DESC)` (INDEX AUTO)
///    - Puis on filtre `hidden == false` / `category == ...` CÔTÉ CLIENT.
///
///  [_useOptimizedServerFilters] = false par défaut.
///  Si tu crées plus tard les index composites (voir guide), passe-le
///  à `true` pour réactiver les `where()` serveur-side → plus rapide.
class ProductService {
  final _productsCollection = FirebaseService.firestore.collection('products');

  static const bool _useOptimizedServerFilters = false;

  /// Version limitée (max 100 produits visibles par défaut).
  /// Évite de télécharger inutilement toute la collection.
  Future<List<ProductModel>> getAllProducts({
    bool activeOnly = true,
    int limit = 100,
  }) async {
    dev.log('[GET_ALL] activeOnly=$activeOnly  limit=$limit  optimized=$_useOptimizedServerFilters', name: 'ProductService');

    Query query = _productsCollection;

    if (_useOptimizedServerFilters && activeOnly) {
      query = query.where('hidden', isEqualTo: false);
    }

    final fallbackLimit = _useOptimizedServerFilters
        ? limit
        : (limit > 0 ? limit * 5 : 200);
    query = query.orderBy('createdAt', descending: true).limit(fallbackLimit);

    List<QueryDocumentSnapshot> docs;
    try {
      final snapshot = await query.get();
      docs = snapshot.docs;
      dev.log('[GET_ALL] Firestore OK: ${docs.length} doc(s) bruts (fallbackLimit=$fallbackLimit)', name: 'ProductService');
    } on FirebaseException catch (e) {
      final code = e.code.toLowerCase();
      final isIndexErr = code == 'failed-precondition' ||
          code == 'invalid-argument' ||
          (e.message ?? '').toLowerCase().contains('requires an index');
      if (_useOptimizedServerFilters && activeOnly && isIndexErr) {
        dev.log('[GET_ALL] ⚠️ INDEX composite manquant → fallback simple', name: 'ProductService', level: 900, error: e.message);
        final fbLimit = limit > 0 ? limit * 5 : 200;
        final fb = await _productsCollection
            .orderBy('createdAt', descending: true)
            .limit(fbLimit)
            .get();
        docs = fb.docs;
      } else {
        dev.log('[GET_ALL] ERREUR Firestore code=$code msg=${e.message}', name: 'ProductService', level: 1000);
        rethrow;
      }
    }

    return _mapDocs(
      docs,
      // Si mode pas optimisé → filterHidden côté client.
      filterHidden: activeOnly,
      onlyActive: activeOnly,
    );
  }

  List<ProductModel> _mapDocs(
    List<QueryDocumentSnapshot> docs, {
    required bool filterHidden,
    required bool onlyActive,
  }) {
    final all = docs
        .map((doc) => ProductModel.fromMap(
              doc.data() as Map<String, dynamic>,
              doc.id,
            ))
        .toList();

    Iterable<ProductModel> it = all;
    if (filterHidden) it = it.where((p) => !p.hidden);
    if (onlyActive) it = it.where((p) => p.isActive);
    final out = it.toList();
    dev.log(
      '[MAP_DOCS] bruts=${all.length} → filterHidden=$filterHidden onlyActive=$onlyActive → finaux=${out.length}',
      name: 'ProductService',
    );
    if (out.isNotEmpty) {
      dev.log('  - 1er: id="${out.first.id}" slug="${out.first.slug}" name="${out.first.name}"', name: 'ProductService');
      dev.log('       image="${out.first.image ?? ''}"  gallery items=${out.first.gallery.length}', name: 'ProductService');
      if (out.first.gallery.isNotEmpty) {
        dev.log('       gallery[0] src="${out.first.gallery.first['src']}" alt="${out.first.gallery.first['alt']}"', name: 'ProductService');
      }
      dev.log('  - dernier: id="${out.last.id}" slug="${out.last.slug}"', name: 'ProductService');
    } else {
      dev.log('[MAP_DOCS] ⚠️ 0 produits finaux. Tous les docs bruts étaient soit hidden=true soit invalid.', name: 'ProductService', level: 900);
      if (all.isNotEmpty) {
        for (final p in all) {
          dev.log('  ▸ brut: id="${p.id}" slug="${p.slug}" hidden=${p.hidden} isActive=${p.isActive} name="${p.name}" image="${p.image ?? ''}" gallery=${p.gallery.length}', name: 'ProductService');
        }
      } else {
        dev.log('  ▸ docs bruts VIDE. Firestore a retourné 0 documents.', name: 'ProductService');
      }
    }
    return out;
  }

  /// Version paginée (scroll infini). Par défaut `limit: 10`.
  ///
  /// En mode sécurisé (`_useOptimizedServerFilters = false`):
  ///   - on ne fait PAS `where(hidden/category)` côté serveur
  ///   - la `limit` est ×10 à ×15 pour compenser le filtre client.
  Future<List<ProductModel>> getProducts({
    String? categoryId,
    String? category,
    String? searchQuery,
    bool activeOnly = true,
    DateTime? startAfter,
    int limit = 10,
  }) async {
    dev.log('[GET_PAGINATED] activeOnly=$activeOnly  limit=$limit  category=${category ?? categoryId}  search=$searchQuery  startAfter=${startAfter?.millisecondsSinceEpoch}  optimized=$_useOptimizedServerFilters', name: 'ProductService');

    final String? filterCategory = category?.isNotEmpty == true
        ? category
        : (categoryId?.isNotEmpty == true ? categoryId : null);

    final bool whereCategory =
        _useOptimizedServerFilters && filterCategory != null && filterCategory.isNotEmpty;
    final bool whereHidden = _useOptimizedServerFilters && activeOnly;

    // Limit agrandie en mode sécurisé pour compenser le filtre client.
    final effectiveLimit = _useOptimizedServerFilters
        ? limit
        : (limit > 0 ? (whereCategory ? limit * 15 : limit * 10) : 100);

    Query query = _productsCollection;
    if (whereHidden) query = query.where('hidden', isEqualTo: false);
    if (whereCategory) query = query.where('category', isEqualTo: filterCategory);
    query = query.orderBy('createdAt', descending: true);
    if (startAfter != null) query = query.startAfter([startAfter.millisecondsSinceEpoch]);
    query = query.limit(effectiveLimit);

    List<QueryDocumentSnapshot> docs;
    try {
      final snapshot = await query.get();
      docs = snapshot.docs;
      dev.log('[GET_PAGINATED] Firestore OK: ${docs.length} doc(s) bruts (effectiveLimit=$effectiveLimit)', name: 'ProductService');
    } on FirebaseException catch (e) {
      final code = e.code.toLowerCase();
      final msg = (e.message ?? '').toLowerCase();
      final bool isIndexErr = code == 'failed-precondition' ||
          code == 'invalid-argument' ||
          msg.contains('requires an index');
      if (isIndexErr && (whereHidden || whereCategory)) {
        dev.log('[GET_PAGINATED] ⚠️ INDEX composite manquant → fallback simple', name: 'ProductService', level: 900, error: e.message);
        Query fb = _productsCollection;
        fb = fb.orderBy('createdAt', descending: true);
        if (startAfter != null) fb = fb.startAfter([startAfter.millisecondsSinceEpoch]);
        fb = fb.limit(effectiveLimit > 0 ? effectiveLimit * 10 : 200);
        final fbSnap = await fb.get();
        docs = fbSnap.docs;
        var list = docs
            .map((d) => ProductModel.fromMap(
                  d.data() as Map<String, dynamic>,
                  d.id,
                ))
            .toList();
        if (activeOnly) list = list.where((p) => !p.hidden).toList();
        if (filterCategory != null && filterCategory.isNotEmpty) {
          list = list.where((p) => p.category == filterCategory).toList();
        }
        if (list.length > limit) list = list.sublist(0, limit);
        if (searchQuery != null && searchQuery.isNotEmpty) {
          final q = searchQuery.toLowerCase();
          list = list.where((p) => p.name.toLowerCase().contains(q)).toList();
        }
        dev.log('[GET_PAGINATED] Fallback OK: ${fbSnap.docs.length} bruts → ${list.length} finaux', name: 'ProductService');
        return list;
      }
      dev.log('[GET_PAGINATED] ERREUR Firestore code=$code msg=${e.message}', name: 'ProductService', level: 1000);
      rethrow;
    }

    var products = docs
        .map((doc) => ProductModel.fromMap(
              doc.data() as Map<String, dynamic>,
              doc.id,
            ))
        .toList();

    // === Filtres CÔTÉ CLIENT (toujours exécutés, complètent le mode sécurisé) ===
    if (!_useOptimizedServerFilters) {
      if (activeOnly) products = products.where((p) => !p.hidden).toList();
      if (filterCategory != null && filterCategory.isNotEmpty) {
        products = products.where((p) => p.category == filterCategory).toList();
      }
      if (products.length > limit) products = products.sublist(0, limit);
    }

    if (searchQuery != null && searchQuery.isNotEmpty) {
      final q = searchQuery.toLowerCase();
      products = products.where((p) => p.name.toLowerCase().contains(q)).toList();
    }

    dev.log('[GET_PAGINATED] FINAL → ${products.length} produit(s)', name: 'ProductService');
    return products;
  }

  /// RAPIDE: Produits populaires. Plus de `getAllProducts` -> plus de
  /// téléchargement de TOUTE la collection. On prend les N derniers
  /// produits visibles, puis on trie client-side par rating. Beaucoup + rapide.
  Future<List<ProductModel>> getPopularProducts({int limit = 10}) async {
    dev.log('[GET_POPULAR] limit=$limit', name: 'ProductService');
    final sample = await getProducts(
      activeOnly: true,
      limit: 30,
    );
    sample.sort((a, b) => b.rating.compareTo(a.rating));
    final out = sample.length <= limit ? sample : sample.sublist(0, limit);
    dev.log('[GET_POPULAR] échantillon=${sample.length} → top=${out.length}', name: 'ProductService');
    if (out.isNotEmpty) {
      dev.log('[GET_POPULAR] top 1: "${out.first.name}" rating=${out.first.rating}', name: 'ProductService');
    }
    return out;
  }

  Future<ProductModel?> getProductById(String id) async {
    dev.log('[GET_BY_ID] id=$id', name: 'ProductService');
    final doc = await _productsCollection.doc(id).get();
    if (!doc.exists) {
      dev.log('[GET_BY_ID] ⚠️ Document introuvable ($id)', name: 'ProductService', level: 900);
      return null;
    }
    final p = ProductModel.fromMap(doc.data() as Map<String, dynamic>, doc.id);
    dev.log('[GET_BY_ID] OK: "${p.name}" slug="${p.slug}" hidden=${p.hidden} soldOut=${p.soldOut}', name: 'ProductService');
    return p;
  }

  /// Stream temps réel LIMITÉ (50 par défaut).
  ///
  /// Mode sécurisé : pas de `where(hidden)` serveur → index auto OK.
  /// Le filtre `hidden=false` est appliqué côté client après réception.
  Stream<List<ProductModel>> getProductsStream({int limit = 50}) {
    final effectiveLimit =
        _useOptimizedServerFilters ? limit : (limit > 0 ? limit * 5 : 200);
    final query = _useOptimizedServerFilters
        ? _productsCollection
            .where('hidden', isEqualTo: false)
            .orderBy('createdAt', descending: true)
            .limit(limit)
        : _productsCollection
            .orderBy('createdAt', descending: true)
            .limit(effectiveLimit);
    return query.snapshots().map((snapshot) {
      final all = snapshot.docs
          .map((doc) => ProductModel.fromMap(doc.data(), doc.id))
          .toList();
      if (!_useOptimizedServerFilters) {
        return all.where((p) => !p.hidden).toList();
      }
      return all;
    });
  }

  /// Stream TEMPS RÉEL (sans where hidden = mode sécurisé auto).
  Stream<List<ProductModel>> getAllProductsStream({int limit = 100}) {
    return _productsCollection
        .orderBy('createdAt', descending: true)
        .limit(limit)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => ProductModel.fromMap(doc.data(), doc.id))
            .toList());
  }

  Future<String> addProduct(ProductModel product) async {
    final id = product.slug?.trim().isNotEmpty == true
        ? product.slug!
        : _productsCollection.doc().id;

    final data = Map<String, dynamic>.from(product.toMap());
    final createdAt = product.createdAt;
    data['createdAt'] = createdAt.millisecondsSinceEpoch;
    data['updatedAt'] = DateTime.now().millisecondsSinceEpoch;

    try {
      await _productsCollection.doc(id).set(data);
    } catch (e) {
      rethrow;
    }
    return id;
  }

  Future<void> addProductWithId(String id, Map<String, dynamic> data) async {
    try {
      await _productsCollection.doc(id).set(data);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> updateProduct(String id, Map<String, dynamic> data) async {
    bool removedEmptyImage = false;
    bool removedEmptyGallery = false;
    if (data.containsKey('image')) {
      final img = data['image'];
      if (img == null || (img is String && img.trim().isEmpty)) {
        data.remove('image');
        removedEmptyImage = true;
      }
    }
    if (data.containsKey('gallery')) {
      final gal = data['gallery'];
      if (gal == null || (gal is List && gal.isEmpty)) {
        data.remove('gallery');
        removedEmptyGallery = true;
      }
    }

    try {
      await _productsCollection.doc(id).update(data);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> deleteProduct(String id) async {
    await _productsCollection.doc(id).delete();
  }
}
