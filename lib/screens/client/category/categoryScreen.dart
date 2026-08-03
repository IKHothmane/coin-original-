import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/providers/favorites_provider.dart';
import 'package:flutter/material.dart';
import 'package:coin_original_mobile/widgets/app_back_button.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:provider/provider.dart';

const double _kScale = 0.8;

double _s(double value) => value * _kScale;

class CategoryProduct {
  final String id;
  final String brand;
  final String name;
  final String price;
  final double rating;
  final int reviews;
  final String image;
  final ProductModel? sourceProduct;
  bool isFavorite;

  CategoryProduct({
    required this.id,
    required this.brand,
    required this.name,
    required this.price,
    required this.rating,
    required this.reviews,
    required this.image,
    this.sourceProduct,
    this.isFavorite = false,
  });
}

class CategoryScreen extends StatefulWidget {
  final String categoryName;
  final List<CategoryProduct> products;

  const CategoryScreen({
    super.key,
    required this.categoryName,
    required this.products,
  });

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  String selectedSort = 'Popularité';
  String? selectedBrand;
  String searchQuery = '';
  late List<CategoryProduct> products;

  @override
  void initState() {
    super.initState();
    products = List.from(widget.products);
  }

  List<CategoryProduct> get filteredProducts {
    final normalizedQuery = searchQuery.trim().toLowerCase();

    return products.where((product) {
      final matchesBrand = selectedBrand == null || product.brand == selectedBrand;
      final matchesQuery = normalizedQuery.isEmpty
          ? true
          : '${product.name} ${product.brand}'.toLowerCase().contains(normalizedQuery);

      return matchesBrand && matchesQuery;
    }).toList();
  }

  List<String> get availableBrands {
    return products.map((p) => p.brand).toSet().toList();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        _handleBack(context);
        return false;
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.white,
          elevation: 0,
          leading: AppBackButton(
            onTap: () => _handleBack(context),
            size: _s(20),
          ),
          title: Column(
            children: [
              Text(
                widget.categoryName,
                style: TextStyle(color: Colors.black, fontSize: _s(18), fontWeight: FontWeight.w600),
              ),
              Text(
                '${filteredProducts.length} produits',
                style: TextStyle(color: Colors.grey.shade600, fontSize: _s(12)),
              ),
            ],
          ),
          centerTitle: true,
          actions: [
            IconButton(
              icon: Icon(Icons.search, color: Colors.black, size: _s(24)),
              onPressed: _openSearch,
            ),
          ],
        ),
        body: Column(
          children: [
            _buildCoinOriginalBadge(),
            _buildFilters(),
            Expanded(child: _buildProductGrid()),
          ],
        ),
      ),
    );
  }

  void _handleBack(BuildContext context) {
    Navigator.pop(context);
  }

  Future<void> _openSearch() async {
    final result = await showSearch<String?>(
      context: context,
      delegate: _CategorySearchDelegate(products: products, initialQuery: searchQuery),
    );

    if (!mounted || result == null) return;

    setState(() {
      searchQuery = result;
    });
  }

  Widget _buildCoinOriginalBadge() {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: _s(20), vertical: _s(8)),
      padding: EdgeInsets.symmetric(horizontal: _s(12), vertical: _s(8)),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade200),
        borderRadius: BorderRadius.circular(_s(20)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('Coin Original', style: TextStyle(fontSize: _s(14), fontWeight: FontWeight.w500)),
          SizedBox(width: _s(4)),
          Icon(Icons.verified, size: _s(16), color: Colors.blue.shade600),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return SizedBox(
      height: _s(50),
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.symmetric(horizontal: _s(20)),
        children: [
          _buildFilterChip('Marque', () => _showBrandFilter()),
          _buildFilterChip('Taille', () {}),
          _buildFilterChip('Prix', () {}),
          _buildFilterChip('Couleur', () {}),
          _buildSortChip(),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, VoidCallback onTap) {
    return Container(
      margin: EdgeInsets.only(right: _s(8)),
      child: OutlinedButton.icon(
        onPressed: onTap,
        icon: Text(label, style: TextStyle(color: Colors.black, fontSize: _s(14), fontWeight: FontWeight.w500)),
        label: Icon(Icons.keyboard_arrow_up, size: _s(18), color: Colors.grey.shade600),
        style: OutlinedButton.styleFrom(
          padding: EdgeInsets.symmetric(horizontal: _s(16), vertical: _s(8)),
          side: BorderSide(color: Colors.grey.shade300),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(_s(20))),
        ),
      ),
    );
  }

  Widget _buildSortChip() {
    return ElevatedButton.icon(
      onPressed: _showSortBottomSheet,
      icon: Text(selectedSort, style: TextStyle(color: Colors.black, fontSize: _s(14), fontWeight: FontWeight.w500)),
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.keyboard_arrow_down, size: _s(18), color: Colors.grey.shade600),
          SizedBox(width: _s(4)),
          Icon(Icons.tune, size: _s(18), color: Colors.grey.shade600),
        ],
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.grey.shade100,
        elevation: 0,
        padding: EdgeInsets.symmetric(horizontal: _s(16), vertical: _s(8)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(_s(20))),
      ),
    );
  }

  Widget _buildProductGrid() {
    return GridView.builder(
      padding: EdgeInsets.all(_s(20)),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: _s(16),
        crossAxisSpacing: _s(16),
        childAspectRatio: 0.68,
      ),
      itemCount: filteredProducts.length,
      itemBuilder: (context, index) => _buildProductCard(filteredProducts[index], index),
    );
  }

  Widget _buildProductCard(CategoryProduct product, int index) {
    final favoriteProduct = product.sourceProduct ?? ProductModel(
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
      onTap: () {}, // Navigation détail produit
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(_s(16)),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: _s(10), offset: const Offset(0, 2))],
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
                      child: Center(child: _buildProductImage(product.image)),
                    ),
                  ),
                  Positioned(
                    top: _s(8),
                    right: _s(8),
                    child: GestureDetector(
                      onTap: () => context.read<FavoritesProvider>().toggleFavorite(favoriteProduct),
                      child: Container(
                        padding: EdgeInsets.all(_s(6)),
                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
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
                  Text(product.brand, style: TextStyle(color: Colors.grey.shade600, fontSize: _s(12))),
                  SizedBox(height: _s(2)),
                  Text(
                    product.name,
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: _s(14)),
                    maxLines: 1,
                  ),
                  SizedBox(height: _s(6)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(product.price, style: TextStyle(fontWeight: FontWeight.bold, fontSize: _s(16))),
                      Row(
                        children: [
                          Icon(Icons.star, color: Colors.amber, size: _s(14)),
                          SizedBox(width: _s(2)),
                          Text('${product.rating}', style: TextStyle(fontSize: _s(12), fontWeight: FontWeight.w600)),
                          Text(' (${product.reviews})', style: TextStyle(fontSize: _s(12), color: Colors.grey.shade600)),
                        ],
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

  void _showBrandFilter() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: EdgeInsets.all(_s(20)),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Marques', style: TextStyle(fontSize: _s(18), fontWeight: FontWeight.bold)),
            SizedBox(height: _s(16)),
            ListTile(
              title: Text('Toutes les marques', style: TextStyle(fontSize: _s(14))),
              trailing: selectedBrand == null ? const Icon(Icons.check) : null,
              onTap: () {
                setState(() => selectedBrand = null);
                Navigator.pop(context);
              },
            ),
            ...availableBrands.map((brand) => ListTile(
              title: Text(brand, style: TextStyle(fontSize: _s(14))),
              trailing: selectedBrand == brand ? const Icon(Icons.check) : null,
              onTap: () {
                setState(() => selectedBrand = brand);
                Navigator.pop(context);
              },
            )),
          ],
        ),
      ),
    );
  }

  void _showSortBottomSheet() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: EdgeInsets.all(_s(20)),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Trier par', style: TextStyle(fontSize: _s(18), fontWeight: FontWeight.bold)),
            SizedBox(height: _s(16)),
            ...['Popularité', 'Nouveautés', 'Prix croissant', 'Prix décroissant', 'Meilleures notes']
                .map((option) => ListTile(
                      title: Text(option, style: TextStyle(fontSize: _s(14))),
                      trailing: selectedSort == option ? const Icon(Icons.check) : null,
                      onTap: () {
                        setState(() => selectedSort = option);
                        Navigator.pop(context);
                      },
                    )),
          ],
        ),
      ),
    );
  }

  Widget _buildProductImage(String image) {
    return NetworkImageWidget(
      imageUrl: image.isNotEmpty ? image : null,
      fit: BoxFit.contain,
      width: double.infinity,
      height: double.infinity,
      errorWidget: Center(
        child: Icon(Icons.image, size: _s(60), color: Colors.grey.shade300),
      ),
    );
  }

  double _parseDisplayedPrice(String price) {
    final normalized = price.replaceAll('DH', '').replaceAll(' ', '').replaceAll(',', '.').trim();
    return double.tryParse(normalized) ?? 0;
  }
}

class _CategorySearchDelegate extends SearchDelegate<String?> {
  final List<CategoryProduct> products;

  _CategorySearchDelegate({
    required this.products,
    String initialQuery = '',
  }) {
    query = initialQuery;
  }

  List<CategoryProduct> get _results {
    final normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.isEmpty) return products;

    return products.where((product) {
      return '${product.name} ${product.brand}'.toLowerCase().contains(normalizedQuery);
    }).toList();
  }

  @override
  List<Widget>? buildActions(BuildContext context) {
    return [
      if (query.isNotEmpty)
        IconButton(
          onPressed: () {
            query = '';
            showSuggestions(context);
          },
          icon: const Icon(Icons.close),
        ),
    ];
  }

  @override
  Widget? buildLeading(BuildContext context) {
    return IconButton(
      onPressed: () => close(context, null),
      icon: const Icon(Icons.arrow_back),
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    return _CategorySearchResults(
      products: _results,
      onSelected: (value) => close(context, value),
      query: query,
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    return _CategorySearchResults(
      products: _results,
      onSelected: (value) => close(context, value),
      query: query,
    );
  }

  @override
  void showResults(BuildContext context) {
    if (query.trim().isNotEmpty) {
      close(context, query.trim());
      return;
    }

    super.showResults(context);
  }
}

class _CategorySearchResults extends StatelessWidget {
  final List<CategoryProduct> products;
  final ValueChanged<String> onSelected;
  final String query;

  const _CategorySearchResults({
    required this.products,
    required this.onSelected,
    required this.query,
  });

  @override
  Widget build(BuildContext context) {
    if (products.isEmpty) {
      return Center(
        child: Text(
          'Aucun resultat',
          style: TextStyle(
            color: Colors.grey.shade600,
            fontSize: _s(14),
            fontWeight: FontWeight.w500,
          ),
        ),
      );
    }

    return ListView.separated(
      itemCount: products.length,
      separatorBuilder: (_, __) => Divider(height: 1, color: Colors.grey.shade200),
      itemBuilder: (context, index) {
        final product = products[index];
        return ListTile(
          leading: SizedBox(
            width: _s(44),
            height: _s(44),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(_s(8)),
              child: NetworkImageWidget(
                imageUrl: product.image,
                fit: BoxFit.cover,
                width: double.infinity,
                height: double.infinity,
              ),
            ),
          ),
          title: Text(
            product.name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(fontSize: _s(14), fontWeight: FontWeight.w600),
          ),
          subtitle: Text(
            product.brand,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(fontSize: _s(12), color: Colors.grey.shade600),
          ),
          trailing: Text(
            product.price,
            style: TextStyle(fontSize: _s(13), fontWeight: FontWeight.w700),
          ),
          onTap: () => onSelected(query.trim().isEmpty ? product.name : query.trim()),
        );
      },
    );
  }
}
