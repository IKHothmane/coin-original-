import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/providers/cart_provider.dart';
import 'package:coin_original_mobile/providers/favorites_provider.dart';
import 'package:coin_original_mobile/providers/product_provider.dart';
import 'package:coin_original_mobile/screens/client/product/size_guide_screen.dart';
import 'package:coin_original_mobile/utils/helpers.dart';
import 'package:coin_original_mobile/utils/routes.dart';
import 'package:coin_original_mobile/widgets/app_back_button.dart';
import 'package:flutter/material.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:provider/provider.dart';

class ProductDetailScreen extends StatefulWidget {
  final ProductModel product;

  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  late final PageController _pageController;

  int _selectedSize = 40;
  int _selectedColor = 0;
  int _currentImageIndex = 0;
  int _quantity = 1;

  final List<int> _sizes = [38, 39, 40, 41, 42, 43, 44, 45, 46];
  final List<int> _unavailableSizes = [45, 46];
  final List<Color> _colors = [
    const Color(0xFFF5F5F5),
    Colors.black,
    const Color(0xFF4A90E2),
  ];
  final List<String> _colorNames = ['Blanc', 'Noir', 'Bleu'];

  List<String> get _productImages =>
      widget.product.images.isNotEmpty ? widget.product.images : [''];

  int get _maxQuantity => widget.product.stock > 0 ? widget.product.stock : 1;

  List<ProductModel> _similarProducts(List<ProductModel> catalogProducts) {
    final currentCategoryId = _normalizeCategory(widget.product.categoryId);
    final currentCategoryName = _normalizeCategory(widget.product.categoryName);

    final visibleProducts = catalogProducts.where((product) {
      return product.id != widget.product.id &&
          product.isActive &&
          !product.hidden &&
          product.imageUrl.isNotEmpty;
    }).toList();

    final sameCategoryProducts = visibleProducts.where((product) {
      final productCategoryId = _normalizeCategory(product.categoryId);
      final productCategoryName = _normalizeCategory(product.categoryName);

      final sameCategoryId = currentCategoryId.isNotEmpty &&
          productCategoryId == currentCategoryId;
      final sameCategoryName = currentCategoryName.isNotEmpty &&
          productCategoryName == currentCategoryName;

      return sameCategoryId || sameCategoryName;
    }).toList();

    final source = sameCategoryProducts.isNotEmpty
        ? sameCategoryProducts
        : visibleProducts;
    source.sort(_compareSimilarProducts);
    return source.take(4).toList();
  }

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final productProvider = context.read<ProductProvider>();
      if (productProvider.products.isEmpty && !productProvider.isLoading) {
        productProvider.loadCatalogProducts();
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final cartProvider = context.watch<CartProvider>();
    final productProvider = context.watch<ProductProvider>();
    final isInCart =
        cartProvider.items.any((item) => item.product.id == widget.product.id);
    final similarProducts = _similarProducts(productProvider.products);

    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 320,
            pinned: true,
            backgroundColor: Colors.white,
            surfaceTintColor: Colors.white,
            elevation: 0,
            scrolledUnderElevation: 0,
            leading: AppBackButton(
              onTap: () => Navigator.pop(context),
            ),
            title: const Text(
              'Produit',
              style: TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.w700,
                fontSize: 15,
              ),
            ),
            centerTitle: true,
            actions: [
              Padding(
                padding: const EdgeInsets.only(top: 6, bottom: 6),
                child: Selector<FavoritesProvider, bool>(
                  selector: (_, provider) =>
                      provider.isFavorite(widget.product.id),
                  builder: (context, isFavorite, _) {
                    return _circleButton(
                      icon: isFavorite ? Icons.favorite : Icons.favorite_border,
                      iconColor: isFavorite ? Colors.red : Colors.black,
                      onTap: () => context
                          .read<FavoritesProvider>()
                          .toggleFavorite(widget.product),
                    );
                  },
                ),
              ),
              const SizedBox(width: 12),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: _buildImageGallery(),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildProductInfo(),
                  const SizedBox(height: 19),
                  _buildSizeSelector(),
                  const SizedBox(height: 19),
                  _buildColorSelector(),
                  const SizedBox(height: 19),
                  _buildQuantitySelector(),
                  const SizedBox(height: 19),
                  _buildDescription(),
                  const SizedBox(height: 13),
                  _buildShippingInfo(),
                  const SizedBox(height: 26),
                  _buildSimilarProducts(similarProducts),
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomButton(
        isInCart: isInCart,
        isLoading: cartProvider.isLoading,
      ),
    );
  }

  Widget _circleButton({
    required IconData icon,
    required VoidCallback onTap,
    Color iconColor = Colors.black,
  }) {
    return Material(
      color: Colors.white,
      shape: const CircleBorder(),
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: Padding(
          padding: const EdgeInsets.all(6),
          child: Icon(icon, color: iconColor, size: 16),
        ),
      ),
    );
  }

  Widget _buildImageGallery() {
    return Container(
      color: const Color(0xFFF6F6F6),
      child: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              itemCount: _productImages.length,
              onPageChanged: (index) =>
                  setState(() => _currentImageIndex = index),
              itemBuilder: (context, index) {
                return Padding(
                  padding: const EdgeInsets.fromLTRB(19, 74, 19, 13),
                  child: _buildProductImage(
                    _productImages[index],
                    fit: BoxFit.contain,
                  ),
                );
              },
            ),
          ),
          SizedBox(
            height: 69,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              itemCount: _productImages.length,
              itemBuilder: (context, index) {
                final isSelected = _currentImageIndex == index;
                return GestureDetector(
                  onTap: () {
                    setState(() => _currentImageIndex = index);
                    _pageController.animateToPage(
                      index,
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeOut,
                    );
                  },
                  child: Container(
                    width: 48,
                    margin: const EdgeInsets.only(right: 6),
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: isSelected
                            ? const Color(0xFFF47A20)
                            : Colors.grey.shade300,
                        width: 1.6,
                      ),
                      borderRadius: BorderRadius.circular(6),
                      color: Colors.white,
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(5),
                      child: _buildProductImage(
                        _productImages[index],
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          crossAxisAlignment: WrapCrossAlignment.center,
          spacing: 8,
          runSpacing: 8,
          children: [
            Text(
              widget.product.name,
              style: const TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade300),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.verified_outlined,
                      size: 11, color: Colors.grey.shade700),
                  const SizedBox(width: 3),
                  const Text(
                    'Coin Original',
                    style: TextStyle(fontSize: 10),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Row(
          children: [
            const Icon(Icons.star, color: Colors.amber, size: 16),
            const SizedBox(width: 3),
            Text(
              widget.product.rating.toStringAsFixed(1),
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
            ),
            Text(
              ' • ${widget.product.reviewCount} avis',
              style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Wrap(
          crossAxisAlignment: WrapCrossAlignment.center,
          spacing: 8,
          runSpacing: 8,
          children: [
            Text(
              Helpers.formatPrice(widget.product.price),
              style: const TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            if (widget.product.oldPrice != null)
              Text(
                Helpers.formatPrice(widget.product.oldPrice!),
                style: TextStyle(
                  fontSize: 13,
                  decoration: TextDecoration.lineThrough,
                  color: Colors.grey.shade500,
                ),
              ),
            if (widget.product.discountPercent != null)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.green.shade50,
                  borderRadius: BorderRadius.circular(5),
                ),
                child: Text(
                  '-${widget.product.discountPercent!.toInt()}% Reduction',
                  style: TextStyle(
                    color: Colors.green.shade700,
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }

  Widget _buildSizeSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Taille',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
            ),
            TextButton(
              onPressed: _openSizeGuide,
              child: const Text('Guide des tailles ->',
                  style: TextStyle(fontSize: 11)),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _sizes.map((size) {
            final isSelected = _selectedSize == size;
            final isUnavailable = _unavailableSizes.contains(size);
            return GestureDetector(
              onTap: isUnavailable
                  ? null
                  : () => setState(() => _selectedSize = size),
              child: Container(
                width: 48,
                height: 35,
                decoration: BoxDecoration(
                  color: isSelected ? Colors.black : Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(6),
                  border: isUnavailable
                      ? Border.all(color: Colors.grey.shade200)
                      : null,
                ),
                child: Center(
                  child: Text(
                    size.toString(),
                    style: TextStyle(
                      color: isSelected
                          ? Colors.white
                          : isUnavailable
                              ? Colors.grey.shade400
                              : Colors.black,
                      fontWeight: FontWeight.w600,
                      decoration:
                          isUnavailable ? TextDecoration.lineThrough : null,
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
        if (_unavailableSizes.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 6),
            child: Text(
              'Taille non disponible',
              style: TextStyle(color: Colors.grey.shade600, fontSize: 10),
            ),
          ),
      ],
    );
  }

  Widget _buildColorSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Couleur',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
            ),
            Text(
              '${_colors.length} couleurs',
              style: TextStyle(color: Colors.grey.shade600, fontSize: 11),
            ),
          ],
        ),
        const SizedBox(height: 10),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: List.generate(_colors.length, (index) {
              final isSelected = _selectedColor == index;
              return GestureDetector(
                onTap: () => setState(() => _selectedColor = index),
                child: Container(
                  margin: const EdgeInsets.only(right: 13),
                  child: Column(
                    children: [
                      Container(
                        width: 45,
                        height: 45,
                        decoration: BoxDecoration(
                          color: _colors[index],
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isSelected
                                ? Colors.black
                                : Colors.grey.shade300,
                            width: isSelected ? 2.4 : 1,
                          ),
                        ),
                        child: isSelected
                            ? Icon(
                                Icons.check,
                                color: index == 1 ? Colors.white : Colors.black,
                              )
                            : null,
                      ),
                      const SizedBox(height: 5),
                      Text(
                        _colorNames[index],
                        style: const TextStyle(fontSize: 10),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ],
    );
  }

  Widget _buildQuantitySelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quantite',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            _buildQuantityButton(
              icon: Icons.remove,
              onTap: () {
                if (_quantity > 1) {
                  setState(() => _quantity--);
                }
              },
            ),
            const SizedBox(width: 13),
            Text(
              '$_quantity',
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
            ),
            const SizedBox(width: 13),
            _buildQuantityButton(
              icon: Icons.add,
              onTap: () {
                if (_quantity < _maxQuantity) {
                  setState(() => _quantity++);
                }
              },
            ),
            const Spacer(),
            Row(
              children: [
                Icon(Icons.inventory_2_outlined,
                    size: 16, color: Colors.grey.shade700),
                const SizedBox(width: 6),
                Text(
                  '${widget.product.stock} en stock',
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.grey.shade700,
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDescription() {
    final description = widget.product.description.trim().isEmpty
        ? "Produit premium Coin Original. Ce modele allie confort, style et finition soignee pour un usage quotidien."
        : widget.product.description;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Description',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 6),
        Text(
          description,
          style: TextStyle(
            color: Colors.grey.shade700,
            fontSize: 11,
            height: 1.4,
          ),
        ),
      ],
    );
  }

  Widget _buildShippingInfo() {
    return Column(
      children: [
        _buildInfoCard(
          Icons.local_shipping_outlined,
          'Livraison gratuite',
          'Livraison standard gratuite • 2-4 jours ouvres',
        ),
        const SizedBox(height: 10),
        _buildInfoCard(
          Icons.replay,
          'Retours faciles',
          'Retours gratuits sous 30 jours • Retour offert',
        ),
      ],
    );
  }

  Widget _buildInfoCard(IconData icon, String title, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(13),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade200),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.black, size: 19),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 11,
                  ),
                ),
                const SizedBox(height: 1),
                Text(
                  subtitle,
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 10),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSimilarProducts(List<ProductModel> similarProducts) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 560 ? 3 : 2;
        final childAspectRatio = constraints.maxWidth > 560 ? 0.78 : 0.72;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Produits similaires',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                ),
                TextButton(
                  onPressed: () {},
                  child: Text('Voir tout (${similarProducts.length}) ->'),
                ),
              ],
            ),
            const SizedBox(height: 10),
            if (similarProducts.isEmpty)
              Container(
                width: double.infinity,
                padding:
                    const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade200),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'Aucun produit de la meme categorie pour le moment',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                ),
              )
            else
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: crossAxisCount,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: childAspectRatio,
                ),
                itemCount: similarProducts.length,
                itemBuilder: (context, index) {
                  final product = similarProducts[index];
                  return _buildProductCard(product);
                },
              ),
          ],
        );
      },
    );
  }

  Widget _buildProductCard(ProductModel product) {
    return GestureDetector(
      onTap: () => Navigator.pushReplacementNamed(
        context,
        '/product-detail',
        arguments: product,
      ),
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade200),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(10)),
                child: _buildProductImage(
                  product.images.firstOrNull ?? '',
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(6),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: const TextStyle(
                        fontWeight: FontWeight.w600, fontSize: 11),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 3),
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 11),
                      const SizedBox(width: 3),
                      Expanded(
                        child: Text(
                          '${product.rating.toStringAsFixed(1)} • ${product.reviewCount} avis',
                          style: TextStyle(
                              color: Colors.grey.shade600, fontSize: 10),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    Helpers.formatPrice(product.price),
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomButton({
    required bool isInCart,
    required bool isLoading,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: LayoutBuilder(
          builder: (context, constraints) {
            final isCompact = constraints.maxWidth < 360;

            final totalBlock = Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Total',
                  style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
                ),
                Text(
                  Helpers.formatPrice(widget.product.price * _quantity),
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ],
            );

            final cartButton = SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: isLoading
                    ? null
                    : () {
                        if (isInCart) {
                          _openCartTab();
                          return;
                        }
                        _addToCart();
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  elevation: 0,
                ),
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    isInCart ? 'Commander maintenant' : 'Ajouter au panier',
                    maxLines: 1,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            );

            if (isCompact) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  totalBlock,
                  const SizedBox(height: 12),
                  cartButton,
                ],
              );
            }

            return Row(
              children: [
                Expanded(child: totalBlock),
                const SizedBox(width: 13),
                Expanded(
                  flex: 2,
                  child: cartButton,
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildQuantityButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: Colors.grey.shade100,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 16, color: Colors.black),
      ),
    );
  }

  Widget _buildProductImage(String imageUrl, {required BoxFit fit}) {
    return NetworkImageWidget(
      imageUrl: imageUrl.isNotEmpty ? imageUrl : null,
      width: double.infinity,
      fit: fit,
      placeholder: _buildPlaceholder(),
      errorWidget: _buildPlaceholder(),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      color: Colors.grey.shade100,
      alignment: Alignment.center,
      child: Icon(
        Icons.image_outlined,
        size: 38,
        color: Colors.grey.shade400,
      ),
    );
  }

  void _openSizeGuide() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => const SizeGuideScreen(),
      ),
    );
  }

  Future<void> _addToCart() async {
    final cartProvider = Provider.of<CartProvider>(context, listen: false);
    final added =
        await cartProvider.addToCart(widget.product, quantity: _quantity);
    if (!mounted) return;

    if (!added) {
      return;
    }
  }

  void _openCartTab() {
    Navigator.pushNamedAndRemoveUntil(
      context,
      AppRoutes.home,
      (route) => false,
      arguments: {'initialTab': 3},
    );
  }

  String _normalizeCategory(String value) {
    return value.trim().toLowerCase();
  }

  int _compareSimilarProducts(ProductModel a, ProductModel b) {
    final ratingComparison = b.rating.compareTo(a.rating);
    if (ratingComparison != 0) return ratingComparison;

    final createdAtComparison = b.createdAt.compareTo(a.createdAt);
    if (createdAtComparison != 0) return createdAtComparison;

    return a.id.compareTo(b.id);
  }
}
