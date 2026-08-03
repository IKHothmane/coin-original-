import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/providers/cart_provider.dart';
import 'package:coin_original_mobile/providers/favorites_provider.dart';
import 'package:coin_original_mobile/screens/client/category/all_categories_screen.dart';
import 'package:coin_original_mobile/screens/client/main_screen.dart';
import 'package:coin_original_mobile/utils/helpers.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

const double _kScale = 0.8;

double _s(double value) => value * _kScale;

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  Future<void> _removeFavorite(
      BuildContext context, ProductModel product) async {
    context.read<FavoritesProvider>().removeFavorite(product.id);
  }

  Future<void> _addToCart(BuildContext context, ProductModel product) async {
    await context.read<CartProvider>().addToCart(product);
    if (!context.mounted) return;
  }

  @override
  Widget build(BuildContext context) {
    final favoriteProducts = context.watch<FavoritesProvider>().favorites;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F8F8),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        automaticallyImplyLeading: false,
        titleSpacing: _s(16),
        title: Row(
          children: [
            const Text(
              'Coin Original',
              style: TextStyle(
                color: Colors.black,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
            const Spacer(),
            const Text(
              'Mes Favoris',
              style: TextStyle(
                color: Colors.black,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Spacer(),
            Row(
              children: [
                Icon(Icons.favorite, color: Colors.red, size: _s(20)),
                SizedBox(width: _s(4)),
                Text(
                  '${favoriteProducts.length} articles',
                  style: const TextStyle(
                    color: Colors.black,
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ],
        ),
        centerTitle: false,
      ),
      body: favoriteProducts.isEmpty
          ? _buildEmptyState(context)
          : GridView.builder(
              padding: EdgeInsets.all(_s(16)),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.68,
                crossAxisSpacing: _s(12),
                mainAxisSpacing: _s(12),
              ),
              itemCount: favoriteProducts.length,
              itemBuilder: (context, index) {
                return _buildProductCard(context, favoriteProducts[index]);
              },
            ),
    );
  }

  Widget _buildProductCard(BuildContext context, ProductModel product) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_s(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: _s(8),
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F5),
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(_s(16)),
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(_s(16)),
                    ),
                    child: Padding(
                      padding: EdgeInsets.all(_s(10)),
                      child: NetworkImageWidget(
                        imageUrl: product.imageUrl,
                        fit: BoxFit.contain,
                        width: double.infinity,
                        errorWidget: const Center(
                          child: Icon(
                            Icons.broken_image_outlined,
                            color: Colors.black26,
                            size: 32,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: _s(8),
                  right: _s(8),
                  child: GestureDetector(
                    onTap: () => _removeFavorite(context, product),
                    child: Container(
                      padding: EdgeInsets.all(_s(6)),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.favorite,
                        color: Colors.red,
                        size: _s(20),
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
                if ((product.brand ?? '').trim().isNotEmpty)
                  Text(
                    product.brand!,
                    style: TextStyle(
                      fontSize: _s(11),
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w500,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                if ((product.brand ?? '').trim().isNotEmpty)
                  SizedBox(height: _s(2)),
                Text(
                  product.name,
                  style: TextStyle(
                    fontSize: _s(14),
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: _s(4)),
                Text(
                  Helpers.formatPrice(product.price),
                  style: TextStyle(
                    fontSize: _s(16),
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF1A56DB),
                  ),
                ),
                SizedBox(height: _s(8)),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => _addToCart(context, product),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      padding: EdgeInsets.symmetric(vertical: _s(10)),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(_s(10)),
                      ),
                      elevation: 0,
                    ),
                    icon: Icon(
                      Icons.shopping_bag_outlined,
                      size: _s(16),
                      color: Colors.white,
                    ),
                    label: Text(
                      'Ajouter au panier',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: _s(12),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.favorite_border,
              size: _s(80), color: Colors.grey.shade300),
          SizedBox(height: _s(16)),
          Text(
            'Aucun favori pour le moment',
            style: TextStyle(fontSize: _s(18), color: Colors.grey.shade600),
          ),
          SizedBox(height: _s(8)),
          Text(
            'Ajoutez des produits a vos favoris',
            style: TextStyle(fontSize: _s(14), color: Colors.grey.shade500),
          ),
          SizedBox(height: _s(24)),
          ElevatedButton(
            onPressed: () {
              final mainScreenTabs = MainScreenTabScope.maybeOf(context);
              if (mainScreenTabs != null) {
                mainScreenTabs.onSelectTab(1);
                return;
              }

              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const AllCategoriesScreen(),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.black,
              padding:
                  EdgeInsets.symmetric(horizontal: _s(32), vertical: _s(12)),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(_s(12))),
            ),
            child: Text(
              'Decouvrir des produits',
              style: TextStyle(color: Colors.white, fontSize: _s(14)),
            ),
          ),
        ],
      ),
    );
  }
}
