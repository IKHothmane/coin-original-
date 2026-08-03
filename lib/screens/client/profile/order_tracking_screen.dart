import 'package:coin_original_mobile/models/cart_item_model.dart';
import 'package:coin_original_mobile/models/order_model.dart';
import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:coin_original_mobile/providers/order_provider.dart';
import 'package:coin_original_mobile/services/order_service.dart';
import 'package:coin_original_mobile/utils/constants.dart';
import 'package:coin_original_mobile/utils/enums.dart';
import 'package:coin_original_mobile/utils/helpers.dart';
import 'package:coin_original_mobile/widgets/app_back_button.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

const double _kOrderTrackingScale = 0.8;
double _ots(double value) => value * _kOrderTrackingScale;

class OrderTrackingScreen extends StatefulWidget {
  final String? initialOrderId;

  const OrderTrackingScreen({
    super.key,
    this.initialOrderId,
  });

  @override
  State<OrderTrackingScreen> createState() => _OrderTrackingScreenState();
}

class _OrderTrackingScreenState extends State<OrderTrackingScreen> {
  final OrderService _orderService = OrderService();
  late final TextEditingController _referenceController;
  String? _trackedOrderId;
  String? _loadedOrdersForUserId;

  @override
  void initState() {
    super.initState();
    final initialOrderId = widget.initialOrderId?.trim();
    _trackedOrderId = initialOrderId?.isEmpty ?? true ? null : initialOrderId;
    _referenceController = TextEditingController(text: _trackedOrderId ?? '');
  }

  @override
  void dispose() {
    _referenceController.dispose();
    super.dispose();
  }

  Future<void> _pasteReference() async {
    final data = await Clipboard.getData(Clipboard.kTextPlain);
    final text = data?.text?.trim() ?? '';
    if (text.isEmpty) return;
    _referenceController.text = text;
  }

  void _submitReference() {
    final normalized = _referenceController.text.trim();
    if (normalized.isEmpty) return;
    setState(() {
      _trackedOrderId = normalized;
      _referenceController.text = normalized;
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncUserOrders();
  }

  void _syncUserOrders() {
    final authProvider = context.read<AuthProvider>();
    final orderProvider = context.read<OrderProvider>();
    final userId = authProvider.user?.id;

    if (userId == null || userId.isEmpty) {
      if (_loadedOrdersForUserId != null) {
        _loadedOrdersForUserId = null;
        orderProvider.clearUserOrders();
      }
      return;
    }

    if (_loadedOrdersForUserId == userId) return;
    _loadedOrdersForUserId = userId;
    Future.microtask(() => orderProvider.loadUserOrders());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        leading: AppBackButton(
          onTap: () => Navigator.pop(context),
        ),
        title: Text(
          'Suivi de commande',
          style: TextStyle(
            color: Colors.black,
            fontSize: _ots(18),
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.fromLTRB(_ots(16), _ots(16), _ots(16), _ots(28)),
        child: Column(
          children: [
            _buildSearchCard(),
            SizedBox(height: _ots(14)),
            _buildAccountOrdersSection(),
            if (_trackedOrderId != null) ...[
              SizedBox(height: _ots(14)),
              _buildTrackedOrder(),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSearchCard() {
    final hasReference = _referenceController.text.trim().isNotEmpty;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(_ots(18)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_ots(18)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: _ots(14),
            offset: Offset(0, _ots(4)),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: EdgeInsets.symmetric(horizontal: _ots(10), vertical: _ots(6)),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF1E8),
              borderRadius: BorderRadius.circular(_ots(999)),
            ),
            child: Text(
              'Suivi',
              style: TextStyle(
                color: const Color(0xFFFF6A00),
                fontSize: _ots(10),
                fontWeight: FontWeight.w700,
                letterSpacing: 0.6,
              ),
            ),
          ),
          SizedBox(height: _ots(12)),
          Text(
            'Suivi de commande',
            style: TextStyle(
              fontSize: _ots(22),
              fontWeight: FontWeight.w700,
              color: Colors.black,
            ),
          ),
          SizedBox(height: _ots(8)),
          Text(
            'Collez la reference de commande affichee sur la confirmation ou dans votre message WhatsApp.',
            style: TextStyle(
              color: Colors.grey.shade600,
              fontSize: _ots(13),
              height: 1.45,
            ),
          ),
          SizedBox(height: _ots(16)),
          Text(
            'Reference de commande',
            style: TextStyle(
              color: Colors.grey.shade700,
              fontSize: _ots(12),
              fontWeight: FontWeight.w600,
            ),
          ),
          SizedBox(height: _ots(8)),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _referenceController,
                  onChanged: (_) => setState(() {}),
                  onSubmitted: (_) => _submitReference(),
                  decoration: InputDecoration(
                    hintText: 'Ex: AbCdEf12345',
                    prefixIcon: Icon(Icons.search, size: _ots(18)),
                    filled: true,
                    fillColor: const Color(0xFFF5F5F7),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(_ots(12)),
                      borderSide: BorderSide.none,
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(_ots(12)),
                      borderSide: BorderSide.none,
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(_ots(12)),
                      borderSide: const BorderSide(color: Color(0xFFFF6A00)),
                    ),
                  ),
                ),
              ),
              SizedBox(width: _ots(10)),
              OutlinedButton.icon(
                onPressed: _pasteReference,
                style: OutlinedButton.styleFrom(
                  padding: EdgeInsets.symmetric(horizontal: _ots(14), vertical: _ots(16)),
                  side: BorderSide(color: Colors.grey.shade300),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(_ots(12)),
                  ),
                ),
                icon: Icon(Icons.content_paste_rounded, size: _ots(16), color: Colors.black87),
                label: Text(
                  'Coller',
                  style: TextStyle(
                    color: Colors.black87,
                    fontSize: _ots(12),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: _ots(12)),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: hasReference ? _submitReference : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF6A00),
                foregroundColor: Colors.white,
                disabledBackgroundColor: Colors.grey.shade300,
                padding: EdgeInsets.symmetric(vertical: _ots(15)),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(_ots(12)),
                ),
              ),
              child: Text(
                'Ouvrir le suivi',
                style: TextStyle(
                  fontSize: _ots(14),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrackedOrder() {
    final orderId = _trackedOrderId!;

    return StreamBuilder<OrderModel?>(
      stream: _orderService.watchOrderById(orderId),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return _buildInfoCard(
            icon: Icons.hourglass_top_rounded,
            title: 'Chargement du suivi...',
            subtitle: 'Nous recuperons les informations de votre commande.',
          );
        }

        if (snapshot.hasError) {
          return _buildErrorCard(
            title: 'Erreur de suivi',
            subtitle: snapshot.error.toString(),
          );
        }

        final order = snapshot.data;
        if (order == null) {
          return _buildErrorCard(
            title: 'Commande introuvable',
            subtitle: 'Verifiez la reference saisie puis essayez une autre commande.',
          );
        }

        return _buildOrderDetails(order);
      },
    );
  }

  Widget _buildAccountOrdersSection() {
    return Consumer2<AuthProvider, OrderProvider>(
      builder: (context, authProvider, orderProvider, _) {
        if (!authProvider.isAuthenticated) {
          return _buildInfoCard(
            icon: Icons.person_outline_rounded,
            title: 'Connectez-vous pour voir vos commandes',
            subtitle: 'Les utilisateurs connectes retrouvent ici automatiquement toutes leurs commandes.',
          );
        }

        if (orderProvider.isLoading && orderProvider.orders.isEmpty) {
          return _buildInfoCard(
            icon: Icons.receipt_long_outlined,
            title: 'Chargement de vos commandes...',
            subtitle: 'Nous recuperons l\'historique associe a votre compte.',
          );
        }

        if (orderProvider.error != null && orderProvider.orders.isEmpty) {
          return _buildErrorCard(
            title: 'Impossible de charger vos commandes',
            subtitle: orderProvider.error!,
          );
        }

        if (orderProvider.orders.isEmpty) {
          return _buildInfoCard(
            icon: Icons.shopping_bag_outlined,
            title: 'Aucune commande pour le moment',
            subtitle: 'Dès que vous passez une commande avec ce compte, elle apparait ici automatiquement.',
          );
        }

        return Container(
          width: double.infinity,
          padding: EdgeInsets.all(_ots(18)),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(_ots(18)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: _ots(14),
                offset: Offset(0, _ots(4)),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Mes commandes',
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: _ots(16),
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        SizedBox(height: _ots(4)),
                        Text(
                          'Vos commandes recentes apparaissent ici automatiquement.',
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontSize: _ots(11),
                            height: 1.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                  TextButton(
                    onPressed: () => context.read<OrderProvider>().loadUserOrders(),
                    child: Text(
                      'Actualiser',
                      style: TextStyle(
                        fontSize: _ots(12),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: _ots(14)),
              ..._buildUserOrdersList(orderProvider.orders),
            ],
          ),
        );
      },
    );
  }

  List<Widget> _buildUserOrdersList(List<OrderModel> orders) {
    return [
      for (var index = 0; index < orders.length; index++) ...[
        _buildUserOrderCard(orders[index]),
        if (index < orders.length - 1) SizedBox(height: _ots(10)),
      ],
    ];
  }

  Widget _buildUserOrderCard(OrderModel order) {
    final statusMeta = _statusMeta(order.status);

    return InkWell(
      onTap: () {
        setState(() {
          _trackedOrderId = order.id;
          _referenceController.text = order.id;
        });
      },
      borderRadius: BorderRadius.circular(_ots(14)),
      child: Ink(
        padding: EdgeInsets.all(_ots(14)),
        decoration: BoxDecoration(
          color: const Color(0xFFF8F9FA),
          borderRadius: BorderRadius.circular(_ots(14)),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Commande ${_shortOrderId(order.id)}',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: _ots(13),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(height: _ots(4)),
                      Text(
                        Helpers.formatDate(order.createdAt),
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: _ots(11),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: _ots(10), vertical: _ots(6)),
                  decoration: BoxDecoration(
                    color: statusMeta.background,
                    borderRadius: BorderRadius.circular(_ots(999)),
                  ),
                  child: Text(
                    statusMeta.label,
                    style: TextStyle(
                      color: statusMeta.foreground,
                      fontSize: _ots(10),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: _ots(12)),
            Row(
              children: [
                Expanded(
                  child: _buildOrderCardMeta(
                    icon: Icons.shopping_bag_outlined,
                    text: '${order.totalItems} article(s)',
                  ),
                ),
                Expanded(
                  child: _buildOrderCardMeta(
                    icon: Icons.payments_outlined,
                    text: Helpers.formatPrice(order.totalAmount),
                    alignEnd: true,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderCardMeta({
    required IconData icon,
    required String text,
    bool alignEnd = false,
  }) {
    return Row(
      mainAxisAlignment: alignEnd ? MainAxisAlignment.end : MainAxisAlignment.start,
      children: [
        Icon(icon, size: _ots(14), color: Colors.grey.shade500),
        SizedBox(width: _ots(6)),
        Flexible(
          child: Text(
            text,
            overflow: TextOverflow.ellipsis,
            textAlign: alignEnd ? TextAlign.end : TextAlign.start,
            style: TextStyle(
              color: Colors.grey.shade700,
              fontSize: _ots(11),
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(_ots(18)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_ots(18)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: _ots(14),
            offset: Offset(0, _ots(4)),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: _ots(40),
            height: _ots(40),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF1E8),
              borderRadius: BorderRadius.circular(_ots(12)),
            ),
            child: Icon(icon, color: const Color(0xFFFF6A00), size: _ots(20)),
          ),
          SizedBox(width: _ots(12)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: _ots(14),
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: _ots(4)),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: _ots(12),
                    height: 1.45,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorCard({
    required String title,
    required String subtitle,
  }) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(_ots(18)),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF2F2),
        borderRadius: BorderRadius.circular(_ots(18)),
        border: Border.all(color: const Color(0xFFFFD1D1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.error_outline_rounded, color: AppColors.error, size: _ots(20)),
              SizedBox(width: _ots(8)),
              Text(
                title,
                style: TextStyle(
                  color: const Color(0xFF7A1F1F),
                  fontSize: _ots(14),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          SizedBox(height: _ots(8)),
          Text(
            subtitle,
            style: TextStyle(
              color: const Color(0xFF8D3A3A),
              fontSize: _ots(12),
              height: 1.45,
            ),
          ),
          SizedBox(height: _ots(12)),
          TextButton(
            onPressed: () => setState(() => _trackedOrderId = null),
            child: const Text('Retour au suivi'),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderDetails(OrderModel order) {
    final statusMeta = _statusMeta(order.status);
    final updatedAt = order.updatedAt ?? order.createdAt;

    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: EdgeInsets.all(_ots(18)),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(_ots(18)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: _ots(14),
                offset: Offset(0, _ots(4)),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Reference: ${order.id}',
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: _ots(18),
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        SizedBox(height: _ots(6)),
                        Text(
                          'Mise a jour: ${Helpers.formatDate(updatedAt)}',
                          style: TextStyle(
                            color: Colors.grey.shade600,
                            fontSize: _ots(12),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: _ots(12), vertical: _ots(8)),
                    decoration: BoxDecoration(
                      color: statusMeta.background,
                      borderRadius: BorderRadius.circular(_ots(999)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(statusMeta.icon, size: _ots(14), color: statusMeta.foreground),
                        SizedBox(width: _ots(6)),
                        Text(
                          statusMeta.label,
                          style: TextStyle(
                            color: statusMeta.foreground,
                            fontSize: _ots(11),
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              SizedBox(height: _ots(16)),
              if (order.status == OrderStatus.cancelled)
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(_ots(14)),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF2F2),
                    borderRadius: BorderRadius.circular(_ots(14)),
                    border: Border.all(color: const Color(0xFFFFD1D1)),
                  ),
                  child: Text(
                    'La commande a ete annulee. Contactez-nous sur WhatsApp si vous avez besoin d\'aide.',
                    style: TextStyle(
                      color: const Color(0xFF8D3A3A),
                      fontSize: _ots(12),
                      height: 1.45,
                    ),
                  ),
                )
              else
                Column(
                  children: [
                    _buildStep(
                      label: 'Commande recue',
                      state: _stepState(order.status, OrderStatus.pending),
                    ),
                    SizedBox(height: _ots(8)),
                    _buildStep(
                      label: 'Commande confirmee',
                      state: _stepState(order.status, OrderStatus.processing),
                    ),
                    SizedBox(height: _ots(8)),
                    _buildStep(
                      label: 'Commande expediee',
                      state: _stepState(order.status, OrderStatus.shipped),
                    ),
                    SizedBox(height: _ots(8)),
                    _buildStep(
                      label: 'Commande livree',
                      state: _stepState(order.status, OrderStatus.delivered),
                    ),
                  ],
                ),
            ],
          ),
        ),
        SizedBox(height: _ots(14)),
        _buildOrderSummary(order),
        SizedBox(height: _ots(14)),
        _buildItemsCard(order),
        SizedBox(height: _ots(12)),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: () => setState(() => _trackedOrderId = null),
            style: OutlinedButton.styleFrom(
              padding: EdgeInsets.symmetric(vertical: _ots(14)),
              side: BorderSide(color: Colors.grey.shade300),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(_ots(12)),
              ),
            ),
            child: Text(
              'Suivre une autre commande',
              style: TextStyle(
                color: Colors.black87,
                fontSize: _ots(13),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildOrderSummary(OrderModel order) {
    final address = order.address;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(_ots(18)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_ots(18)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: _ots(14),
            offset: Offset(0, _ots(4)),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _buildMetaBlock(
                  label: 'Client',
                  primary: order.userName.isEmpty ? 'Client Coin Original' : order.userName,
                  secondary: [
                    if (address?.city.trim().isNotEmpty ?? false) address!.city.trim(),
                    if ((address?.phone ?? '').trim().isNotEmpty) address!.phone!.trim(),
                    if (order.userEmail.trim().isNotEmpty) order.userEmail.trim(),
                  ],
                ),
              ),
              SizedBox(width: _ots(12)),
              Expanded(
                child: _buildMetaBlock(
                  label: 'Total',
                  primary: Helpers.formatPrice(order.totalAmount),
                  secondary: [
                    'Paiement a la livraison',
                    'Articles: ${order.totalItems}',
                  ],
                  alignEnd: true,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetaBlock({
    required String label,
    required String primary,
    required List<String> secondary,
    bool alignEnd = false,
  }) {
    return Column(
      crossAxisAlignment: alignEnd ? CrossAxisAlignment.end : CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            color: Colors.grey.shade500,
            fontSize: _ots(10),
            fontWeight: FontWeight.w700,
            letterSpacing: 0.6,
          ),
        ),
        SizedBox(height: _ots(6)),
        Text(
          primary,
          textAlign: alignEnd ? TextAlign.end : TextAlign.start,
          style: TextStyle(
            color: Colors.black,
            fontSize: _ots(16),
            fontWeight: FontWeight.w700,
          ),
        ),
        SizedBox(height: _ots(4)),
        ...secondary.map(
          (line) => Padding(
            padding: EdgeInsets.only(bottom: _ots(2)),
            child: Text(
              line,
              textAlign: alignEnd ? TextAlign.end : TextAlign.start,
              style: TextStyle(
                color: Colors.grey.shade600,
                fontSize: _ots(11),
                height: 1.35,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildItemsCard(OrderModel order) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(_ots(18)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_ots(18)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: _ots(14),
            offset: Offset(0, _ots(4)),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Articles',
            style: TextStyle(
              color: Colors.black,
              fontSize: _ots(15),
              fontWeight: FontWeight.w700,
            ),
          ),
          SizedBox(height: _ots(14)),
          ..._buildItemsList(order.items),
        ],
      ),
    );
  }

  List<Widget> _buildItemsList(List<CartItemModel> items) {
    return [
      for (var index = 0; index < items.length; index++) ...[
        _buildOrderItem(items[index]),
        if (index < items.length - 1)
          Padding(
            padding: EdgeInsets.symmetric(vertical: _ots(12)),
            child: Divider(height: 1, color: Colors.grey.shade200),
          ),
      ],
    ];
  }

  Widget _buildOrderItem(CartItemModel item) {
    final size = _itemSize(item);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(_ots(12)),
          child: Container(
            width: _ots(62),
            height: _ots(62),
            color: const Color(0xFFF5F5F7),
            child: NetworkImageWidget(
              imageUrl: item.product.imageUrl,
              fit: BoxFit.contain,
              width: _ots(62),
              height: _ots(62),
            ),
          ),
        ),
        SizedBox(width: _ots(12)),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                item.product.name,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: Colors.black,
                  fontSize: _ots(13),
                  fontWeight: FontWeight.w600,
                ),
              ),
              SizedBox(height: _ots(4)),
              Text(
                [
                  if ((item.product.brand ?? '').trim().isNotEmpty)
                    item.product.brand!.trim(),
                  if (size.isNotEmpty) 'Taille: $size',
                  'x${item.quantity}',
                ].join(' • '),
                style: TextStyle(
                  color: Colors.grey.shade600,
                  fontSize: _ots(11),
                ),
              ),
            ],
          ),
        ),
        SizedBox(width: _ots(10)),
        Text(
          Helpers.formatPrice(item.totalPrice),
          style: TextStyle(
            color: Colors.black,
            fontSize: _ots(13),
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
    );
  }

  Widget _buildStep({
    required String label,
    required _TrackingStepState state,
  }) {
    late final Color background;
    late final Color border;
    late final Color foreground;
    late final Widget trailing;

    switch (state) {
      case _TrackingStepState.done:
        background = const Color(0xFFFFF8F3);
        border = const Color(0xFFFFD7BF);
        foreground = const Color(0xFFFF6A00);
        trailing = Icon(Icons.check_circle, color: foreground, size: _ots(18));
        break;
      case _TrackingStepState.active:
        background = const Color(0xFFFFF1E8);
        border = const Color(0xFFFF6A00);
        foreground = const Color(0xFFFF6A00);
        trailing = Icon(Icons.local_shipping_outlined, color: foreground, size: _ots(18));
        break;
      case _TrackingStepState.inactive:
        background = Colors.white;
        border = Colors.grey.shade200;
        foreground = Colors.grey.shade500;
        trailing = Container(
          width: _ots(10),
          height: _ots(10),
          decoration: BoxDecoration(
            color: Colors.grey.shade300,
            shape: BoxShape.circle,
          ),
        );
        break;
    }

    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(horizontal: _ots(14), vertical: _ots(12)),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(_ots(14)),
        border: Border.all(color: border),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                color: foreground,
                fontSize: _ots(12),
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          trailing,
        ],
      ),
    );
  }

  _TrackingStepState _stepState(OrderStatus status, OrderStatus step) {
    if (status == OrderStatus.cancelled) return _TrackingStepState.inactive;

    const order = [
      OrderStatus.pending,
      OrderStatus.processing,
      OrderStatus.shipped,
      OrderStatus.delivered,
    ];

    final statusIndex = order.indexOf(status);
    final stepIndex = order.indexOf(step);

    if (statusIndex == -1 || stepIndex == -1) {
      return step == OrderStatus.pending
          ? _TrackingStepState.active
          : _TrackingStepState.inactive;
    }

    if (stepIndex < statusIndex) return _TrackingStepState.done;
    if (stepIndex == statusIndex) return _TrackingStepState.active;
    return _TrackingStepState.inactive;
  }

  _OrderStatusMeta _statusMeta(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return const _OrderStatusMeta(
          label: 'En attente',
          icon: Icons.schedule_rounded,
          background: Color(0xFFFFF3D9),
          foreground: Color(0xFF8A5A00),
        );
      case OrderStatus.processing:
        return const _OrderStatusMeta(
          label: 'Confirmee',
          icon: Icons.inventory_2_outlined,
          background: Color(0xFFFFEEE5),
          foreground: Color(0xFF9C3F00),
        );
      case OrderStatus.shipped:
        return const _OrderStatusMeta(
          label: 'Expediee',
          icon: Icons.local_shipping_outlined,
          background: Color(0xFFE8F1FF),
          foreground: Color(0xFF1D4ED8),
        );
      case OrderStatus.delivered:
        return const _OrderStatusMeta(
          label: 'Livree',
          icon: Icons.check_circle_outline,
          background: Color(0xFFEAF8EE),
          foreground: Color(0xFF15803D),
        );
      case OrderStatus.cancelled:
        return const _OrderStatusMeta(
          label: 'Annulee',
          icon: Icons.cancel_outlined,
          background: Color(0xFFFFF2F2),
          foreground: Color(0xFFB42318),
        );
    }
  }

  String _itemSize(CartItemModel item) {
    if (item.product.variants.isNotEmpty) {
      return item.product.variants.first;
    }
    return '';
  }

  String _shortOrderId(String id) {
    if (id.length <= 8) return '#$id';
    return '#${id.substring(0, 8)}';
  }
}

enum _TrackingStepState {
  inactive,
  active,
  done,
}

class _OrderStatusMeta {
  final String label;
  final IconData icon;
  final Color background;
  final Color foreground;

  const _OrderStatusMeta({
    required this.label,
    required this.icon,
    required this.background,
    required this.foreground,
  });
}
