import 'package:coin_original_mobile/models/cart_item_model.dart';
import 'package:coin_original_mobile/providers/cart_provider.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:coin_original_mobile/utils/helpers.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

const double _kScale = 0.8;
const double _kMainNavBarClearance = 98;

double _s(double value) => value * _kScale;

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  double _bottomClearance(BuildContext context) {
    return _s(_kMainNavBarClearance) + MediaQuery.of(context).padding.bottom;
  }

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      if (!mounted) return;
      Provider.of<CartProvider>(context, listen: false).loadCart();
    });
  }

  double _deliveryFee(CartProvider cartProvider) => 0.0;

  double _total(CartProvider cartProvider) =>
      cartProvider.totalPrice + _deliveryFee(cartProvider);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: _goToHome,
        ),
        title: const Text(
          'Mon Panier',
          style: TextStyle(
            color: Colors.black,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          Consumer<CartProvider>(
            builder: (context, cartProvider, child) {
              return Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Center(
                  child: Text(
                    '${cartProvider.items.length} articles',
                    style: TextStyle(
                        color: Colors.grey.shade600, fontSize: _s(14)),
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: Consumer<CartProvider>(
        builder: (context, cartProvider, child) {
          if (cartProvider.isLoading) {
            return const Center(
              child: CircularProgressIndicator(color: Colors.black),
            );
          }

          if (cartProvider.items.isEmpty) {
            return _buildEmptyCart();
          }

          return _buildCartContent(cartProvider);
        },
      ),
      bottomNavigationBar: Consumer<CartProvider>(
        builder: (context, cartProvider, child) {
          if (cartProvider.items.isEmpty) return const SizedBox.shrink();
          return Padding(
            padding: EdgeInsets.fromLTRB(
              _s(12),
              0,
              _s(12),
              _bottomClearance(context),
            ),
            child: _buildBottomCheckout(cartProvider),
          );
        },
      ),
    );
  }

  Widget _buildEmptyCart() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.shopping_bag_outlined,
              size: _s(80), color: Colors.grey.shade300),
          SizedBox(height: _s(16)),
          Text(
            'Votre panier est vide',
            style: TextStyle(
              fontSize: _s(18),
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade700,
            ),
          ),
          SizedBox(height: _s(8)),
          Text(
            'Ajoutez des articles pour commencer',
            style: TextStyle(fontSize: _s(14), color: Colors.grey.shade500),
          ),
          SizedBox(height: _s(24)),
          ElevatedButton(
            onPressed: _goToHome,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.black,
              padding:
                  EdgeInsets.symmetric(horizontal: _s(32), vertical: _s(12)),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(_s(12))),
            ),
            child: Text(
              'Continuer mes achats',
              style: TextStyle(color: Colors.white, fontSize: _s(14)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCartContent(CartProvider cartProvider) {
    return SingleChildScrollView(
      child: Padding(
        padding: EdgeInsets.all(_s(16)),
        child: Column(
          children: [
            ...cartProvider.items.map(_buildCartItem),
            SizedBox(height: _s(16)),
            _buildPriceSummary(cartProvider),
            SizedBox(height: _bottomClearance(context) + _s(20)),
          ],
        ),
      ),
    );
  }

  Widget _buildCartItem(CartItemModel item) {
    final product = item.product;

    return Container(
      margin: EdgeInsets.only(bottom: _s(16)),
      padding: EdgeInsets.all(_s(12)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_s(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: _s(10),
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(_s(12)),
            child: Container(
              width: _s(90),
              height: _s(90),
              color: Colors.grey.shade100,
              child: _buildProductImage(product.images.firstOrNull),
            ),
          ),
          SizedBox(width: _s(12)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(
                        product.name,
                        style: TextStyle(
                            fontSize: _s(16), fontWeight: FontWeight.w600),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    GestureDetector(
                      onTap: () => _removeItem(item.id),
                      child: Icon(Icons.delete_outline,
                          color: Colors.grey.shade500, size: _s(22)),
                    ),
                  ],
                ),
                SizedBox(height: _s(4)),
                Text(
                  'Taille : ${_displaySize(product)}',
                  style:
                      TextStyle(fontSize: _s(13), color: Colors.grey.shade600),
                ),
                SizedBox(height: _s(12)),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      Helpers.formatPrice(product.price),
                      style: TextStyle(
                          fontSize: _s(18), fontWeight: FontWeight.bold),
                    ),
                    _buildQuantitySelector(item),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuantitySelector(CartItemModel item) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(_s(20)),
      ),
      child: Row(
        children: [
          _qtyButton(
            icon: Icons.remove,
            onTap: () => _updateQuantity(item, item.quantity - 1),
          ),
          Container(
            width: _s(32),
            alignment: Alignment.center,
            child: Text(
              item.quantity.toString(),
              style: TextStyle(fontSize: _s(14), fontWeight: FontWeight.w600),
            ),
          ),
          _qtyButton(
            icon: Icons.add,
            onTap: () => _updateQuantity(item, item.quantity + 1),
          ),
        ],
      ),
    );
  }

  Widget _qtyButton({required IconData icon, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(_s(20)),
      child: Padding(
        padding: EdgeInsets.all(_s(6)),
        child: Icon(icon, size: _s(16), color: Colors.black),
      ),
    );
  }

  Widget _buildPriceSummary(CartProvider cartProvider) {
    return Container(
      padding: EdgeInsets.all(_s(16)),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(_s(16)),
      ),
      child: Column(
        children: [
          _buildPriceRow(
              'Sous-total', Helpers.formatPrice(cartProvider.totalPrice)),
          SizedBox(height: _s(12)),
          _buildPriceRow(
            'Livraison',
            'Gratuite',
            valueColor: Colors.green.shade700,
            icon: Icons.local_shipping_outlined,
          ),
          Padding(
            padding: EdgeInsets.symmetric(vertical: _s(12)),
            child: const Divider(height: 1),
          ),
          _buildPriceRow(
            'Total',
            Helpers.formatPrice(_total(cartProvider)),
            isTotal: true,
          ),
        ],
      ),
    );
  }

  Widget _buildPriceRow(
    String label,
    String value, {
    Color? valueColor,
    IconData? icon,
    bool isTotal = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: isTotal ? _s(18) : _s(15),
            fontWeight: isTotal ? FontWeight.bold : FontWeight.w500,
            color: Colors.black,
          ),
        ),
        Row(
          children: [
            if (icon != null) ...[
              Icon(icon, size: _s(16), color: valueColor ?? Colors.black),
              SizedBox(width: _s(4)),
            ],
            Text(
              value,
              style: TextStyle(
                fontSize: isTotal ? _s(20) : _s(15),
                fontWeight: isTotal ? FontWeight.bold : FontWeight.w600,
                color: valueColor ?? Colors.black,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildBottomCheckout(CartProvider cartProvider) {
    return Container(
      padding: EdgeInsets.all(_s(16)),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: _s(10),
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/checkout');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black,
                minimumSize: Size(double.infinity, _s(54)),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(_s(12))),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Passer commande',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: _s(16),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(width: _s(8)),
                  Icon(Icons.arrow_forward, color: Colors.white, size: _s(18)),
                ],
              ),
            ),
            SizedBox(height: _s(12)),
            OutlinedButton(
              onPressed: _goToHome,
              style: OutlinedButton.styleFrom(
                minimumSize: Size(double.infinity, _s(54)),
                side: BorderSide(color: Colors.grey.shade300),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(_s(12))),
              ),
              child: Text(
                'Continuer mes achats',
                style: TextStyle(
                  color: Colors.black,
                  fontSize: _s(16),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            SizedBox(height: _s(8)),
            Text(
              'Coin Original • Paiement sécurisé • Retour gratuit 30 jours',
              style: TextStyle(fontSize: _s(11), color: Colors.grey.shade500),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProductImage(String? imageUrl) {
    return NetworkImageWidget(
      imageUrl: imageUrl,
      fit: BoxFit.cover,
      width: double.infinity,
      height: double.infinity,
      placeholder: Center(
        child: Icon(Icons.image_outlined,
            size: _s(34), color: Colors.grey.shade400),
      ),
      errorWidget: Center(
        child: Icon(Icons.broken_image_outlined,
            size: _s(34), color: Colors.grey.shade400),
      ),
    );
  }

  String _displaySize(product) {
    final category = product.categoryName.toLowerCase();
    if (category.contains('vet') ||
        category.contains('shirt') ||
        category.contains('cloth')) {
      return 'M';
    }
    return '42';
  }

  void _updateQuantity(CartItemModel item, int newQty) {
    if (newQty < 1) return;
    context.read<CartProvider>().updateQuantity(item.id, newQty);
  }

  void _removeItem(String id) {
    context.read<CartProvider>().removeFromCart(id);
  }

  void _goToHome() {
    Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
  }
}
