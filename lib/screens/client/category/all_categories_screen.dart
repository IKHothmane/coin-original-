import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/providers/favorites_provider.dart';
import 'package:coin_original_mobile/providers/product_provider.dart';
import 'package:coin_original_mobile/screens/client/category/categoryscreen.dart';
import 'package:coin_original_mobile/utils/helpers.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';

const double _kScale = 0.8;
double _s(double value) => value * _kScale;

class CategoryItem {
  final String id;
  final String name;
  final String iconAsset;
  final Color bgColor;

  const CategoryItem({
    required this.id,
    required this.name,
    required this.iconAsset,
    required this.bgColor,
  });
}

class CatalogPreviewProduct {
  final String categoryName;
  final CategoryProduct product;

  const CatalogPreviewProduct({
    required this.categoryName,
    required this.product,
  });
}

class AllCategoriesScreen extends StatefulWidget {
  const AllCategoriesScreen({super.key});

  static final List<CategoryItem> _categories = [
    CategoryItem(
      id: 'shoes',
      name: 'Chaussures',
      iconAsset: 'assets/icons/category_shoes.svg',
      bgColor: const Color(0xFFF3B37E),
    ),
    CategoryItem(
      id: 'clothes',
      name: 'Vetements',
      iconAsset: 'assets/icons/category_clothes.svg',
      bgColor: const Color(0xFFBCC8F1),
    ),
    CategoryItem(
      id: 'accessories',
      name: 'Accessoires',
      iconAsset: 'assets/icons/category_accessories.svg',
      bgColor: const Color(0xFFD9C8EE),
    ),
  ];

  @override
  State<AllCategoriesScreen> createState() => _AllCategoriesScreenState();
}

class _AllCategoriesScreenState extends State<AllCategoriesScreen> {
  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProductProvider>();
    final catalogProducts = _catalogProducts(provider.products);
    final allProducts = _allProducts(catalogProducts);

    return Scaffold(
      backgroundColor: const Color(0xFFF6F6F6),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF6F6F6),
        surfaceTintColor: const Color(0xFFF6F6F6),
        elevation: 0,
        title: Text(
          'Toutes les categories',
          style: TextStyle(
            color: Colors.black,
            fontSize: _s(20),
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.fromLTRB(_s(20), _s(8), _s(20), _s(20)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Coin Original',
                    style: TextStyle(
                      color: const Color(0xFF2A2A2A),
                      fontSize: _s(18),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  SizedBox(width: _s(4)),
                  Icon(Icons.verified, size: _s(16), color: Colors.blue.shade600),
                ],
              ),
            ),
            SizedBox(height: _s(4)),
            Center(
              child: Text(
                'Explorez nos ${AllCategoriesScreen._categories.length} categories  •  ${allProducts.length} produits',
                style: TextStyle(
                  color: Colors.grey.shade600,
                  fontSize: _s(13),
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            SizedBox(height: _s(18)),
            SizedBox(
              height: _s(132),
              child: Row(
                children: List.generate(AllCategoriesScreen._categories.length, (index) {
                  final category = AllCategoriesScreen._categories[index];
                  final categoryProducts = _productsForCategory(catalogProducts, category);
                  return Expanded(
                    child: Padding(
                      padding: EdgeInsets.only(
                        right: index == AllCategoriesScreen._categories.length - 1 ? 0 : _s(10),
                      ),
                      child: _buildCategoryCard(context, category, categoryProducts),
                    ),
                  );
                }),
              ),
            ),
            SizedBox(height: _s(22)),
            Text(
              'Tous les produits',
              style: TextStyle(
                fontSize: _s(18),
                fontWeight: FontWeight.w700,
                color: Colors.black,
              ),
            ),
            SizedBox(height: _s(6)),
            Text(
              'Affichage de tous les produits des categories de l\'accueil',
              style: TextStyle(
                fontSize: _s(12),
                color: Colors.grey.shade600,
                fontWeight: FontWeight.w500,
              ),
            ),
            SizedBox(height: _s(16)),
            if (provider.isLoading && allProducts.isEmpty)
              const Center(child: CircularProgressIndicator())
            else if (allProducts.isEmpty)
              Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: _s(30)),
                  child: Text(
                    'Aucun produit trouve dans la base',
                    style: TextStyle(
                      fontSize: _s(14),
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              )
            else
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: allProducts.length,
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: _s(16),
                  crossAxisSpacing: _s(16),
                  childAspectRatio: 0.68,
                ),
                itemBuilder: (context, index) {
                  return _buildProductCard(context, allProducts[index], catalogProducts);
                },
              ),
          ],
        ),
      ),
    );
  }

  List<ProductModel> _catalogProducts(List<ProductModel> products) {
    final filtered = products.where((product) {
      return product.isActive && !product.hidden && product.imageUrl.isNotEmpty;
    }).toList();

    filtered.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return filtered;
  }

  List<ProductModel> _productsForCategory(
    List<ProductModel> sourceProducts,
    CategoryItem category,
  ) {
    return sourceProducts.where((product) {
      final categoryId = product.categoryId.toLowerCase();
      final categoryName = product.categoryName.toLowerCase();
      final label = category.name.toLowerCase();

      if (categoryId == category.id.toLowerCase()) {
        return true;
      }

      if (categoryName == label) {
        return true;
      }

      return _displayCategoryLabel(
            product.categoryName.isNotEmpty ? product.categoryName : product.categoryId,
            0,
          ).toLowerCase() ==
          label;
    }).toList();
  }

  List<CatalogPreviewProduct> _allProducts(List<ProductModel> sourceProducts) {
    return AllCategoriesScreen._categories.expand((category) {
      return _productsForCategory(sourceProducts, category).map(
        (product) => CatalogPreviewProduct(
          categoryName: category.name,
          product: _toCategoryProduct(product),
        ),
      );
    }).toList();
  }

  CategoryProduct _toCategoryProduct(ProductModel product) {
    return CategoryProduct(
      id: product.id,
      brand: product.brand ?? 'Coin Original',
      name: product.name,
      price: Helpers.formatPrice(product.price),
      rating: product.rating,
      reviews: product.reviewCount,
      image: product.imageUrl,
      sourceProduct: product,
    );
  }

  String _displayCategoryLabel(String label, int index) {
    final name = label.toLowerCase();
    if (name.contains('shoe') || name.contains('sneaker') || name.contains('chauss')) {
      return 'Chaussures';
    }
    if (name.contains('shirt') || name.contains('vêt') || name.contains('habit') || name.contains('cloth')) {
      return 'Vetements';
    }
    if (name.contains('access') || name.contains('bag') || name.contains('sac')) {
      return 'Accessoires';
    }

    const defaults = ['Chaussures', 'Vetements', 'Accessoires'];
    return defaults[index % defaults.length];
  }

  Widget _buildCategoryCard(
    BuildContext context,
    CategoryItem category,
    List<ProductModel> categoryProducts,
  ) {
    return GestureDetector(
      onTap: () {
        if (categoryProducts.isEmpty) return;
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CategoryScreen(
              categoryName: category.name,
              products: categoryProducts.map(_toCategoryProduct).toList(),
            ),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(_s(16)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: _s(8),
              offset: Offset(0, _s(2)),
            ),
          ],
        ),
        child: Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.topCenter,
          children: [
            Positioned(
              left: _s(8),
              right: _s(8),
              bottom: 0,
              child: Container(
                height: _s(66),
                decoration: BoxDecoration(
                  color: category.bgColor,
                  borderRadius: BorderRadius.circular(_s(18)),
                ),
              ),
            ),
            Positioned(
              top: _s(28),
              child: Container(
                width: _s(40),
                height: _s(40),
                decoration: BoxDecoration(
                  color: category.bgColor,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.08),
                      blurRadius: _s(5),
                      offset: Offset(0, _s(1)),
                    ),
                  ],
                ),
                child: Padding(
                  padding: EdgeInsets.all(_s(8)),
                  child: SvgPicture.asset(
                    category.iconAsset,
                    colorFilter: const ColorFilter.mode(Colors.white, BlendMode.srcIn),
                  ),
                ),
              ),
            ),
            Positioned.fill(
              child: Padding(
                padding: EdgeInsets.fromLTRB(_s(8), _s(24), _s(8), _s(10)),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      category.name,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: _s(11.5),
                        fontWeight: FontWeight.w700,
                        color: Colors.black,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: _s(4)),
                    Text(
                      '${categoryProducts.length} produits',
                      style: TextStyle(
                        fontSize: _s(9),
                        color: Colors.black.withValues(alpha: 0.55),
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProductCard(
    BuildContext context,
    CatalogPreviewProduct item,
    List<ProductModel> catalogProducts,
  ) {
    final product = item.product;
    final sourceProduct = product.sourceProduct ?? ProductModel(
      id: product.id,
      name: product.name,
      description: '',
      price: _parseDisplayedPrice(product.price),
      images: product.image.isEmpty ? const [] : [product.image],
      image: product.image,
      brand: product.brand,
      reviewCount: product.reviews,
      rating: product.rating,
      createdAt: DateTime.now(),
    );
    final isFavorite = context.watch<FavoritesProvider>().isFavorite(product.id);

    return GestureDetector(
      onTap: () {
        final category = AllCategoriesScreen._categories.firstWhere(
          (entry) => entry.name == item.categoryName,
        );
        final categoryProducts = _productsForCategory(catalogProducts, category);
        if (categoryProducts.isEmpty) return;

        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => CategoryScreen(
              categoryName: category.name,
              products: categoryProducts.map(_toCategoryProduct).toList(),
            ),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(_s(16)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: _s(10),
              offset: Offset(0, _s(2)),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.vertical(top: Radius.circular(_s(16))),
                    child: Container(
                      color: Colors.grey.shade50,
                      width: double.infinity,
                      child: NetworkImageWidget(
                        imageUrl: product.image.isNotEmpty ? product.image : null,
                        fit: BoxFit.contain,
                        width: double.infinity,
                        height: double.infinity,
                        errorWidget: Center(
                          child: Icon(
                            Icons.image,
                            size: _s(50),
                            color: Colors.grey.shade300,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: _s(8),
                    left: _s(8),
                    child: Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: _s(8),
                        vertical: _s(4),
                      ),
                      decoration: BoxDecoration(
                        color: _categoryColorFor(item.categoryName),
                        borderRadius: BorderRadius.circular(_s(999)),
                      ),
                      child: Text(
                        item.categoryName,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: _s(10),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: _s(8),
                    right: _s(8),
                    child: GestureDetector(
                      onTap: () => context.read<FavoritesProvider>().toggleFavorite(sourceProduct),
                      child: Container(
                        padding: EdgeInsets.all(_s(6)),
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isFavorite ? Icons.favorite : Icons.favorite_border,
                          size: _s(18),
                          color: isFavorite ? Colors.red : Colors.black,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: EdgeInsets.all(_s(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.brand,
                    style: TextStyle(
                      color: Colors.grey.shade600,
                      fontSize: _s(12),
                    ),
                  ),
                  SizedBox(height: _s(2)),
                  Text(
                    product.name,
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: _s(14),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: _s(6)),
                  Text(
                    product.price,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: _s(16),
                    ),
                  ),
                  SizedBox(height: _s(4)),
                  Row(
                    children: [
                      Icon(Icons.star, color: Colors.amber, size: _s(14)),
                      SizedBox(width: _s(2)),
                      Text(
                        '${product.rating}',
                        style: TextStyle(
                          fontSize: _s(12),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        ' (${product.reviews})',
                        style: TextStyle(
                          fontSize: _s(12),
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _categoryColorFor(String categoryName) {
    switch (categoryName) {
      case 'Chaussures':
        return const Color(0xFFF3B37E);
      case 'Vetements':
        return const Color(0xFFBCC8F1);
      case 'Accessoires':
        return const Color(0xFFD9C8EE);
      default:
        return const Color(0xFFF3B37E);
    }
  }

  double _parseDisplayedPrice(String price) {
    final normalized = price.replaceAll('DH', '').replaceAll(' ', '').replaceAll(',', '.').trim();
    return double.tryParse(normalized) ?? 0;
  }
}
