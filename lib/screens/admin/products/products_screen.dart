import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/providers/product_provider.dart';
import 'package:coin_original_mobile/screens/admin/products/add_product_screen.dart';
import 'package:coin_original_mobile/screens/admin/admin_dashboard_screen.dart';
import 'package:coin_original_mobile/screens/admin/orders/orders_screen.dart';
import 'package:coin_original_mobile/screens/admin/widgets/admin_drawer.dart';
import 'package:coin_original_mobile/screens/admin/clients/clients_screen.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

const double _kScale = 0.8;
double _s(double value) => value * _kScale;

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<ProductProvider>().listenToAllProducts();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    // Le stream sera arrêté automatiquement quand le provider est disposé
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        title: Text(
          'Gestion Produits',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w700,
            fontFamily: 'Poppins',
            fontSize: _s(20),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: Color(0xFFFF6A00)),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => const AddProductScreen(),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          AdminNavBar(
            scale: _s,
            currentSection: AdminSection.products,
            onDashboard: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (_) => const AdminDashboardScreen(),
                ),
              );
            },
            onProducts: () {},
            onOrders: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (_) => const OrdersScreen(),
                ),
              );
            },
            onClients: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (_) => const ClientsScreen(),
                ),
              );
            },
          ),
          Container(
            color: Colors.white,
            padding: EdgeInsets.all(_s(16)),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  onChanged: (value) {
                    context.read<ProductProvider>().search(value.trim());
                  },
                  decoration: InputDecoration(
                    hintText: 'Rechercher un produit, SKU...',
                    prefixIcon: const Icon(
                      Icons.search,
                      color: Color(0xFFFF6A00),
                    ),
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.filter_list),
                      onPressed: () {},
                    ),
                    filled: true,
                    fillColor: const Color(0xFFF5F5F7),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(_s(12)),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                SizedBox(height: _s(12)),
                Row(
                  children: [
                    const _FilterChip(label: 'Statut: Tous'),
                    SizedBox(width: _s(8)),
                    const _FilterChip(label: 'Stock: Tous'),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            child: Consumer<ProductProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading && provider.products.isEmpty) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (provider.error != null && provider.products.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.error_outline,
                            size: _s(48), color: Colors.red[300]),
                        SizedBox(height: _s(12)),
                        Text(
                          'Erreur: ${provider.error}',
                          style: TextStyle(
                            fontSize: _s(14),
                            color: Colors.red[600],
                            fontFamily: 'Poppins',
                          ),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: _s(16)),
                        ElevatedButton(
                          onPressed: () => provider.listenToAllProducts(),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFF6A00),
                          ),
                          child: const Text('Réessayer',
                              style: TextStyle(color: Colors.white)),
                        ),
                      ],
                    ),
                  );
                }

                final products = provider.searchQuery.isEmpty
                    ? provider.products
                    : provider.products.where((p) {
                        final q = provider.searchQuery.toLowerCase();
                        return p.name.toLowerCase().contains(q) ||
                            p.sku.toLowerCase().contains(q);
                      }).toList();

                if (products.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.inventory_2_outlined,
                            size: _s(64), color: Colors.grey[400]),
                        SizedBox(height: _s(16)),
                        Text(
                          provider.searchQuery.isEmpty
                              ? 'Aucun produit trouvé'
                              : 'Aucun résultat pour "${provider.searchQuery}"',
                          style: TextStyle(
                            fontSize: _s(16),
                            color: Colors.grey[600],
                            fontFamily: 'Poppins',
                          ),
                        ),
                        SizedBox(height: _s(16)),
                        ElevatedButton(
                          onPressed: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const AddProductScreen(),
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFF6A00),
                          ),
                          child: const Text('Ajouter un produit',
                              style: TextStyle(color: Colors.white)),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  padding: EdgeInsets.fromLTRB(
                    _s(16),
                    _s(16),
                    _s(16),
                    _s(90),
                  ),
                  itemCount: products.length,
                  itemBuilder: (context, index) {
                    final product = products[index];
                    return _ProductCard(
                      product: product,
                      onEdit: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => AddProductScreen(product: product),
                        ),
                      ),
                      onDelete: () => _deleteProduct(context, product.id),
                      onDuplicate: () => _duplicateProduct(context, product),
                      onToggleStatus: () => _toggleStatus(context, product),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const AddProductScreen()),
        ),
        backgroundColor: const Color(0xFFFF6A00),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text(
          'Ajouter',
          style: TextStyle(
            color: Colors.white,
            fontFamily: 'Poppins',
          ),
        ),
      ),
    );
  }

  Future<void> _deleteProduct(BuildContext context, String id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmer la suppression'),
        content: const Text('Voulez-vous vraiment supprimer ce produit ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Annuler'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Supprimer', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirmed == true && context.mounted) {
      final success = await context.read<ProductProvider>().deleteProduct(id);
      if (context.mounted) {}
    }
  }

  Future<void> _duplicateProduct(
      BuildContext context, ProductModel product) async {
    final newProduct = ProductModel(
      id: '',
      name: '${product.name} (Copie)',
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      images: product.images,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      stock: 0,
      rating: product.rating,
      reviewCount: product.reviewCount,
      isActive: true,
      createdAt: DateTime.now(),
      brand: product.brand,
      sku: '${product.sku}-COPY',
      barcode: product.barcode,
      shortDescription: product.shortDescription,
      videoUrl: product.videoUrl,
      promoPrice: product.promoPrice,
      promoStart: product.promoStart,
      promoEnd: product.promoEnd,
      minStock: product.minStock,
      weight: product.weight,
      dimensions: product.dimensions,
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      seoUrl: '${product.seoUrl}-copy',
      variants: product.variants,
      colors: product.colors,
      status: 'Brouillon',
    );

    final success =
        await context.read<ProductProvider>().addProduct(newProduct);
    if (context.mounted) {}
  }

  Future<void> _toggleStatus(BuildContext context, ProductModel product) async {
    final isPublished = product.status == 'Publié';
    final newStatus = isPublished ? 'Masqué' : 'Publié';
    final success = await context.read<ProductProvider>().updateProduct(
      product.id,
      {
        'status': newStatus,
        'isActive': !isPublished,
        'hidden': isPublished,
      },
    );
    if (context.mounted) {}
  }
}

class _FilterChip extends StatelessWidget {
  final String label;

  const _FilterChip({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: _s(12), vertical: _s(6)),
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFFFF6A00)),
        borderRadius: BorderRadius.circular(_s(20)),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: _s(12),
          color: const Color(0xFFFF6A00),
          fontFamily: 'Poppins',
        ),
      ),
    );
  }
}

class _ProductCard extends StatelessWidget {
  final ProductModel product;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final VoidCallback onDuplicate;
  final VoidCallback onToggleStatus;

  const _ProductCard({
    required this.product,
    required this.onEdit,
    required this.onDelete,
    required this.onDuplicate,
    required this.onToggleStatus,
  });

  @override
  Widget build(BuildContext context) {
    final isPublished = product.status == 'Publié';
    final hasPromo =
        product.promoPrice != null && product.promoPrice! > product.price;
    final imageUrl =
        product.imageUrl; // utilise le getter qui gère web + mobile

    return Container(
      margin: EdgeInsets.only(bottom: _s(12)),
      padding: EdgeInsets.all(_s(12)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_s(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: _s(10),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(_s(8)),
                child: NetworkImageWidget(
                  imageUrl: imageUrl,
                  width: _s(70),
                  height: _s(70),
                  borderRadius: BorderRadius.circular(_s(8)),
                ),
              ),
              SizedBox(width: _s(12)),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.name,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: _s(15),
                        fontFamily: 'Poppins',
                      ),
                    ),
                    SizedBox(height: _s(4)),
                    Text(
                      product.shortDescription,
                      style: TextStyle(
                        fontSize: _s(13),
                        color: Colors.grey[600],
                        fontFamily: 'Poppins',
                      ),
                    ),
                    SizedBox(height: _s(4)),
                    Text(
                      'SKU: ${product.sku}${product.barcode == null || product.barcode!.isEmpty ? '' : ' • CB: ${product.barcode}'}',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: _s(11),
                        color: Colors.grey[700],
                        fontFamily: 'Poppins',
                      ),
                    ),
                    SizedBox(height: _s(2)),
                    Text(
                      'Stock ${product.stock} • SEO: ${product.seoUrl}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: _s(11),
                        color: Colors.grey[600],
                        fontFamily: 'Poppins',
                      ),
                    ),
                    SizedBox(height: _s(4)),
                    Row(
                      children: [
                        Container(
                          padding: EdgeInsets.symmetric(
                              horizontal: _s(8), vertical: _s(4)),
                          decoration: BoxDecoration(
                            color:
                                const Color(0xFFFF6A00).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(_s(6)),
                          ),
                          child: Text(
                            product.price > 0
                                ? '${product.price.toStringAsFixed(0)} DH'
                                : 'Prix non défini',
                            style: TextStyle(
                              fontSize: _s(14),
                              fontWeight: FontWeight.w700,
                              color: product.price > 0
                                  ? const Color(0xFF171717)
                                  : Colors.grey[600],
                              fontFamily: 'Poppins',
                            ),
                          ),
                        ),
                        if (hasPromo) ...[
                          SizedBox(width: _s(6)),
                          Text(
                            '${product.promoPrice!.toStringAsFixed(0)} DH',
                            style: TextStyle(
                              fontSize: _s(11),
                              color: Colors.grey[500],
                              fontFamily: 'Poppins',
                              decoration: TextDecoration.lineThrough,
                            ),
                          ),
                        ],
                      ],
                    ),
                    SizedBox(height: _s(4)),
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: _s(8),
                        vertical: _s(2),
                      ),
                      decoration: BoxDecoration(
                        color: isPublished
                            ? Colors.green.withValues(alpha: 0.1)
                            : Colors.orange.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(_s(6)),
                      ),
                      child: Text(
                        product.status,
                        style: TextStyle(
                          fontSize: _s(11),
                          color: isPublished ? Colors.green : Colors.orange,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'Poppins',
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: _s(12)),
          Row(
            children: [
              _ActionBtn(
                icon: Icons.edit_outlined,
                label: 'Modifier',
                onTap: onEdit,
              ),
              _ActionBtn(
                icon: Icons.delete_outline,
                label: 'Supprimer',
                onTap: onDelete,
              ),
              _ActionBtn(
                icon: Icons.copy_outlined,
                label: 'Dupliquer',
                onTap: onDuplicate,
              ),
              _ActionBtn(
                icon: Icons.power_settings_new,
                label: 'Statut',
                onTap: onToggleStatus,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ActionBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ActionBtn({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Column(
          children: [
            Icon(icon, size: _s(18), color: const Color(0xFFFF6A00)),
            SizedBox(height: _s(2)),
            Text(
              label,
              style: TextStyle(
                fontSize: _s(10),
                fontFamily: 'Poppins',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
