import 'package:coin_original_mobile/models/address_model.dart';
import 'package:coin_original_mobile/models/cart_item_model.dart';
import 'package:coin_original_mobile/models/order_model.dart';
import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:coin_original_mobile/providers/cart_provider.dart';
import 'package:coin_original_mobile/providers/order_provider.dart';
import 'package:coin_original_mobile/services/local_notification_service.dart';
import 'package:coin_original_mobile/utils/constants.dart';
import 'package:coin_original_mobile/utils/helpers.dart';
import 'package:coin_original_mobile/utils/routes.dart';
import 'package:coin_original_mobile/widgets/app_back_button.dart';
import 'package:coin_original_mobile/widgets/loading_indicator.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

const double _kCheckoutScale = 0.8;
double _cs(double value) => value * _kCheckoutScale;

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nomCtrl = TextEditingController();
  final _prenomCtrl = TextEditingController();
  final _telCtrl = TextEditingController();
  final _villeCtrl = TextEditingController(text: 'Casablanca');

  static const String _paymentMethod = 'cash_on_delivery';
  bool _isProcessing = false;
  bool _didPrefill = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_didPrefill) return;

    final user = context.read<AuthProvider>().user;
    if (user != null) {
      final parts = user.name
          .trim()
          .split(RegExp(r'\s+'))
          .where((part) => part.isNotEmpty)
          .toList();
      if (parts.isNotEmpty) {
        _nomCtrl.text = parts.first;
        if (parts.length > 1) {
          _prenomCtrl.text = parts.sublist(1).join(' ');
        }
      }
      if ((user.phone ?? '').trim().isNotEmpty) {
        _telCtrl.text = user.phone!.trim();
      }
      if (user.addresses.isNotEmpty) {
        final address = user.addresses.first;
        _villeCtrl.text = address.city;
        if ((_telCtrl.text).trim().isEmpty &&
            (address.phone ?? '').trim().isNotEmpty) {
          _telCtrl.text = address.phone!.trim();
        }
      }
    }

    _didPrefill = true;
  }

  @override
  void dispose() {
    _nomCtrl.dispose();
    _prenomCtrl.dispose();
    _telCtrl.dispose();
    _villeCtrl.dispose();
    super.dispose();
  }

  double _deliveryFee(CartProvider cartProvider) {
    if (cartProvider.items.isEmpty) return 0;
    return cartProvider.totalPrice >= 500 ? 0 : 25;
  }

  String _fullName(AuthProvider authProvider) {
    final manualName =
        '${_nomCtrl.text.trim()} ${_prenomCtrl.text.trim()}'.trim();
    if (manualName.isNotEmpty) return manualName;
    return authProvider.user?.name ?? '';
  }

  Future<void> _placeOrder() async {
    if (!_formKey.currentState!.validate()) return;

    final cartProvider = context.read<CartProvider>();
    final authProvider = context.read<AuthProvider>();
    final orderProvider = context.read<OrderProvider>();
    final user = authProvider.user;

    if (cartProvider.items.isEmpty) {
      return;
    }

    setState(() => _isProcessing = true);

    final totalAmount = cartProvider.totalPrice + _deliveryFee(cartProvider);
    final address = AddressModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      street: 'Adresse non renseignee',
      city: _villeCtrl.text.trim(),
      postalCode: '',
      phone: _telCtrl.text.trim(),
    );

    final order = OrderModel(
      id: '',
      userId: user?.id ?? 'guest-${DateTime.now().millisecondsSinceEpoch}',
      userName: _fullName(authProvider),
      userEmail: user?.email ?? 'guest@coin-original.app',
      items: cartProvider.items,
      totalAmount: totalAmount,
      address: address,
      paymentMethod: _paymentMethod,
      createdAt: DateTime.now(),
    );

    final success = await orderProvider.createOrder(order);

    if (success && mounted) {
      await cartProvider.clearCart();
      if (!mounted) return;
      setState(() => _isProcessing = false);

      await LocalNotificationService.instance.showOrderNotification(
        title: 'Commande confirmee',
        body:
            'Commande confirmee pour ${_fullName(authProvider)}. Nous allons vous contacter rapidement pour la livraison.',
      );

      if (!mounted) return;

      Navigator.pushNamedAndRemoveUntil(
        context,
        AppRoutes.home,
        (route) => false,
      );
    } else if (mounted) {
      setState(() => _isProcessing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cartProvider = context.watch<CartProvider>();
    final subtotal = cartProvider.totalPrice;
    final shipping = _deliveryFee(cartProvider);
    final total = subtotal + shipping;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        leading: AppBackButton(
          onTap: () => Navigator.pop(context),
        ),
        title: const Text(
          'Passer la commande',
          style: TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w700,
            fontSize: 16,
          ),
        ),
        centerTitle: true,
      ),
      body: _isProcessing
          ? const LoadingIndicator(message: 'Traitement de votre commande...')
          : cartProvider.items.isEmpty
              ? _buildEmptyState()
              : SingleChildScrollView(
                  padding:
                      EdgeInsets.fromLTRB(_cs(12), _cs(12), _cs(12), _cs(24)),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        _buildDeliverySection(),
                        SizedBox(height: _cs(12)),
                        _buildSummarySection(
                          cartProvider: cartProvider,
                          subtotal: subtotal,
                          shipping: shipping,
                          total: total,
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(_cs(24)),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.shopping_bag_outlined,
                size: _cs(56), color: Colors.grey.shade400),
            SizedBox(height: _cs(12)),
            const Text(
              'Votre panier est vide',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
            ),
            SizedBox(height: _cs(8)),
            Text(
              'Ajoutez un produit avant de confirmer votre commande.',
              style: TextStyle(color: Colors.grey.shade600, fontSize: _cs(14)),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDeliverySection() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(_cs(16)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_cs(18)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: _cs(14),
            offset: Offset(0, _cs(4)),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Center(
            child: Text(
              'COIN ORIGINAL',
              style: TextStyle(
                color: Color(0xFFFF6A00),
                fontWeight: FontWeight.bold,
                fontSize: 10,
                letterSpacing: 0.9,
              ),
            ),
          ),
          SizedBox(height: _cs(18)),
          _buildSectionHeader(
            icon: Icons.location_on_outlined,
            title: 'Informations de livraison',
          ),
          SizedBox(height: _cs(16)),
          Row(
            children: [
              Expanded(
                child: _CheckoutField(
                  label: 'Nom',
                  hint: 'Entrez votre nom',
                  controller: _nomCtrl,
                ),
              ),
              SizedBox(width: _cs(10)),
              Expanded(
                child: _CheckoutField(
                  label: 'Prenom',
                  hint: 'Entrez votre prenom',
                  controller: _prenomCtrl,
                ),
              ),
            ],
          ),
          _CheckoutField(
            label: 'Numero de telephone',
            hint: '+212 6 12 34 56 78',
            controller: _telCtrl,
            keyboard: TextInputType.phone,
          ),
          _CheckoutField(
            label: 'Ville',
            hint: 'Casablanca',
            controller: _villeCtrl,
          ),
          SizedBox(height: _cs(10)),
          const Text(
            'Mode de paiement',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 11,
            ),
          ),
          SizedBox(height: _cs(8)),
          _buildFixedPaymentMethod(),
        ],
      ),
    );
  }

  Widget _buildSummarySection({
    required CartProvider cartProvider,
    required double subtotal,
    required double shipping,
    required double total,
  }) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(_cs(16)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_cs(18)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: _cs(14),
            offset: Offset(0, _cs(4)),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionHeader(
            icon: Icons.shopping_bag_outlined,
            title: 'Resume de la commande',
          ),
          SizedBox(height: _cs(16)),
          ...cartProvider.items.map(_buildOrderItem).toList(),
          SizedBox(height: _cs(16)),
          Container(
            padding: EdgeInsets.all(_cs(14)),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F9FA),
              borderRadius: BorderRadius.circular(_cs(14)),
            ),
            child: Column(
              children: [
                _PriceRow(
                  label: 'Sous-total',
                  value: Helpers.formatPrice(subtotal),
                ),
                _PriceRow(
                  label: 'Livraison',
                  value:
                      shipping == 0 ? 'Offerte' : Helpers.formatPrice(shipping),
                ),
                const _PriceRow(
                  label: 'Remise',
                  value: '-0 DH',
                ),
                Divider(height: _cs(22)),
                _PriceRow(
                  label: 'Total',
                  value: Helpers.formatPrice(total),
                  isTotal: true,
                ),
              ],
            ),
          ),
          SizedBox(height: _cs(18)),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _placeOrder,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF6A00),
                foregroundColor: Colors.white,
                elevation: 0,
                padding: EdgeInsets.symmetric(
                    vertical: _cs(16), horizontal: _cs(18)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(_cs(14)),
                ),
              ),
              child: Column(
                children: [
                  const Text(
                    'Confirmer la commande',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: _cs(4)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.lock, color: Colors.white70, size: _cs(12)),
                      SizedBox(width: _cs(4)),
                      Flexible(
                        child: Text(
                          'Paiement securise • Vos donnees sont protegees',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: _cs(10),
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader({
    required IconData icon,
    required String title,
  }) {
    return Row(
      children: [
        Icon(icon, color: const Color(0xFFFF6A00), size: _cs(20)),
        SizedBox(width: _cs(6)),
        Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 13,
          ),
        ),
      ],
    );
  }

  Widget _buildOrderItem(CartItemModel item) {
    final size =
        item.product.variants.isNotEmpty ? item.product.variants.first : '';
    final detailsParts = <String>[];
    if (size.isNotEmpty) detailsParts.add('Taille: $size');
    if ((item.product.brand ?? '').trim().isNotEmpty) {
      detailsParts.add(item.product.brand!.trim());
    }

    return Padding(
      padding: EdgeInsets.only(bottom: _cs(12)),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(_cs(12)),
            child: NetworkImageWidget(
              imageUrl: item.product.imageUrl,
              width: _cs(64),
              height: _cs(64),
              fit: BoxFit.cover,
            ),
          ),
          SizedBox(width: _cs(12)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.product.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style:
                      TextStyle(fontWeight: FontWeight.w600, fontSize: _cs(14)),
                ),
                SizedBox(height: _cs(3)),
                Text(
                  detailsParts.isEmpty
                      ? 'Produit Coin Original'
                      : detailsParts.join(' • '),
                  style:
                      TextStyle(fontSize: _cs(12), color: Colors.grey.shade600),
                ),
              ],
            ),
          ),
          SizedBox(width: _cs(8)),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding:
                    EdgeInsets.symmetric(horizontal: _cs(6), vertical: _cs(2)),
                decoration: BoxDecoration(
                  color: Colors.grey.shade200,
                  borderRadius: BorderRadius.circular(_cs(6)),
                ),
                child: Text(
                  'x${item.quantity}',
                  style: TextStyle(fontSize: _cs(12)),
                ),
              ),
              SizedBox(height: _cs(4)),
              Text(
                Helpers.formatPrice(item.totalPrice),
                style:
                    TextStyle(fontWeight: FontWeight.bold, fontSize: _cs(14)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFixedPaymentMethod() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: _cs(12), vertical: _cs(14)),
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFFFF6A00), width: 1.4),
        borderRadius: BorderRadius.circular(_cs(12)),
        color: const Color(0xFFFFF3EC),
      ),
      child: Row(
        children: [
          Icon(Icons.payments_outlined,
              color: const Color(0xFFFF6A00), size: _cs(24)),
          SizedBox(width: _cs(10)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Paiement a la livraison',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: _cs(14),
                  ),
                ),
                SizedBox(height: _cs(2)),
                Text(
                  'Reglement a reception',
                  style:
                      TextStyle(fontSize: _cs(12), color: Colors.grey.shade600),
                ),
              ],
            ),
          ),
          Icon(Icons.check_circle,
              size: _cs(20), color: const Color(0xFFFF6A00)),
        ],
      ),
    );
  }
}

class _CheckoutField extends StatelessWidget {
  final String label;
  final String hint;
  final TextEditingController controller;
  final TextInputType? keyboard;
  final int maxLines;

  const _CheckoutField({
    required this.label,
    required this.hint,
    required this.controller,
    this.keyboard,
    this.maxLines = 1,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: _cs(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: _cs(13),
            ),
          ),
          SizedBox(height: _cs(6)),
          TextFormField(
            controller: controller,
            keyboardType: keyboard,
            maxLines: maxLines,
            decoration: InputDecoration(
              hintText: hint,
              hintStyle:
                  TextStyle(color: Colors.grey.shade500, fontSize: _cs(13)),
              filled: true,
              fillColor: const Color(0xFFF5F5F7),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(_cs(10)),
                borderSide: BorderSide(color: Colors.grey.shade300),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(_cs(10)),
                borderSide: BorderSide(color: Colors.grey.shade300),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.all(Radius.circular(_cs(10))),
                borderSide:
                    BorderSide(color: const Color(0xFFFF6A00), width: _cs(1.2)),
              ),
              contentPadding:
                  EdgeInsets.symmetric(horizontal: _cs(12), vertical: _cs(12)),
            ),
            style: TextStyle(fontSize: _cs(14)),
            validator: (value) {
              if (value == null || value.trim().isEmpty) return 'Requis';
              return null;
            },
          ),
        ],
      ),
    );
  }
}

class _PriceRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isTotal;

  const _PriceRow({
    required this.label,
    required this.value,
    this.isTotal = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: _cs(4)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              fontSize: _cs(isTotal ? 16 : 14),
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: _cs(isTotal ? 18 : 14),
              color: isTotal ? const Color(0xFFFF6A00) : Colors.black,
            ),
          ),
        ],
      ),
    );
  }
}
