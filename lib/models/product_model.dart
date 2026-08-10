class ProductModel {
  final String id;
  final String name;
  final String description;
  final double price;
  final double? oldPrice;
  final double? compareAtPriceValue;
  final List<String> images;
  final String categoryId;
  final String categoryName;
  final String category;
  final int stock;
  final double rating;
  final int reviewCount;
  final bool isActive;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final String? brand;
  final bool isFavorite;
  final String sku;
  final String? barcode;
  final String shortDescription;
  final String? videoUrl;
  final double? promoPrice;
  final DateTime? promoStart;
  final DateTime? promoEnd;
  final int minStock;
  final double weight;
  final String dimensions;
  final String seoTitle;
  final String seoDescription;
  final String seoUrl;
  final List<String> variants;
  final List<String>? _colors;
  List<String> get colors => _colors ?? const [];
  final String status;

  // Champs UNIFORMES partagés avec le site web
  final String? slug;
  final String? image; // image principale
  final List<Map<String, String>> gallery; // [{src, alt}]
  final Map<String, int> stockBySize; // Stock web par taille
  final List<String> sizes; // Tailles (identique variants pour legacy)
  final bool soldOut;
  final bool hidden;

  // === Champs optionnels WEB (identiques web <-> mobile) ===
  final Map<String, dynamic>? badge; // {label, tone}
  final String? authenticityLabel;
  final String? deliveryLabel;
  final String? deliveryRegion;

  const ProductModel({
    required this.id,
    required this.name,
    required this.description,
    this.price = 0,
    this.oldPrice,
    this.compareAtPriceValue,
    this.images = const [],
    this.categoryId = '',
    this.categoryName = '',
    this.category = '',
    this.stock = 0,
    this.rating = 4.5,
    this.reviewCount = 0,
    this.isActive = true,
    required this.createdAt,
    this.updatedAt,
    this.brand,
    this.isFavorite = false,
    this.sku = '',
    this.barcode,
    this.shortDescription = '',
    this.videoUrl,
    this.promoPrice,
    this.promoStart,
    this.promoEnd,
    this.minStock = 0,
    this.weight = 0,
    this.dimensions = '',
    this.seoTitle = '',
    this.seoDescription = '',
    this.seoUrl = '',
    this.variants = const [],
    List<String>? colors,
    this.status = 'Publié',
    // Champs partagés web
    this.slug,
    this.image,
    this.gallery = const [],
    this.stockBySize = const {},
    this.sizes = const [],
    this.soldOut = false,
    this.hidden = false,
    this.badge,
    this.authenticityLabel,
    this.deliveryLabel,
    this.deliveryRegion,
  }) : _colors = colors;

  factory ProductModel.fromMap(Map<String, dynamic> map, String id) {
    // Détecter si c'est un produit web (structure du site web)
    final isWebFormat = map.containsKey('priceValue') || map.containsKey('slug');

    if (isWebFormat) {
      return _parseWebProduct(map, id);
    }
    return _parseMobileProduct(map, id);
  }

  String get imageUrl => images.isNotEmpty ? images.first : (image ?? '');
  int get reviews => reviewCount;

  double? get discountPercent {
    if (oldPrice == null || oldPrice! <= price || oldPrice! <= 0) return null;
    return (((oldPrice! - price) / oldPrice!) * 100).roundToDouble();
  }

  Map<String, dynamic> toMap() {
    final now = DateTime.now();
    final updatedAtMillis = (updatedAt ?? now).millisecondsSinceEpoch;
    final finalSizes = sizes.isNotEmpty ? sizes : variants;
    final finalSoldOut = soldOut;
    final finalOldPrice = compareAtPriceValue ?? oldPrice ?? promoPrice;
    final finalBrand = (brand != null && brand!.isNotEmpty)
        ? brand
        : 'Coin Original';
    final finalCategory = _normalizeCategory(() {
      final c = (categoryId.isNotEmpty ? categoryId : categoryName);
      return c.isNotEmpty ? c : (category.isNotEmpty ? category : (slug ?? id));
    }());
    final finalAuthenticity = (authenticityLabel != null && authenticityLabel!.isNotEmpty)
        ? authenticityLabel
        : 'Original Authentique';
    final finalDeliveryLabel = (deliveryLabel != null && deliveryLabel!.isNotEmpty)
        ? deliveryLabel
        : 'PAIEMENT A LA LIVRAISON';
    final finalDeliveryRegion = (deliveryRegion != null && deliveryRegion!.isNotEmpty)
        ? deliveryRegion
        : 'MAROC';
    final galleryItems = gallery.isNotEmpty
        ? gallery
            .map((g) => <String, dynamic>{'src': g['src'] ?? '', 'alt': g['alt'] ?? ''})
            .toList()
        : [
            if (image != null && image!.isNotEmpty)
              <String, dynamic>{'src': image!, 'alt': name}
          ];
    final mainImage = () {
      if (image != null && image!.isNotEmpty) return image!;
      if (images.isNotEmpty) return images.first;
      if (galleryItems.isNotEmpty) {
        final src = galleryItems.first['src'];
        return (src is String) ? src : '';
      }
      return '';
    }();

    return {
      // === Champs UNIFIÉS partagés avec le site web ===
      'slug': slug ?? slugifyProductName(name),
      'brand': finalBrand,
      'category': finalCategory,
      'name': name,
      'priceValue': price,
      'description': description,
      'image': mainImage,
      'gallery': galleryItems,
      'sizes': finalSizes,
      'soldOut': finalSoldOut,
      'hidden': hidden,
      'colors': colors,
      'createdAt': createdAt.millisecondsSinceEpoch,
      'updatedAt': updatedAtMillis,
      'authenticityLabel': finalAuthenticity,
      'deliveryLabel': finalDeliveryLabel,
      'deliveryRegion': finalDeliveryRegion,

      // === Champs optionnels web ===
      if (badge != null && badge!.isNotEmpty) 'badge': badge,
      if (finalOldPrice != null && finalOldPrice > 0 && finalOldPrice > price)
        'compareAtPriceValue': finalOldPrice,

      // === Champs spécifiques mobile (non gérés côté web) ===
      // (le web utilise updateDoc donc ces champs ne sont PAS effacés)
      if (sku.isNotEmpty) 'sku': sku,
      if (barcode != null && barcode!.isNotEmpty) 'barcode': barcode,
      if (shortDescription.isNotEmpty) 'shortDescription': shortDescription,
      if (videoUrl != null && videoUrl!.isNotEmpty) 'videoUrl': videoUrl,
      if (promoStart != null)
        'promoStart': promoStart!.millisecondsSinceEpoch,
      if (promoEnd != null) 'promoEnd': promoEnd!.millisecondsSinceEpoch,
      if (weight > 0) 'weight': weight,
      if (dimensions.isNotEmpty) 'dimensions': dimensions,
      if (seoTitle.isNotEmpty) 'seoTitle': seoTitle,
      if (seoDescription.isNotEmpty) 'seoDescription': seoDescription,
      if (seoUrl.isNotEmpty) 'seoUrl': seoUrl,
    };
  }

  ProductModel copyWith({
    String? id,
    String? name,
    String? description,
    double? price,
    double? oldPrice,
    double? compareAtPriceValue,
    List<String>? images,
    String? categoryId,
    String? categoryName,
    String? category,
    int? stock,
    double? rating,
    int? reviewCount,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? brand,
    bool? isFavorite,
    String? sku,
    String? barcode,
    String? shortDescription,
    String? videoUrl,
    double? promoPrice,
    DateTime? promoStart,
    DateTime? promoEnd,
    int? minStock,
    double? weight,
    String? dimensions,
    String? seoTitle,
    String? seoDescription,
    String? seoUrl,
    List<String>? variants,
    List<String>? colors,
    String? status,
    String? slug,
    String? image,
    List<Map<String, String>>? gallery,
    Map<String, int>? stockBySize,
    List<String>? sizes,
    bool? soldOut,
    bool? hidden,
    Map<String, dynamic>? badge,
    String? authenticityLabel,
    String? deliveryLabel,
    String? deliveryRegion,
  }) {
    return ProductModel(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      oldPrice: oldPrice ?? this.oldPrice,
      compareAtPriceValue: compareAtPriceValue ?? this.compareAtPriceValue,
      images: images ?? this.images,
      categoryId: categoryId ?? this.categoryId,
      categoryName: categoryName ?? this.categoryName,
      category: category ?? this.category,
      stock: stock ?? this.stock,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      brand: brand ?? this.brand,
      isFavorite: isFavorite ?? this.isFavorite,
      sku: sku ?? this.sku,
      barcode: barcode ?? this.barcode,
      shortDescription: shortDescription ?? this.shortDescription,
      videoUrl: videoUrl ?? this.videoUrl,
      promoPrice: promoPrice ?? this.promoPrice,
      promoStart: promoStart ?? this.promoStart,
      promoEnd: promoEnd ?? this.promoEnd,
      minStock: minStock ?? this.minStock,
      weight: weight ?? this.weight,
      dimensions: dimensions ?? this.dimensions,
      seoTitle: seoTitle ?? this.seoTitle,
      seoDescription: seoDescription ?? this.seoDescription,
      seoUrl: seoUrl ?? this.seoUrl,
      variants: variants ?? this.variants,
      colors: colors ?? this.colors,
      status: status ?? this.status,
      slug: slug ?? this.slug,
      image: image ?? this.image,
      gallery: gallery ?? this.gallery,
      stockBySize: stockBySize ?? this.stockBySize,
      sizes: sizes ?? this.sizes,
      soldOut: soldOut ?? this.soldOut,
      hidden: hidden ?? this.hidden,
      badge: badge ?? this.badge,
      authenticityLabel: authenticityLabel ?? this.authenticityLabel,
      deliveryLabel: deliveryLabel ?? this.deliveryLabel,
      deliveryRegion: deliveryRegion ?? this.deliveryRegion,
    );
  }
}

// Parse un produit au format Web (Firebase du site web)
ProductModel _parseWebProduct(Map<String, dynamic> map, String id) {
  // Gestion des images web
  String? mainImage;
  List<String> allImages = [];
  List<Map<String, String>> gallery = [];

  final rawGallery = map['gallery'];
  if (rawGallery is List) {
    for (final item in rawGallery) {
      if (item is Map) {
        final src = item['src']?.toString() ?? '';
        final alt = item['alt']?.toString() ?? '';
        if (src.isNotEmpty) {
          gallery.add({'src': src, 'alt': alt});
          allImages.add(src);
        }
      }
    }
  }

  // Fallback sur le champ 'image' simple
  final simpleImage = map['image']?.toString() ?? '';
  if (simpleImage.isNotEmpty && allImages.isEmpty) {
    allImages = [simpleImage];
    gallery = [{'src': simpleImage, 'alt': 'Image principale'}];
  }
  if (mainImage == null || mainImage.isEmpty) {
    mainImage = simpleImage.isNotEmpty ? simpleImage : (allImages.isNotEmpty ? allImages.first : null);
  }

  // Gestion du prix web
  double price = 0;
  final rawPriceValue = map['priceValue'];
  if (rawPriceValue is num) {
    price = rawPriceValue.toDouble();
  } else if (rawPriceValue is String && rawPriceValue.isNotEmpty) {
    price = double.tryParse(rawPriceValue) ?? 0;
  }

  double? compareAtPrice;
  final rawCompareAtPrice = map['compareAtPriceValue'];
  if (rawCompareAtPrice is num) {
    compareAtPrice = rawCompareAtPrice.toDouble();
  } else if (rawCompareAtPrice is String && rawCompareAtPrice.isNotEmpty) {
    compareAtPrice = double.tryParse(rawCompareAtPrice);
  }

  // Stock web
  int totalStock = 0;
  final Map<String, int> stockBySize = {};
  final rawStockBySize = map['stockBySize'];
  if (rawStockBySize is Map) {
    rawStockBySize.forEach((key, value) {
      final qty = _toInt(value);
      stockBySize[key.toString()] = qty;
      totalStock += qty;
    });
  }

  // Tailles web
  List<String> sizes = [];
  final rawSizes = map['sizes'];
  if (rawSizes is List) {
    sizes = rawSizes.map((e) => e.toString()).toList();
  }

  // Couleurs web
  List<String> colors = [];
  final rawColors = map['colors'];
  if (rawColors is List) {
    colors = rawColors.map((e) => e.toString()).toList();
  }

  // Date web (timestamp en ms)
  DateTime createdAt;
  final rawCreatedAt = map['createdAt'];
  if (rawCreatedAt is int) {
    createdAt = DateTime.fromMillisecondsSinceEpoch(rawCreatedAt);
  } else if (rawCreatedAt is String && rawCreatedAt.isNotEmpty) {
    createdAt = DateTime.tryParse(rawCreatedAt) ?? DateTime.now();
  } else {
    createdAt = DateTime.now();
  }

  DateTime? updatedAt;
  final rawUpdatedAt = map['updatedAt'];
  if (rawUpdatedAt is int) {
    updatedAt = DateTime.fromMillisecondsSinceEpoch(rawUpdatedAt);
  } else if (rawUpdatedAt is String && rawUpdatedAt.isNotEmpty) {
    updatedAt = DateTime.tryParse(rawUpdatedAt);
  }

  // Catégorie web (format unifié 'category')
  final category = () {
    final c = (map['category'] as String?) ?? '';
    if (c.isNotEmpty) return c;
    final cId = (map['categoryId'] as String?) ?? '';
    if (cId.isNotEmpty) return cId;
    final cName = (map['categoryName'] as String?) ?? '';
    if (cName.isNotEmpty) return cName;
    return 'Vetements';
  }();

  final brand = (map['brand'] as String?) ?? 'Coin Original';

  final soldOut = (map['soldOut'] ?? false) as bool;
  final hidden = (map['hidden'] ?? false) as bool;
  final dynamic badgeRaw = map['badge'];
  final Map<String, dynamic>? badge = badgeRaw is Map
      ? badgeRaw.cast<String, dynamic>()
      : null;
  final String? authenticityLabel = map['authenticityLabel']?.toString();
  final String? deliveryLabel = map['deliveryLabel']?.toString();
  final String? deliveryRegion = map['deliveryRegion']?.toString();

  return ProductModel(
    id: id,
    slug: map['slug']?.toString() ?? id,
    brand: brand,
    category: category,
    categoryId: category,
    categoryName: category,
    name: (map['name'] ?? '') as String,
    description: (map['description'] ?? '') as String,
    price: price,
    oldPrice: compareAtPrice,
    compareAtPriceValue: compareAtPrice,
    promoPrice: compareAtPrice,
    images: allImages,
    image: mainImage,
    gallery: gallery,
    stock: soldOut ? 0 : totalStock,
    stockBySize: stockBySize,
    sizes: sizes,
    variants: sizes,
    colors: colors,
    rating: _normalizedRating(
      map['rating'] ?? map['averageRating'],
      fallbackKey: '$id|${map['name'] ?? ''}',
    ),
    reviewCount: _normalizedReviewCount(
      map['reviewCount'] ?? map['reviews'],
      fallbackKey: '$id|${map['name'] ?? ''}',
    ),
    isActive: !hidden,
    createdAt: createdAt,
    updatedAt: updatedAt,
    sku: map['sku']?.toString() ?? id,
    barcode: map['barcode']?.toString(),
    shortDescription:
        (map['shortDescription'] ?? map['description'] ?? '') as String,
    videoUrl: map['videoUrl']?.toString(),
    promoStart:
        map['promoStart'] == null ? null : _parseDate(map['promoStart']),
    promoEnd: map['promoEnd'] == null ? null : _parseDate(map['promoEnd']),
    minStock: _toInt(map['minStock']),
    weight: _toDouble(map['weight']),
    dimensions: (map['dimensions'] ?? '') as String,
    seoTitle: (map['seoTitle'] ?? '') as String,
    seoDescription: (map['seoDescription'] ?? '') as String,
    seoUrl: (map['slug']?.toString() ?? map['seoUrl']?.toString() ?? '') as String,
    status: (map['status'] ??
        (soldOut ? 'Hors stock' : (hidden ? 'Masqué' : 'Publié'))) as String,
    soldOut: soldOut,
    hidden: hidden,
    badge: badge,
    authenticityLabel: authenticityLabel,
    deliveryLabel: deliveryLabel,
    deliveryRegion: deliveryRegion,
  );
}

// Parse un produit au format Mobile (structure legacy de l'app)
ProductModel _parseMobileProduct(Map<String, dynamic> map, String id) {
  // === Images (format legacy: 'images' list + simple 'image' + gallery) ===
  final image = map['image'] as String?;
  List<String> images = [];
  List<Map<String, String>> gallery = [];

  final rawGallery = map['gallery'];
  if (rawGallery is List) {
    for (final item in rawGallery) {
      if (item is Map) {
        final src = (item['src'] ??
                item['url'] ??
                item['imageUrl'] ??
                item['path'] ??
                '')
            .toString();
        final alt =
            (item['alt'] ?? item['title'] ?? '').toString();
        if (src.isNotEmpty) {
          gallery.add({'src': src, 'alt': alt});
          if (!images.contains(src)) images.add(src);
        }
      }
    }
  }

  final rawImages = map['images'];
  if (rawImages is List) {
    for (final item in rawImages) {
      String url = '';
      if (item is String) {
        url = item;
      } else if (item is Map) {
        url = (item['url'] ??
                item['imageUrl'] ??
                item['src'] ??
                item['path'] ??
                '')
            .toString();
      }
      if (url.isNotEmpty && !images.contains(url)) {
        images.add(url);
        gallery.add({'src': url, 'alt': 'Image'});
      }
    }
  }

  if (images.isEmpty && image != null && image.isNotEmpty) {
    images = [image];
    gallery = [{'src': image, 'alt': 'Image principale'}];
  }
  final mainImage =
      image != null && image.isNotEmpty ? image : (images.isNotEmpty ? images.first : null);

  // === Prix (format legacy: price + oldPrice/promoPrice) ===
  double price = 0;
  double? oldPrice;

  final rawPrice = map['priceValue'] ?? map['price'];
  if (rawPrice is num) {
    price = rawPrice.toDouble();
  } else if (rawPrice is String && rawPrice.isNotEmpty) {
    price = double.tryParse(rawPrice) ?? 0;
  }

  final rawOld = map['compareAtPriceValue'] ?? map['oldPrice'] ?? map['promoPrice'];
  if (rawOld is num) {
    oldPrice = rawOld.toDouble();
  } else if (rawOld is String && rawOld.isNotEmpty) {
    oldPrice = double.tryParse(rawOld);
  }

  // === Catégorie (format legacy: categoryId/categoryName/category unifiés) ===
  final category = () {
    final cId = (map['categoryId'] as String?) ?? '';
    if (cId.isNotEmpty) return cId;
    final cName = (map['categoryName'] as String?) ?? '';
    if (cName.isNotEmpty) return cName;
    return (map['category'] as String?) ?? '';
  }();

  // === Sizes/Stock: legacy 'variants' + stockBySize ===
  List<String> sizes = [];
  final Map<String, int> stockBySize = {};
  int stock = 0;

  final rawVariants = map['variants'] ?? map['sizes'];
  if (rawVariants is List) {
    sizes = rawVariants.map((e) => e.toString()).toList();
  }

  final rawStockMap = map['stockBySize'];
  if (rawStockMap is Map) {
    rawStockMap.forEach((k, v) {
      final qty = _toInt(v);
      stockBySize[k.toString()] = qty;
      stock += qty;
    });
    if (sizes.isEmpty) sizes = stockBySize.keys.toList();
  }

  if (stock <= 0) {
    final rawStock = map['stock'];
    stock = _toInt(rawStock);
  }
  if (sizes.isEmpty && stock > 0) {
    sizes = ['Taille unique'];
    stockBySize['Taille unique'] = stock;
  }

  // Couleurs
  List<String> colors = [];
  final rawColors = map['colors'];
  if (rawColors is List) {
    colors = rawColors.map((e) => e.toString()).toList();
  }

  // soldOut / hidden (format legacy: isActive + status + soldOut/hidden)
  final explicitHidden = map['hidden'];
  final explicitSoldOut = map['soldOut'];
  final isActiveLegacy = map['isActive'];
  final statusLegacy = map['status'] as String?;
  final bool hidden = () {
    if (explicitHidden is bool) return explicitHidden;
    if (isActiveLegacy is bool) return !isActiveLegacy;
    return statusLegacy == 'Masqué' || statusLegacy == 'Brouillon';
  }();
  final bool soldOut = () {
    if (explicitSoldOut is bool) return explicitSoldOut;
    if (statusLegacy == 'Hors stock') return true;
    if (stock <= 0 && stockBySize.isEmpty) return false;
    return stock <= 0;
  }();

  final brand = (map['brand'] as String?) ?? 'Coin Original';
  final dynamic badgeRaw = map['badge'];
  final Map<String, dynamic>? badge = badgeRaw is Map
      ? badgeRaw.cast<String, dynamic>()
      : null;
  final String? authenticityLabel = map['authenticityLabel']?.toString();
  final String? deliveryLabel = map['deliveryLabel']?.toString();
  final String? deliveryRegion = map['deliveryRegion']?.toString();

  return ProductModel(
    id: id,
    slug: (map['slug'] as String?) ?? id,
    brand: brand,
    categoryId: category,
    categoryName: category,
    category: category,
    name: (map['name'] ?? '') as String,
    description: (map['description'] ?? '') as String,
    price: price,
    oldPrice: oldPrice,
    compareAtPriceValue: oldPrice,
    promoPrice: oldPrice,
    images: images,
    image: mainImage,
    gallery: gallery,
    stock: stock,
    stockBySize: stockBySize,
    sizes: sizes,
    variants: sizes,
    colors: colors,
    rating: _normalizedRating(
      map['rating'],
      fallbackKey: '$id|${map['name'] ?? ''}',
    ),
    reviewCount: _normalizedReviewCount(
      map['reviewCount'] ?? map['reviews'],
      fallbackKey: '$id|${map['name'] ?? ''}',
    ),
    isActive: !hidden,
    createdAt: _parseDate(map['createdAt']),
    updatedAt: _parseDate(map['updatedAt']),
    sku: (map['sku'] as String?) ?? '',
    barcode: map['barcode'] as String?,
    isFavorite: (map['isFavorite'] ?? false) as bool,
    shortDescription: (map['shortDescription'] ?? '') as String,
    videoUrl: map['videoUrl'] as String?,
    promoStart:
        map['promoStart'] == null ? null : _parseDate(map['promoStart']),
    promoEnd: map['promoEnd'] == null ? null : _parseDate(map['promoEnd']),
    minStock: _toInt(map['minStock']),
    weight: _toDouble(map['weight']),
    dimensions: (map['dimensions'] ?? '') as String,
    seoTitle: (map['seoTitle'] ?? '') as String,
    seoDescription: (map['seoDescription'] ?? '') as String,
    seoUrl: (map['seoUrl'] as String?) ?? (map['slug'] as String?) ?? '',
    status:
        statusLegacy ?? (soldOut ? 'Hors stock' : (hidden ? 'Masqué' : 'Publié')),
    soldOut: soldOut,
    hidden: hidden,
    badge: badge,
    authenticityLabel: authenticityLabel,
    deliveryLabel: deliveryLabel,
    deliveryRegion: deliveryRegion,
  );
}

// === Fonctions helpers identiques au web (slugify + normalizeCategory) ===
String slugifyProductName(String value) {
  // Même logique que TS: slugifyProductName (NFD → retrait accents → lowercase → trim → regex [^a-z0-9]+ -> -)
  final buffer = StringBuffer();
  for (final rune in value.runes) {
    final ch = String.fromCharCode(rune);
    buffer.write(ch);
  }
  final composed = buffer.toString();

  // Décomposition NFD simple: retirer accents courants
  final withoutAccents = composed
      .replaceAllMapped(RegExp(r'[À-ÿ]'), (m) {
        final c = m.group(0)!;
        return _removeAccent(c);
      });

  return withoutAccents
      .toLowerCase()
      .trim()
      .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
      .replaceAll(RegExp(r'^-+|-+$'), '');
}

String _removeAccent(String ch) {
  const accentMap = {
    'à': 'a', 'â': 'a', 'ä': 'a', 'á': 'a', 'ã': 'a', 'å': 'a', 'æ': 'ae',
    'À': 'a', 'Â': 'a', 'Ä': 'a', 'Á': 'a', 'Ã': 'a', 'Å': 'a',
    'ç': 'c', 'Ç': 'c',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'É': 'e', 'È': 'e', 'Ê': 'e', 'Ë': 'e',
    'î': 'i', 'ï': 'i', 'í': 'i', 'ì': 'i',
    'Î': 'i', 'Ï': 'i', 'Í': 'i', 'Ì': 'i',
    'ô': 'o', 'ö': 'o', 'ó': 'o', 'ò': 'o', 'õ': 'o', 'œ': 'oe',
    'Ô': 'o', 'Ö': 'o', 'Ó': 'o', 'Ò': 'o', 'Õ': 'o',
    'û': 'u', 'ü': 'u', 'ú': 'u', 'ù': 'u',
    'Û': 'u', 'Ü': 'u', 'Ú': 'u', 'Ù': 'u',
    'ñ': 'n', 'Ñ': 'n',
    'ÿ': 'y', 'Ÿ': 'y',
  };
  return accentMap[ch] ?? ch;
}

/// Normalise une catégorie exactement comme le web:
///   Chaussures -> Chaussures  |  Accessoires -> Accessoires  |  sinon -> Vetements
String _normalizeCategory(String raw) {
  if (raw == 'Chaussures' || raw == 'Accessoires') return raw;
  return 'Vetements';
}

double _toDouble(dynamic value) {
  if (value is num) return value.toDouble();
  if (value is String && value.isNotEmpty) {
    return double.tryParse(value) ?? 0;
  }
  return 0;
}

int _toInt(dynamic value) {
  if (value is int) return value;
  if (value is num) return value.toInt();
  if (value is String && value.isNotEmpty) {
    return int.tryParse(value) ?? 0;
  }
  return 0;
}

double _normalizedRating(dynamic value, {required String fallbackKey}) {
  final rating = _toDouble(value);
  if (rating > 0) {
    return rating.clamp(3.8, 5.0).toDouble();
  }
  return _fallbackRating(fallbackKey);
}

int _normalizedReviewCount(dynamic value, {required String fallbackKey}) {
  final reviewCount = _toInt(value);
  if (reviewCount > 0) return reviewCount;
  return _fallbackReviewCount(fallbackKey);
}

double _fallbackRating(String seedSource) {
  final seed = _stableSeed(seedSource);
  final raw = 38 + (seed % 13); // 3.8 -> 5.0
  return raw / 10;
}

int _fallbackReviewCount(String seedSource) {
  final seed = _stableSeed(seedSource);
  return 12 + (seed % 189);
}

int _stableSeed(String source) {
  var total = 0;
  for (final unit in source.codeUnits) {
    total = ((total * 31) + unit) % 100000;
  }
  return total;
}

DateTime _parseDate(dynamic value) {
  if (value is DateTime) return value;
  if (value is String && value.isNotEmpty) {
    return DateTime.tryParse(value) ?? DateTime.now();
  }
  if (value is int) {
    return DateTime.fromMillisecondsSinceEpoch(value);
  }
  if (value != null) {
    try {
      return (value as dynamic).toDate() as DateTime;
    } catch (_) {}
  }
  return DateTime.now();
}
