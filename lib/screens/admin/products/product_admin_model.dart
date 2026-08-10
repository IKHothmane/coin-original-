class Product {
  final String id;
  final String name;
  final String sku;
  final String? barcode;
  final String description;
  final String shortDescription;
  final List<String> images;
  final String? videoUrl;
  final double price;
  final double? promoPrice;
  final DateTime? promoStart;
  final DateTime? promoEnd;
  final int stock;
  final int minStock;
  final double weight;
  final String dimensions;
  final String seoTitle;
  final String seoDescription;
  final String seoUrl;
  final List<String> variants;
  final String status;
  final DateTime createdAt;

  const Product({
    required this.id,
    required this.name,
    required this.sku,
    this.barcode,
    required this.description,
    required this.shortDescription,
    required this.images,
    this.videoUrl,
    required this.price,
    this.promoPrice,
    this.promoStart,
    this.promoEnd,
    required this.stock,
    required this.minStock,
    required this.weight,
    required this.dimensions,
    required this.seoTitle,
    required this.seoDescription,
    required this.seoUrl,
    required this.variants,
    required this.status,
    required this.createdAt,
  });
}
