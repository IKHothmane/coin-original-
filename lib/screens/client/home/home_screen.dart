import 'package:coin_original_mobile/models/category_model.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/providers/category_provider.dart';
import 'package:coin_original_mobile/providers/favorites_provider.dart';
import 'package:coin_original_mobile/providers/notifications_provider.dart';
import 'package:coin_original_mobile/providers/product_provider.dart';
import 'package:coin_original_mobile/screens/client/category/all_categories_screen.dart';
import 'package:coin_original_mobile/screens/client/category/categoryscreen.dart';
import 'package:coin_original_mobile/screens/client/home/flash_offers_screen.dart';
import 'package:coin_original_mobile/screens/client/main_screen.dart';
import 'package:coin_original_mobile/screens/client/notification/notification_screen.dart';
import 'package:coin_original_mobile/utils/helpers.dart';
import 'package:coin_original_mobile/utils/routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';

class _Brand {
  static const Color bg = Color(0xFFF5F5F7);
  static const Color surface = Colors.white;
  static const Color surfaceSoft = Color(0xFFF0F1F5);
  static const Color text = Color(0xFF171717);
  static const Color textSoft = Color(0xFF787878);
  static const Color accent = Color(0xFFF47A20);
  static const Color accentDark = Color(0xFFE45A00);
  static const Color blue = Color(0xFF5D8EF7);
  static const Color yellow = Color(0xFFF7C257);
  static const Color border = Color(0xFFE7E7EC);
  static const Color dangerSoft = Color(0xFFFFF2EA);
  static const String font = 'Poppins';
}

const String _cartSvg = '''
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m15 11-1 9"/>
  <path d="m19 11-4-7"/>
  <path d="M2 11h20"/>
  <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/>
  <path d="M4.5 15.5h15"/>
  <path d="m5 11 4-7"/>
  <path d="m9 11 1 9"/>
</svg>
''';

class _HomeScale {
  final double screenWidth;

  const _HomeScale._(this.screenWidth);

  factory _HomeScale.of(BuildContext context) {
    return _HomeScale._(MediaQuery.sizeOf(context).width);
  }

  double get _factor => (screenWidth / 390).clamp(0.78, 1.12).toDouble();

  double size(double value) => value * _factor;

  double text(double value) =>
      (value * _factor).clamp(value * 0.9, value * 1.08).toDouble();

  double radius(double value) => value * _factor;

  double gap(double value) => value * _factor;
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ScrollController _scrollController = ScrollController();
  List<ProductModel>? _cachedCatalogProducts;
  List<ProductModel>? _cachedSourceProducts;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scale = _HomeScale.of(context);
    final bottomInset = MediaQuery.paddingOf(context).bottom;
    final productProvider = context.watch<ProductProvider>();
    final catalogProducts = _catalogProductsFor(productProvider.products);
    final latestProducts = _latestProducts(catalogProducts);
    final popularProducts = _popularProducts(productProvider, catalogProducts);
    final flashProducts = _flashProducts(catalogProducts);
    final recentProducts = _recentProducts(catalogProducts);

    return Scaffold(
      backgroundColor: _Brand.bg,
      body: SafeArea(
        child: RefreshIndicator(
          color: _Brand.accent,
          backgroundColor: Colors.white,
          onRefresh: _refresh,
          child: CustomScrollView(
            controller: _scrollController,
            physics: const BouncingScrollPhysics(
              parent: AlwaysScrollableScrollPhysics(),
            ),
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.fromLTRB(
                    scale.gap(10),
                    scale.gap(8),
                    scale.gap(10),
                    scale.gap(92) + bottomInset,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildTopBar(scale),
                      SizedBox(height: scale.gap(14)),
                      _buildWelcome(scale),
                      SizedBox(height: scale.gap(8)),
                      _buildPromoSlider(scale),
                      SizedBox(height: scale.gap(10)),
                      _buildSectionHeader(
                        'Catégories',
                        scale,
                        action: 'Voir tout',
                        onActionTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const AllCategoriesScreen(),
                            ),
                          );
                        },
                      ),
                      SizedBox(height: scale.gap(10)),
                      _buildCategories(scale),
                      SizedBox(height: scale.gap(16)),
                      _buildSectionHeader(
                        'Nouveautés',
                        scale,
                        action: 'Voir tout',
                        onActionTap: latestProducts.isEmpty
                            ? null
                            : () => _openCollectionScreen(
                                'Nouveautés', latestProducts),
                      ),
                      SizedBox(height: scale.gap(10)),
                      _buildNewProducts(
                        scale,
                        latestProducts,
                        isLoading: productProvider.isLoading,
                      ),
                      SizedBox(height: scale.gap(16)),
                      _buildSectionHeader(
                        'Produits populaires',
                        scale,
                        action: 'Voir tout >',
                        onActionTap: popularProducts.isEmpty
                            ? null
                            : () => _openCollectionScreen(
                                  'Produits populaires',
                                  popularProducts,
                                ),
                      ),
                      SizedBox(height: scale.gap(4)),
                      Row(
                        children: [
                          Text('⚡', style: TextStyle(fontSize: scale.text(10))),
                          SizedBox(width: scale.gap(3)),
                          Text(
                            'Offres Flash',
                            style: TextStyle(
                              fontFamily: _Brand.font,
                              fontSize: scale.text(10),
                              fontWeight: FontWeight.w700,
                              color: _Brand.text,
                            ),
                          ),
                          const Spacer(),
                          Container(
                            padding: EdgeInsets.symmetric(
                              horizontal: scale.gap(6),
                              vertical: scale.gap(2.5),
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFE4D0),
                              borderRadius:
                                  BorderRadius.circular(scale.radius(5)),
                            ),
                            child: Text(
                              '05:23:12',
                              style: TextStyle(
                                fontFamily: _Brand.font,
                                fontSize: scale.text(7),
                                fontWeight: FontWeight.w700,
                                color: _Brand.accentDark,
                              ),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: scale.gap(6)),
                      _buildFlashOffer(
                        scale,
                        flashProducts,
                        isLoading: productProvider.isLoading,
                      ),
                      SizedBox(height: scale.gap(16)),
                      _buildSectionHeader(
                          'Produits récemment consultés', scale),
                      SizedBox(height: scale.gap(10)),
                      _buildRecentProducts(
                        scale,
                        recentProducts,
                        isLoading: productProvider.isLoading,
                      ),
                      SizedBox(height: scale.gap(13)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Header
  Widget _buildTopBar(_HomeScale scale) {
    final logoSize = scale.size(72);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(scale.radius(8)),
          child: Image.asset(
            'assets/images/llogo.png',
            width: logoSize,
            height: logoSize,
            fit: BoxFit.contain,
            errorBuilder: (_, __, ___) {
              return Container(
                width: logoSize,
                height: logoSize,
                decoration: BoxDecoration(
                  color: _Brand.dangerSoft,
                  borderRadius: BorderRadius.circular(scale.radius(8)),
                ),
                child: Icon(
                  Icons.auto_awesome,
                  color: _Brand.accent,
                  size: scale.size(14),
                ),
              );
            },
          ),
        ),
        SizedBox(width: scale.gap(6)),
        Expanded(
          child: SizedBox(
            height: logoSize,
            child: Align(
              alignment: Alignment.centerLeft,
              child: FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerLeft,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    _OutlinedHeaderText(
                      text: 'COIN',
                      fillColor: const Color(0xFFF3F5F7),
                      strokeColor: const Color(0xFF151515),
                      style: TextStyle(
                        fontFamily: _Brand.font,
                        fontSize: scale.text(13.5),
                        fontWeight: FontWeight.w900,
                        height: 0.88,
                        letterSpacing: scale.gap(0.6),
                      ),
                    ),
                    SizedBox(width: scale.gap(6)),
                    Text(
                      'ORIGINAL',
                      style: TextStyle(
                        fontFamily: _Brand.font,
                        fontSize: scale.text(13.5),
                        fontWeight: FontWeight.w900,
                        height: 0.92,
                        letterSpacing: scale.gap(0.4),
                        color: const Color(0xFFF47A20),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        _buildTopIcon(
          Icons.search,
          scale,
          onTap: _openSearchSheet,
        ),
        SizedBox(width: scale.gap(6)),
        Consumer<NotificationsProvider>(
          builder: (context, notificationsProvider, child) {
            return Stack(
              clipBehavior: Clip.none,
              children: [
                _buildTopIcon(
                  Icons.notifications_none_rounded,
                  scale,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const NotificationsScreen(),
                      ),
                    );
                  },
                ),
                if (notificationsProvider.unreadCount > 0)
                  Positioned(
                    top: scale.gap(6),
                    right: scale.gap(6),
                    child: Container(
                      width: scale.size(5),
                      height: scale.size(5),
                      decoration: const BoxDecoration(
                        color: _Brand.accent,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
        SizedBox(width: scale.gap(6)),
        _buildTopIcon(
          null,
          scale,
          onTap: () {
            final mainScreenTabs = MainScreenTabScope.maybeOf(context);
            if (mainScreenTabs != null) {
              mainScreenTabs.onSelectTab(3);
              return;
            }

            Navigator.pushNamed(
              context,
              AppRoutes.home,
              arguments: {'initialTab': 3},
            );
          },
          child: SvgPicture.string(
            _cartSvg,
            width: scale.size(18),
            height: scale.size(18),
            colorFilter: const ColorFilter.mode(_Brand.text, BlendMode.srcIn),
          ),
        ),
      ],
    );
  }

  Widget _buildTopIcon(
    IconData? icon,
    _HomeScale scale, {
    VoidCallback? onTap,
    Widget? child,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: scale.size(32.4),
        height: scale.size(32.4),
        decoration: BoxDecoration(
          color: _Brand.surface,
          borderRadius: BorderRadius.circular(scale.radius(10)),
          border: Border.all(color: _Brand.border),
        ),
        child: Center(
          child: child ?? Icon(icon, size: scale.size(18), color: _Brand.text),
        ),
      ),
    );
  }

  void _openSearchSheet() {
    final allProducts = [
      ...context.read<ProductProvider>().products,
      ...context.read<ProductProvider>().popularProducts,
    ];
    final uniqueProducts = {
      for (final product in allProducts) product.id: product,
    }.values.toList();

    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) => _HomeSearchSheet(
        products: uniqueProducts,
        onProductSelected: (product) {
          Navigator.pop(sheetContext);
          _openProductDetail(product);
        },
      ),
    );
  }

  Widget _buildWelcome(_HomeScale scale) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Nouveauté',
          style: TextStyle(
            fontFamily: _Brand.font,
            fontSize: scale.text(14),
            fontWeight: FontWeight.w700,
            color: _Brand.text,
          ),
        ),
      ],
    );
  }

  Widget _buildPromoSlider(_HomeScale scale) {
    return AspectRatio(
      aspectRatio: 1774 / 887,
      child: _PromoBannerCard(
        assetImagePath: 'assets/images/offer.jpg',
        scale: scale,
      ),
    );
  }

  // Sections
  Widget _buildSectionHeader(
    String title,
    _HomeScale scale, {
    String? action,
    VoidCallback? onActionTap,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: TextStyle(
            fontFamily: _Brand.font,
            fontSize: scale.text(14),
            fontWeight: FontWeight.w700,
            color: _Brand.text,
          ),
        ),
        if (action != null)
          GestureDetector(
            onTap: onActionTap,
            child: Text(
              action,
              style: TextStyle(
                fontFamily: _Brand.font,
                fontSize: scale.text(10),
                fontWeight: FontWeight.w600,
                color: action.startsWith('Termine')
                    ? _Brand.accent
                    : _Brand.accentDark,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildCategories(_HomeScale scale) {
    return Consumer<CategoryProvider>(
      builder: (context, provider, _) {
        if (provider.isLoading && provider.categories.isEmpty) {
          return _CategoryShimmerRow(scale: scale);
        }

        final categories = provider.categories.isNotEmpty
            ? provider.categories.take(3).toList()
            : _fallbackCategories;

        return Row(
          children: List.generate(categories.length, (index) {
            final category = categories[index];
            final isSelected = provider.selectedCategory?.id == category.id;
            return Expanded(
              child: Padding(
                padding: EdgeInsets.only(
                  right: index == categories.length - 1 ? 0 : scale.gap(8),
                ),
                child: _CategoryTile(
                  scale: scale,
                  label: _displayCategoryLabel(category.name, index),
                  iconAsset: _iconAssetForCategory(category.name, index),
                  color: _categoryColor(index),
                  isSelected: isSelected,
                  onTap: () {
                    final categoryLabel =
                        _displayCategoryLabel(category.name, index);
                    provider.selectCategory(category);
                    final categoryProducts = _productsForCategory(
                      _catalogProducts(
                          context.read<ProductProvider>().products),
                      category.id,
                      categoryLabel,
                    );
                    if (categoryProducts.isEmpty) {
                      return;
                    }
                    if (categoryLabel == 'Chaussures' ||
                        categoryLabel == 'Vetements' ||
                        categoryLabel == 'Accessoires') {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => CategoryScreen(
                            categoryName: categoryLabel,
                            products: categoryProducts
                                .map(_toCategoryProduct)
                                .toList(),
                          ),
                        ),
                      );
                    }
                  },
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildNewProducts(
    _HomeScale scale,
    List<ProductModel> products, {
    required bool isLoading,
  }) {
    if (products.isEmpty) {
      return _buildProductsPlaceholder(
        scale,
        isLoading: isLoading,
        message: 'Aucun produit trouve dans la base',
      );
    }

    return SizedBox(
      height: scale.size(180),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: products.length,
        separatorBuilder: (_, __) => SizedBox(width: scale.gap(8)),
        itemBuilder: (context, index) {
          final product = products[index];
          final badge = index == 0
              ? 'Nouveau'
              : index == 1
                  ? 'Populaire'
                  : product.discountPercent != null
                      ? '-${product.discountPercent!.toInt()}%'
                      : null;

          return SizedBox(
            width: scale.size(106),
            child: _ProductMiniCard(
              scale: scale,
              product: product,
              badge: badge,
              onTap: () => _openProductDetail(product),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFlashOffer(
    _HomeScale scale,
    List<ProductModel> products, {
    required bool isLoading,
  }) {
    if (products.isEmpty) {
      return _buildProductsPlaceholder(
        scale,
        isLoading: isLoading,
        message: 'Aucune offre flash disponible',
      );
    }

    return Column(
      children: [
        SizedBox(
          height: scale.size(180),
          child: Row(
            children: List.generate(products.length, (index) {
              final product = products[index];
              final badge = product.discountPercent != null
                  ? '-${product.discountPercent!.toInt()}%'
                  : product.promoPrice != null
                      ? 'Flash'
                      : null;

              return Expanded(
                child: Padding(
                  padding: EdgeInsets.only(
                    right: index == products.length - 1 ? 0 : scale.gap(8),
                  ),
                  child: _ProductMiniCard(
                    scale: scale,
                    product: product,
                    badge: badge,
                    isOfferCard: true,
                    onTap: () => _openProductDetail(product),
                  ),
                ),
              );
            }),
          ),
        ),
        SizedBox(height: scale.gap(8)),
        InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const FlashOffersScreen(),
              ),
            );
          },
          borderRadius: BorderRadius.circular(scale.radius(8)),
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.symmetric(vertical: scale.gap(6.5)),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF3E8),
              borderRadius: BorderRadius.circular(scale.radius(7)),
              border: Border.all(color: const Color(0xFFF0CAA9)),
            ),
            child: Text(
              'Voir toutes les offres flash >',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: _Brand.font,
                fontSize: scale.text(8),
                fontWeight: FontWeight.w700,
                color: _Brand.accentDark,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRecentProducts(
    _HomeScale scale,
    List<ProductModel> recent, {
    required bool isLoading,
  }) {
    if (recent.isEmpty) {
      return _buildProductsPlaceholder(
        scale,
        isLoading: isLoading,
        message: 'Aucun produit recent disponible',
      );
    }

    return Row(
      children: List.generate(recent.length, (index) {
        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(
              right: index == recent.length - 1 ? 0 : scale.gap(10),
            ),
            child: _RecentProductCard(
              scale: scale,
              product: recent[index],
              onTap: () => _openProductDetail(recent[index]),
            ),
          ),
        );
      }),
    );
  }

  Future<void> _refresh() async {
    final categoryProvider = context.read<CategoryProvider>();
    final productProvider = context.read<ProductProvider>();
    await Future.wait([
      categoryProvider.loadCategories(),
      productProvider.loadHomeProducts(force: true),
    ]);
    if (mounted) {
      setState(() {
        _cachedCatalogProducts = null;
        _cachedSourceProducts = null;
      });
    }
  }

  void _openProductDetail(ProductModel product) {
    Navigator.pushNamed(context, '/product-detail', arguments: product);
  }

  void _openCollectionScreen(String title, List<ProductModel> sourceProducts) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => CategoryScreen(
          categoryName: title,
          products: sourceProducts.map(_toCategoryProduct).toList(),
        ),
      ),
    );
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

  Widget _buildProductsPlaceholder(
    _HomeScale scale, {
    required bool isLoading,
    required String message,
  }) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: scale.gap(14),
        vertical: scale.gap(18),
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(scale.radius(12)),
        border: Border.all(color: _Brand.border),
      ),
      child: Text(
        isLoading ? 'Chargement des produits...' : message,
        textAlign: TextAlign.center,
        style: TextStyle(
          fontFamily: _Brand.font,
          fontSize: scale.text(11),
          fontWeight: FontWeight.w600,
          color: _Brand.textSoft,
        ),
      ),
    );
  }

  List<ProductModel> _catalogProductsFor(List<ProductModel> products) {
    if (identical(products, _cachedSourceProducts) &&
        _cachedCatalogProducts != null) {
      return _cachedCatalogProducts!;
    }

    final filtered = _catalogProducts(products);
    _cachedSourceProducts = products;
    _cachedCatalogProducts = filtered;
    return filtered;
  }

  List<ProductModel> _catalogProducts(List<ProductModel> products) {
    final filtered = products.where((product) {
      return product.isActive && !product.hidden && product.imageUrl.isNotEmpty;
    }).toList();

    filtered.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return filtered;
  }

  List<ProductModel> _latestProducts(List<ProductModel> products) {
    return products.take(6).toList();
  }

  List<ProductModel> _popularProducts(
    ProductProvider provider,
    List<ProductModel> catalogProducts,
  ) {
    final source = provider.popularProducts.isNotEmpty
        ? _catalogProducts(provider.popularProducts)
        : [...catalogProducts]
      ..sort((a, b) => b.rating.compareTo(a.rating));

    return source.take(6).toList();
  }

  List<ProductModel> _flashProducts(List<ProductModel> products) {
    final discounted = products.where((product) {
      final promoPrice = product.promoPrice;
      final hasPromoPrice =
          promoPrice != null && promoPrice > 0 && promoPrice < product.price;
      final hasOldPrice =
          product.oldPrice != null && product.oldPrice! > product.price;
      return hasPromoPrice || hasOldPrice;
    }).toList();

    if (discounted.isNotEmpty) {
      discounted.sort(_compareFlashProducts);
      return discounted.take(3).toList();
    }

    return products.take(3).toList();
  }

  List<ProductModel> _recentProducts(List<ProductModel> products) {
    return products.take(2).toList();
  }

  List<ProductModel> _productsForCategory(
    List<ProductModel> sourceProducts,
    String categoryId,
    String categoryLabel,
  ) {
    return sourceProducts.where((product) {
      final normalizedCategoryId = product.categoryId.toLowerCase();
      final normalizedCategoryName = product.categoryName.toLowerCase();
      final normalizedLabel = categoryLabel.toLowerCase();

      if (normalizedCategoryId == categoryId.toLowerCase()) {
        return true;
      }

      if (normalizedCategoryName == normalizedLabel) {
        return true;
      }

      return _displayCategoryLabel(
            product.categoryName.isNotEmpty
                ? product.categoryName
                : product.categoryId,
            0,
          ).toLowerCase() ==
          normalizedLabel;
    }).toList();
  }

  String _iconAssetForCategory(String label, int index) {
    final name = label.toLowerCase();
    if (name.contains('shoe') ||
        name.contains('sneaker') ||
        name.contains('chauss')) {
      return 'assets/icons/category_shoes.svg';
    }
    if (name.contains('shirt') ||
        name.contains('vêt') ||
        name.contains('habit') ||
        name.contains('cloth')) {
      return 'assets/icons/category_clothes.svg';
    }
    if (name.contains('access') ||
        name.contains('bag') ||
        name.contains('sac')) {
      return 'assets/icons/category_accessories.svg';
    }
    const defaults = [
      'assets/icons/category_shoes.svg',
      'assets/icons/category_clothes.svg',
      'assets/icons/category_accessories.svg',
    ];
    return defaults[index % defaults.length];
  }

  Color _categoryColor(int index) {
    const colors = [
      Color(0xFFF3B37E),
      Color(0xFFBCC8F1),
      Color(0xFFD9C8EE),
    ];
    return colors[index % colors.length];
  }

  String _displayCategoryLabel(String label, int index) {
    final name = label.toLowerCase();
    if (name.contains('shoe') ||
        name.contains('sneaker') ||
        name.contains('chauss')) {
      return 'Chaussures';
    }
    if (name.contains('shirt') ||
        name.contains('vêt') ||
        name.contains('habit') ||
        name.contains('cloth')) {
      return 'Vetements';
    }
    if (name.contains('access') ||
        name.contains('bag') ||
        name.contains('sac')) {
      return 'Accessoires';
    }

    const defaults = ['Chaussures', 'Vetements', 'Accessoires'];
    return defaults[index % defaults.length];
  }
}

class _HomeSearchSheet extends StatefulWidget {
  final List<ProductModel> products;
  final ValueChanged<ProductModel> onProductSelected;

  const _HomeSearchSheet({
    required this.products,
    required this.onProductSelected,
  });

  @override
  State<_HomeSearchSheet> createState() => _HomeSearchSheetState();
}

class _HomeSearchSheetState extends State<_HomeSearchSheet> {
  late final TextEditingController _controller;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
    _controller.addListener(() {
      if (!mounted) return;
      setState(() {
        _query = _controller.text;
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scale = _HomeScale.of(context);
    final bottomInset = MediaQuery.viewInsetsOf(context).bottom;
    final normalizedQuery = _query.trim().toLowerCase();
    final filteredProducts = normalizedQuery.isEmpty
        ? widget.products.take(8).toList()
        : widget.products
            .where((product) {
              final haystack = [
                product.name,
                product.brand ?? '',
                product.categoryName,
              ].join(' ').toLowerCase();
              return haystack.contains(normalizedQuery);
            })
            .take(12)
            .toList();

    return Padding(
      padding: EdgeInsets.fromLTRB(
        scale.gap(10),
        scale.gap(16),
        scale.gap(10),
        bottomInset + scale.gap(10),
      ),
      child: FractionallySizedBox(
        heightFactor: 0.78,
        child: Container(
          decoration: BoxDecoration(
            color: _Brand.surface,
            borderRadius: BorderRadius.circular(scale.radius(16)),
          ),
          child: SafeArea(
            top: false,
            child: Padding(
              padding: EdgeInsets.all(scale.gap(12)),
              child: Column(
                children: [
                  TextField(
                    controller: _controller,
                    autofocus: true,
                    decoration: InputDecoration(
                      hintText: 'Rechercher un produit',
                      prefixIcon: Icon(Icons.search, size: scale.size(18)),
                      suffixIcon: _query.isEmpty
                          ? null
                          : IconButton(
                              onPressed: _controller.clear,
                              icon: Icon(Icons.close, size: scale.size(16)),
                            ),
                      filled: true,
                      fillColor: _Brand.surfaceSoft,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(scale.radius(12)),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: scale.gap(10),
                        vertical: scale.gap(9),
                      ),
                    ),
                  ),
                  SizedBox(height: scale.gap(12)),
                  Expanded(
                    child: filteredProducts.isEmpty
                        ? Center(
                            child: Text(
                              'Aucun resultat',
                              style: TextStyle(
                                fontFamily: _Brand.font,
                                fontSize: scale.text(12),
                                fontWeight: FontWeight.w600,
                                color: _Brand.textSoft,
                              ),
                            ),
                          )
                        : ListView.separated(
                            itemCount: filteredProducts.length,
                            separatorBuilder: (_, __) => Divider(
                              height: scale.gap(12),
                              color: _Brand.border,
                            ),
                            itemBuilder: (context, index) {
                              final product = filteredProducts[index];
                              return ListTile(
                                contentPadding: EdgeInsets.zero,
                                leading: ClipRRect(
                                  borderRadius:
                                      BorderRadius.circular(scale.radius(8)),
                                  child: SizedBox(
                                    width: scale.size(44),
                                    height: scale.size(44),
                                    child: _ProductImage(
                                        imageUrl: product.imageUrl),
                                  ),
                                ),
                                title: Text(
                                  product.name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontFamily: _Brand.font,
                                    fontSize: scale.text(11),
                                    fontWeight: FontWeight.w600,
                                    color: _Brand.text,
                                  ),
                                ),
                                subtitle: Text(
                                  product.brand ?? product.categoryName,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontFamily: _Brand.font,
                                    fontSize: scale.text(9),
                                    color: _Brand.textSoft,
                                  ),
                                ),
                                trailing: Text(
                                  Helpers.formatPrice(product.price),
                                  style: TextStyle(
                                    fontFamily: _Brand.font,
                                    fontSize: scale.text(10),
                                    fontWeight: FontWeight.w700,
                                    color: _Brand.accentDark,
                                  ),
                                ),
                                onTap: () => widget.onProductSelected(product),
                              );
                            },
                          ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

final List<CategoryModel> _fallbackCategories = [
  CategoryModel(id: 'shoes', name: 'Chaussures', createdAt: DateTime(2026)),
  CategoryModel(id: 'clothes', name: 'Vetements', createdAt: DateTime(2026)),
  CategoryModel(
      id: 'accessories', name: 'Accessoires', createdAt: DateTime(2026)),
];

class _PromoBannerCard extends StatelessWidget {
  final String assetImagePath;
  final _HomeScale scale;

  const _PromoBannerCard({
    required this.assetImagePath,
    required this.scale,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(scale.radius(14)),
      ),
      child: SizedBox.expand(
        child: Image.asset(
          assetImagePath,
          fit: BoxFit.contain,
          alignment: Alignment.center,
          errorBuilder: (_, __, ___) {
            return Image.asset(
              'assets/images/offer.jpg',
              fit: BoxFit.contain,
              alignment: Alignment.center,
              errorBuilder: (_, __, ___) => Container(
                color: _Brand.surfaceSoft,
                alignment: Alignment.center,
                child: Icon(
                  Icons.image_outlined,
                  color: _Brand.textSoft,
                  size: scale.size(24),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _OutlinedHeaderText extends StatelessWidget {
  final String text;
  final TextStyle style;
  final Color fillColor;
  final Color strokeColor;

  const _OutlinedHeaderText({
    required this.text,
    required this.style,
    required this.fillColor,
    required this.strokeColor,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Text(
          text,
          style: style.copyWith(
            foreground: Paint()
              ..style = PaintingStyle.stroke
              ..strokeWidth = 1.6
              ..color = strokeColor,
          ),
        ),
        Text(
          text,
          style: style.copyWith(color: fillColor),
        ),
      ],
    );
  }
}

class _CategoryTile extends StatelessWidget {
  final _HomeScale scale;
  final String label;
  final String iconAsset;
  final Color color;
  final bool isSelected;
  final VoidCallback onTap;

  const _CategoryTile({
    required this.scale,
    required this.label,
    required this.iconAsset,
    required this.color,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        height: scale.size(66),
        padding: EdgeInsets.symmetric(
          horizontal: scale.gap(8),
          vertical: scale.gap(7),
        ),
        decoration: BoxDecoration(
          color: color.withValues(alpha: isSelected ? 1 : 0.9),
          borderRadius: BorderRadius.circular(scale.radius(10)),
          border: Border.all(
            color:
                isSelected ? color.withValues(alpha: 0.95) : Colors.transparent,
            width: scale.size(1),
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SvgPicture.asset(
              iconAsset,
              width: scale.size(24),
              height: scale.size(24),
              colorFilter: const ColorFilter.mode(
                Color(0xFF7A5573),
                BlendMode.srcIn,
              ),
            ),
            SizedBox(height: scale.gap(6)),
            Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontFamily: _Brand.font,
                fontSize: scale.text(10),
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: const Color(0xFF5B4A40),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProductMiniCard extends StatelessWidget {
  final _HomeScale scale;
  final ProductModel product;
  final String? badge;
  final VoidCallback onTap;
  final bool isOfferCard;

  const _ProductMiniCard({
    required this.scale,
    required this.product,
    required this.onTap,
    this.badge,
    this.isOfferCard = false,
  });

  @override
  Widget build(BuildContext context) {
    final isFavorite =
        context.watch<FavoritesProvider>().isFavorite(product.id);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: isOfferCard ? const Color(0xFFFFFBF7) : _Brand.surface,
          borderRadius: BorderRadius.circular(scale.radius(11)),
          border: Border.all(
            color: isOfferCard ? const Color(0xFFF0CAA9) : _Brand.border,
          ),
          boxShadow: isOfferCard
              ? [
                  BoxShadow(
                    color: const Color(0xFFFF8A4F).withValues(alpha: 0.14),
                    blurRadius: scale.size(12),
                    offset: const Offset(0, 3),
                  ),
                ]
              : null,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(scale.radius(11)),
                    ),
                    child: _ProductImage(imageUrl: product.images.firstOrNull),
                  ),
                  if (badge != null)
                    Positioned(
                      top: scale.gap(6),
                      left: scale.gap(6),
                      child: Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: scale.gap(5),
                          vertical: scale.gap(2),
                        ),
                        decoration: BoxDecoration(
                          color: isOfferCard
                              ? const Color(0xFFFF6A00)
                              : badge == 'Populaire'
                                  ? _Brand.blue
                                  : _Brand.yellow,
                          borderRadius: BorderRadius.circular(scale.radius(5)),
                        ),
                        child: Text(
                          badge!,
                          style: TextStyle(
                            fontFamily: _Brand.font,
                            fontSize: scale.text(7),
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  Positioned(
                    top: scale.gap(6),
                    right: scale.gap(6),
                    child: GestureDetector(
                      onTap: () => context
                          .read<FavoritesProvider>()
                          .toggleFavorite(product),
                      child: Container(
                        width: scale.size(19),
                        height: scale.size(19),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.9),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isFavorite ? Icons.favorite : Icons.favorite_border,
                          size: scale.size(11),
                          color: isFavorite ? Colors.red : _Brand.textSoft,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: EdgeInsets.fromLTRB(
                scale.gap(5),
                scale.gap(5),
                scale.gap(5),
                scale.gap(6),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    product.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontFamily: _Brand.font,
                      fontSize: scale.text(8),
                      fontWeight: FontWeight.w600,
                      color: _Brand.text,
                    ),
                  ),
                  SizedBox(height: scale.gap(2)),
                  Text(
                    Helpers.formatPrice(product.price),
                    style: TextStyle(
                      fontFamily: _Brand.font,
                      fontSize: scale.text(9),
                      fontWeight: FontWeight.w700,
                      color: isOfferCard ? _Brand.accentDark : _Brand.text,
                    ),
                  ),
                  if (isOfferCard && product.oldPrice != null)
                    Text(
                      Helpers.formatPrice(product.oldPrice!),
                      style: TextStyle(
                        fontFamily: _Brand.font,
                        fontSize: scale.text(7),
                        fontWeight: FontWeight.w600,
                        color: _Brand.textSoft,
                        decoration: TextDecoration.lineThrough,
                      ),
                    ),
                  Row(
                    children: [
                      Icon(Icons.star,
                          size: scale.size(10), color: _Brand.accent),
                      SizedBox(width: scale.gap(2)),
                      Expanded(
                        child: Text(
                          '${product.rating.toStringAsFixed(1)} (${product.reviewCount})',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontFamily: _Brand.font,
                            fontSize: scale.text(7),
                            color: _Brand.textSoft,
                          ),
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
}

class _RecentProductCard extends StatelessWidget {
  final _HomeScale scale;
  final ProductModel product;
  final VoidCallback onTap;

  const _RecentProductCard({
    required this.scale,
    required this.product,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(scale.gap(8)),
        decoration: BoxDecoration(
          color: _Brand.surface,
          borderRadius: BorderRadius.circular(scale.radius(11)),
          border: Border.all(color: _Brand.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: scale.size(72),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(scale.radius(8)),
                child: _ProductImage(imageUrl: product.images.firstOrNull),
              ),
            ),
            SizedBox(height: scale.gap(6)),
            Text(
              product.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontFamily: _Brand.font,
                fontSize: scale.text(9),
                fontWeight: FontWeight.w600,
                color: _Brand.text,
              ),
            ),
            SizedBox(height: scale.gap(2)),
            Text(
              Helpers.formatPrice(product.price),
              style: TextStyle(
                fontFamily: _Brand.font,
                fontSize: scale.text(12),
                fontWeight: FontWeight.w700,
                color: _Brand.text,
              ),
            ),
            Row(
              children: [
                Icon(Icons.star, size: scale.size(10), color: _Brand.accent),
                SizedBox(width: scale.gap(2)),
                Text(
                  product.rating.toStringAsFixed(1),
                  style: TextStyle(
                    fontFamily: _Brand.font,
                    fontSize: scale.text(8),
                    color: _Brand.textSoft,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ProductImage extends StatelessWidget {
  final String? imageUrl;

  const _ProductImage({
    this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return NetworkImageWidget(
      imageUrl: imageUrl,
      fit: BoxFit.contain,
      width: double.infinity,
      placeholderColor: _Brand.surfaceSoft,
      shimmerBaseColor: _Brand.surfaceSoft,
      shimmerHighlightColor: Colors.white,
    );
  }
}

int _compareFlashProducts(ProductModel a, ProductModel b) {
  final discountComparison =
      (b.discountPercent ?? 0).compareTo(a.discountPercent ?? 0);
  if (discountComparison != 0) return discountComparison;

  final createdAtComparison = b.createdAt.compareTo(a.createdAt);
  if (createdAtComparison != 0) return createdAtComparison;

  return a.id.compareTo(b.id);
}

class _CategoryShimmerRow extends StatelessWidget {
  final _HomeScale scale;

  const _CategoryShimmerRow({required this.scale});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(4, (index) {
        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(right: index == 3 ? 0 : scale.gap(8)),
            child: Shimmer.fromColors(
              baseColor: _Brand.surfaceSoft,
              highlightColor: Colors.white,
              child: Container(
                height: scale.size(70),
                decoration: BoxDecoration(
                  color: _Brand.surfaceSoft,
                  borderRadius: BorderRadius.circular(scale.radius(11)),
                ),
              ),
            ),
          ),
        );
      }),
    );
  }
}
