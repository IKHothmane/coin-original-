import 'package:coin_original_mobile/models/cart_item_model.dart';
import 'package:coin_original_mobile/models/order_model.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:coin_original_mobile/providers/notifications_provider.dart';
import 'package:coin_original_mobile/providers/order_provider.dart';
import 'package:coin_original_mobile/screens/admin/admin_dashboard_screen.dart';
import 'package:coin_original_mobile/screens/admin/products/products_screen.dart';
import 'package:coin_original_mobile/screens/admin/widgets/admin_drawer.dart';
import 'package:coin_original_mobile/screens/admin/clients/clients_screen.dart';
import 'package:coin_original_mobile/utils/enums.dart';
import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

const double _kScale = 0.8;
double _s(double value) => value * _kScale;

Future<void> launchWhatsAppForOrderStatus(
  BuildContext context,
  OrderModel order,
  OrderStatus status,
) async {
  final phone = order.address?.phone;
  if (phone == null || phone.trim().isEmpty) {
    return;
  }

  final orderIdRaw = order.id;
  final orderIdNormalized = orderIdRaw.toUpperCase();
  final orderLabel = orderIdNormalized.length > 8
      ? orderIdNormalized.substring(0, 8)
      : orderIdNormalized;
  final trackingUrl =
      'https://coinoriginal.shop/suivi?id=${Uri.encodeComponent(orderIdRaw)}';

  String message;
  switch (status) {
    case OrderStatus.processing:
      message = 'Bonjour ${order.userName},\n\n'
          'Votre commande #$orderLabel d\'un montant de ${order.totalAmount.toStringAsFixed(0)} DH a été confirmée ✅\n\n'
          'Nous préparons votre colis et vous contacterons pour la livraison.\n\n'
          'Suivre ma commande :\n$trackingUrl\n\n'
          'Merci pour votre confiance !';
      break;
    case OrderStatus.shipped:
      message = 'Bonjour ${order.userName},\n\n'
          'Votre commande #$orderLabel a été expédiée 🚚\n\n'
          'Elle arrivera bientôt à l\'adresse indiquée.\n\n'
          'Suivre ma commande :\n$trackingUrl\n\n'
          'Merci pour votre confiance !';
      break;
    case OrderStatus.delivered:
      message = 'Bonjour ${order.userName},\n\n'
          'Votre commande #$orderLabel a été livrée 📦✅\n\n'
          'Suivre ma commande :\n$trackingUrl\n\n'
          'Nous espérons que vous êtes satisfait. Merci pour votre confiance !';
      break;
    case OrderStatus.cancelled:
      message = 'Bonjour ${order.userName},\n\n'
          'Votre commande #$orderLabel a été annulée ❌\n\n'
          'Détails de la commande :\n$trackingUrl\n\n'
          'Contactez-nous pour plus d\'informations.\n\n'
          'Merci de votre compréhension.';
      break;
    case OrderStatus.pending:
      return;
  }

  final normalizedPhone = _normalizePhoneForWhatsApp(phone);
  final encodedMessage = Uri.encodeComponent(message);
  final candidates = <Uri>[
    Uri.parse(
      'whatsapp://send?phone=$normalizedPhone&text=$encodedMessage',
    ),
    Uri.parse(
      'https://api.whatsapp.com/send?phone=$normalizedPhone&text=$encodedMessage',
    ),
    Uri.parse('https://wa.me/$normalizedPhone?text=$encodedMessage'),
  ];

  try {
    for (final uri in candidates) {
      final launched = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
      if (launched) {
        return;
      }
    }

    if (!context.mounted) return;
  } catch (e) {
    if (!context.mounted) return;
  }
}

String _normalizePhoneForWhatsApp(String phone) {
  final digits = phone.replaceAll(RegExp(r'[^0-9+]'), '');
  if (digits.startsWith('+')) {
    return digits.substring(1);
  }
  if (digits.startsWith('0')) {
    return '212${digits.substring(1)}';
  }
  return digits;
}

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  final Future<void> _localeFuture = initializeDateFormatting('fr_FR', null);

  final List<String> _statusFilters = const [
    'Tous',
    'En attente',
    'En cours',
    'Expédiée',
    'Livrée',
    'Annulée',
  ];

  String _selectedStatus = 'Tous';
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _statusFilters.length, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<OrderProvider>().ensureAdminRealtime();
      context.read<NotificationsProvider>().ensureAdminListening();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<void>(
      future: _localeFuture,
      builder: (context, snapshot) {
        final localeReady = snapshot.connectionState == ConnectionState.done;
        return Consumer<OrderProvider>(
          builder: (context, orderProvider, child) {
            final filteredOrders = _filteredOrders(orderProvider.allOrders);
            final totalRevenue = orderProvider.allOrders.fold<double>(
              0,
              (sum, order) => sum + order.totalAmount,
            );
            final averageBasket = orderProvider.allOrders.isEmpty
                ? 0.0
                : totalRevenue / orderProvider.allOrders.length;

            return Scaffold(
              backgroundColor: const Color(0xFFF8F9FA),
              appBar: AppBar(
                backgroundColor: Colors.white,
                surfaceTintColor: Colors.white,
                elevation: 0,
                title: Text(
                  'Commandes',
                  style: TextStyle(
                    color: Colors.black87,
                    fontWeight: FontWeight.w700,
                    fontFamily: 'Poppins',
                    fontSize: _s(20),
                  ),
                ),
                bottom: PreferredSize(
                  preferredSize: Size.fromHeight(_s(194)),
                  child: Column(
                    children: [
                      Container(
                        color: Colors.white,
                        padding: EdgeInsets.symmetric(
                          horizontal: _s(16),
                          vertical: _s(12),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _StatItem(
                              label: 'Aujourd\'hui',
                              value: '${orderProvider.allOrders.length}',
                              color: const Color(0xFFFF6A00),
                            ),
                            _StatItem(
                              label: 'CA Total',
                              value: '${totalRevenue.toStringAsFixed(0)} DH',
                              color: Colors.green,
                            ),
                            _StatItem(
                              label: 'Panier moyen',
                              value: '${averageBasket.toStringAsFixed(0)} DH',
                              color: Colors.blue,
                            ),
                          ],
                        ),
                      ),
                      Container(
                        color: Colors.white,
                        padding: EdgeInsets.fromLTRB(_s(16), 0, _s(16), _s(12)),
                        child: TextField(
                          controller: _searchController,
                          onChanged: (value) =>
                              setState(() => _searchQuery = value.trim()),
                          decoration: InputDecoration(
                            hintText: 'Rechercher N° commande, client...',
                            hintStyle: TextStyle(
                              fontSize: _s(12),
                              fontFamily: 'Poppins',
                            ),
                            prefixIcon: const Icon(
                              Icons.search,
                              color: Color(0xFFFF6A00),
                            ),
                            filled: true,
                            fillColor: const Color(0xFFF5F5F7),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(_s(12)),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),
                      ),
                      Container(
                        alignment: Alignment.centerLeft,
                        color: Colors.white,
                        child: TabBar(
                          controller: _tabController,
                          isScrollable: true,
                          labelColor: const Color(0xFFFF6A00),
                          unselectedLabelColor: Colors.grey,
                          indicatorColor: const Color(0xFFFF6A00),
                          labelStyle: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: _s(13),
                            fontFamily: 'Poppins',
                          ),
                          tabs: _statusFilters
                              .map((status) => Tab(text: status))
                              .toList(),
                          onTap: (index) => setState(
                            () => _selectedStatus = _statusFilters[index],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              body: Column(
                children: [
                  AdminNavBar(
                    scale: _s,
                    currentSection: AdminSection.orders,
                    onDashboard: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const AdminDashboardScreen(),
                        ),
                      );
                    },
                    onProducts: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const ProductsScreen(),
                        ),
                      );
                    },
                    onOrders: () {},
                    onClients: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (_) => const ClientsScreen(),
                        ),
                      );
                    },
                  ),
                  Expanded(
                    child: orderProvider.isLoading &&
                            orderProvider.allOrders.isEmpty
                        ? const Center(child: CircularProgressIndicator())
                        : filteredOrders.isEmpty
                            ? _EmptyOrdersState(
                                searchQuery: _searchQuery,
                                error: orderProvider.error,
                              )
                            : ListView.builder(
                                padding: EdgeInsets.all(_s(16)),
                                itemCount: filteredOrders.length,
                                itemBuilder: (context, index) {
                                  final order = filteredOrders[index];
                                  return _OrderCard(
                                    order: order,
                                    localeReady: localeReady,
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => OrderDetailScreen(
                                            order: order,
                                            localeReady: localeReady,
                                          ),
                                        ),
                                      );
                                    },
                                    onChangeStatus: (status) async {
                                      final success = await context
                                          .read<OrderProvider>()
                                          .updateOrderStatus(order.id, status);
                                      if (!context.mounted) return;
                                      if (success) {
                                        await launchWhatsAppForOrderStatus(
                                          context,
                                          order,
                                          status,
                                        );
                                      }
                                    },
                                  );
                                },
                              ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  List<OrderModel> _filteredOrders(List<OrderModel> orders) {
    final status = _selectedStatus;
    final filteredByStatus = status == 'Tous'
        ? List<OrderModel>.from(orders)
        : orders.where((order) => order.status.label == status).toList();

    if (_searchQuery.isEmpty) {
      filteredByStatus.sort(_compareOrdersByCreatedAtDesc);
      return filteredByStatus;
    }

    final query = _searchQuery.toLowerCase();
    final filteredBySearch = filteredByStatus.where((order) {
      final orderLabel = order.id.length > 8
          ? order.id.substring(0, 8).toLowerCase()
          : order.id;
      return orderLabel.contains(query) ||
          order.userName.toLowerCase().contains(query) ||
          order.userEmail.toLowerCase().contains(query);
    }).toList();

    filteredBySearch.sort(_compareOrdersByCreatedAtDesc);
    return filteredBySearch;
  }
}

int _compareOrdersByCreatedAtDesc(OrderModel a, OrderModel b) {
  final dateComparison = b.createdAt.compareTo(a.createdAt);
  if (dateComparison != 0) return dateComparison;
  return b.id.compareTo(a.id);
}

class OrderDetailScreen extends StatelessWidget {
  final OrderModel order;
  final bool localeReady;

  const OrderDetailScreen({
    super.key,
    required this.order,
    required this.localeReady,
  });

  @override
  Widget build(BuildContext context) {
    final dateText = localeReady
        ? DateFormat('dd MMMM yyyy, HH:mm', 'fr_FR').format(order.createdAt)
        : DateFormat('dd/MM/yyyy HH:mm').format(order.createdAt);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        title: Text(
          'Commande #${order.id.length > 8 ? order.id.substring(0, 8).toUpperCase() : order.id}',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w700,
            fontFamily: 'Poppins',
            fontSize: _s(18),
          ),
        ),
      ),
      body: Column(
        children: [
          AdminNavBar(
            scale: _s,
            currentSection: AdminSection.orders,
            onDashboard: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (_) => const AdminDashboardScreen(),
                ),
              );
            },
            onProducts: () {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (_) => const ProductsScreen(),
                ),
              );
            },
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
          Expanded(
            child: ListView(
              padding: EdgeInsets.all(_s(16)),
              children: [
                _DetailSection(
                  title: 'Client',
                  children: [
                    _DetailRow(label: 'Nom', value: order.userName),
                    _DetailRow(label: 'Email', value: order.userEmail),
                    _DetailRow(
                      label: 'Telephone',
                      value: order.address?.phone ?? '-',
                    ),
                    _DetailRow(
                      label: 'Adresse',
                      value: _formatAddress(order),
                    ),
                    _DetailRow(label: 'Date', value: dateText),
                    _DetailRow(
                      label: 'Paiement',
                      value: _paymentLabel(order.paymentMethod),
                    ),
                    _DetailRow(label: 'Statut', value: order.status.label),
                  ],
                ),
                _DetailSection(
                  title: 'Articles',
                  children: order.items
                      .map(
                        (item) => Padding(
                          padding: EdgeInsets.only(bottom: _s(12)),
                          child: _OrderItemRow(item: item),
                        ),
                      )
                      .toList(),
                ),
                _DetailSection(
                  title: 'Résumé',
                  children: [
                    _DetailRow(
                      label: 'Sous-total',
                      value: '${order.totalAmount.toStringAsFixed(0)} DH',
                    ),
                    const _DetailRow(label: 'Livraison', value: '0 DH'),
                    _DetailRow(
                      label: 'Total',
                      value: '${order.totalAmount.toStringAsFixed(0)} DH',
                      isHighlighted: true,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatAddress(OrderModel order) {
    final address = order.address;
    if (address == null) return '-';
    return '${address.street}, ${address.city} ${address.postalCode}'.trim();
  }

  String _paymentLabel(String? paymentMethod) {
    switch (paymentMethod) {
      case 'cash':
        return 'Paiement a la livraison';
      case 'card':
        return 'Carte bancaire';
      default:
        return paymentMethod ?? '-';
    }
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatItem({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: _s(15),
            fontWeight: FontWeight.w700,
            color: color,
            fontFamily: 'Poppins',
          ),
        ),
        SizedBox(height: _s(2)),
        Text(
          label,
          style: TextStyle(
            fontSize: _s(11),
            color: Colors.grey[600],
            fontFamily: 'Poppins',
          ),
        ),
      ],
    );
  }
}

class _OrderCard extends StatelessWidget {
  final OrderModel order;
  final bool localeReady;
  final VoidCallback onTap;
  final ValueChanged<OrderStatus> onChangeStatus;

  const _OrderCard({
    required this.order,
    required this.localeReady,
    required this.onTap,
    required this.onChangeStatus,
  });

  @override
  Widget build(BuildContext context) {
    final statusColor = order.status.color;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: EdgeInsets.only(bottom: _s(12)),
        padding: EdgeInsets.all(_s(16)),
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
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Commande #${order.id.length > 8 ? order.id.substring(0, 8).toUpperCase() : order.id}',
                  style: TextStyle(
                    fontWeight: FontWeight.w700,
                    fontSize: _s(15),
                    fontFamily: 'Poppins',
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: _s(10),
                    vertical: _s(4),
                  ),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(_s(20)),
                  ),
                  child: Text(
                    order.status.label,
                    style: TextStyle(
                      fontSize: _s(11),
                      color: statusColor,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Poppins',
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: _s(12)),
            Row(
              children: [
                Icon(Icons.person_outline, size: _s(16), color: Colors.grey),
                SizedBox(width: _s(6)),
                Expanded(
                  child: Text(
                    order.userName,
                    style: TextStyle(
                      fontSize: _s(13),
                      fontFamily: 'Poppins',
                    ),
                  ),
                ),
                Text(
                  '${order.totalAmount.toStringAsFixed(0)} DH',
                  style: TextStyle(
                    fontSize: _s(16),
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFFFF6A00),
                    fontFamily: 'Poppins',
                  ),
                ),
              ],
            ),
            SizedBox(height: _s(8)),
            Row(
              children: [
                Icon(
                  Icons.shopping_bag_outlined,
                  size: _s(16),
                  color: Colors.grey,
                ),
                SizedBox(width: _s(6)),
                Text(
                  '${order.totalItems} article(s)',
                  style: TextStyle(
                    fontSize: _s(12),
                    color: Colors.grey[600],
                    fontFamily: 'Poppins',
                  ),
                ),
                const Spacer(),
                Text(
                  _formatDate(order.createdAt, localeReady),
                  style: TextStyle(
                    fontSize: _s(11),
                    color: Colors.grey[500],
                    fontFamily: 'Poppins',
                  ),
                ),
              ],
            ),
            SizedBox(height: _s(12)),
            Wrap(
              spacing: _s(8),
              runSpacing: _s(8),
              children: _buildActions(context),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildActions(BuildContext context) {
    switch (order.status) {
      case OrderStatus.pending:
        return [
          _ActionBtn(
            label: 'Confirmer',
            color: Colors.blue,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ConfirmOrderScreen(order: order),
                ),
              );
            },
          ),
          _ActionBtn(
            label: 'Annuler',
            color: Colors.red,
            onTap: () => onChangeStatus(OrderStatus.cancelled),
          ),
        ];
      case OrderStatus.processing:
        return [
          _ActionBtn(
            label: 'Expedier',
            color: Colors.purple,
            onTap: () => onChangeStatus(OrderStatus.shipped),
          ),
          _ActionBtn(
            label: 'Annuler',
            color: Colors.red,
            onTap: () => onChangeStatus(OrderStatus.cancelled),
          ),
        ];
      case OrderStatus.shipped:
        return [
          _ActionBtn(
            label: 'Marquer livree',
            color: Colors.green,
            onTap: () => onChangeStatus(OrderStatus.delivered),
          ),
        ];
      case OrderStatus.delivered:
      case OrderStatus.cancelled:
        return const [];
    }
  }

  String _formatDate(DateTime value, bool localeReady) {
    if (localeReady) {
      return DateFormat('dd MMM, HH:mm', 'fr_FR').format(value);
    }
    return DateFormat('dd/MM HH:mm').format(value);
  }
}

class ConfirmOrderScreen extends StatefulWidget {
  final OrderModel order;

  const ConfirmOrderScreen({
    super.key,
    required this.order,
  });

  @override
  State<ConfirmOrderScreen> createState() => _ConfirmOrderScreenState();
}

class _ConfirmOrderScreenState extends State<ConfirmOrderScreen> {
  bool _isSubmitting = false;

  Future<void> _confirmOrder() async {
    setState(() => _isSubmitting = true);

    final success = await context
        .read<OrderProvider>()
        .updateOrderStatus(widget.order.id, OrderStatus.processing);

    if (!mounted) return;

    setState(() => _isSubmitting = false);

    if (success) {
      await launchWhatsAppForOrderStatus(
        context,
        widget.order,
        OrderStatus.processing,
      );
      if (!mounted) return;
      Navigator.pop(context);
      return;
    }
  }

  @override
  Widget build(BuildContext context) {
    final order = widget.order;
    final orderLabel =
        order.id.length > 8 ? order.id.substring(0, 8).toUpperCase() : order.id;
    final dateText = DateFormat('dd MMMM yyyy, HH:mm', 'fr_FR').format(
      order.createdAt,
    );

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        title: Text(
          'Confirmer #$orderLabel',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w700,
            fontFamily: 'Poppins',
            fontSize: _s(18),
          ),
        ),
      ),
      body: ListView(
        padding: EdgeInsets.all(_s(16)),
        children: [
          _DetailSection(
            title: 'Validation commande',
            children: [
              _DetailRow(label: 'Client', value: order.userName),
              _DetailRow(label: 'Email', value: order.userEmail),
              _DetailRow(
                  label: 'Téléphone', value: order.address?.phone ?? '-'),
              _DetailRow(
                label: 'Adresse',
                value: order.address == null
                    ? '-'
                    : '${order.address!.street}, ${order.address!.city}',
              ),
              _DetailRow(label: 'Date', value: dateText),
              _DetailRow(label: 'Statut actuel', value: order.status.label),
            ],
          ),
          _DetailSection(
            title: 'Articles',
            children: order.items
                .map(
                  (item) => Padding(
                    padding: EdgeInsets.only(bottom: _s(12)),
                    child: _OrderItemRow(item: item),
                  ),
                )
                .toList(),
          ),
          _DetailSection(
            title: 'Résumé',
            children: [
              _DetailRow(
                label: 'Sous-total',
                value: '${order.totalAmount.toStringAsFixed(0)} DH',
              ),
              const _DetailRow(label: 'Livraison', value: '0 DH'),
              _DetailRow(
                label: 'Total',
                value: '${order.totalAmount.toStringAsFixed(0)} DH',
                isHighlighted: true,
              ),
            ],
          ),
          SizedBox(height: _s(8)),
          SizedBox(
            height: _s(44),
            width: double.infinity,
            child: Material(
              color: Colors.transparent,
              child: Ink(
                decoration: BoxDecoration(
                  color: const Color(0xFFFF6A00),
                  borderRadius: BorderRadius.circular(_s(12)),
                ),
                child: InkWell(
                  borderRadius: BorderRadius.circular(_s(12)),
                  onTap: _isSubmitting ? null : _confirmOrder,
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: _s(12)),
                    child: Row(
                      children: [
                        SizedBox(
                          width: _s(18),
                          height: _s(18),
                          child: _isSubmitting
                              ? const CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    Colors.white,
                                  ),
                                )
                              : null,
                        ),
                        Expanded(
                          child: Text(
                            'Confirmer maintenant',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: _s(13),
                              fontWeight: FontWeight.w700,
                              fontFamily: 'Poppins',
                              color: Colors.white,
                            ),
                          ),
                        ),
                        SizedBox(width: _s(18)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          SizedBox(height: _s(8)),
          TextButton(
            onPressed: _isSubmitting ? null : () => Navigator.pop(context),
            child: Text(
              'Annuler',
              style: TextStyle(
                fontSize: _s(12),
                color: Colors.grey[700],
                fontWeight: FontWeight.w600,
                fontFamily: 'Poppins',
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionBtn extends StatelessWidget {
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionBtn({
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: onTap,
      style: OutlinedButton.styleFrom(
        side: BorderSide(color: color),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(_s(8)),
        ),
        padding: EdgeInsets.symmetric(
          horizontal: _s(12),
          vertical: _s(8),
        ),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: _s(12),
          color: color,
          fontWeight: FontWeight.w600,
          fontFamily: 'Poppins',
        ),
      ),
    );
  }
}

class _OrderItemRow extends StatelessWidget {
  final CartItemModel item;

  const _OrderItemRow({required this.item});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        NetworkImageWidget(
          imageUrl: item.product.images.isNotEmpty
              ? item.product.images.first
              : item.product.image ?? '',
          width: _s(54),
          height: _s(54),
          fit: BoxFit.cover,
          borderRadius: BorderRadius.circular(_s(10)),
          placeholder: Container(
            width: _s(54),
            height: _s(54),
            color: const Color(0xFFF1F1F1),
            alignment: Alignment.center,
            child: Icon(
              Icons.inventory_2_outlined,
              size: _s(18),
              color: Colors.grey,
            ),
          ),
          errorWidget: Container(
            width: _s(54),
            height: _s(54),
            color: const Color(0xFFF1F1F1),
            alignment: Alignment.center,
            child: Icon(
              Icons.inventory_2_outlined,
              size: _s(18),
              color: Colors.grey,
            ),
          ),
        ),
        SizedBox(width: _s(12)),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                item.product.name,
                style: TextStyle(
                  fontSize: _s(13),
                  fontWeight: FontWeight.w600,
                  fontFamily: 'Poppins',
                ),
              ),
              SizedBox(height: _s(4)),
              Text(
                '${item.quantity} x ${item.product.price.toStringAsFixed(0)} DH',
                style: TextStyle(
                  fontSize: _s(12),
                  color: Colors.grey[600],
                  fontFamily: 'Poppins',
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _DetailSection extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _DetailSection({
    required this.title,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: _s(12)),
      padding: EdgeInsets.all(_s(14)),
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: _s(15),
              fontWeight: FontWeight.w700,
              fontFamily: 'Poppins',
            ),
          ),
          SizedBox(height: _s(12)),
          ...children,
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isHighlighted;

  const _DetailRow({
    required this.label,
    required this.value,
    this.isHighlighted = false,
  });

  @override
  Widget build(BuildContext context) {
    final valueColor =
        isHighlighted ? const Color(0xFFFF6A00) : const Color(0xFF171717);
    final valueWeight = isHighlighted ? FontWeight.w700 : FontWeight.w500;

    return Padding(
      padding: EdgeInsets.only(bottom: _s(8)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: _s(90),
            child: Text(
              label,
              style: TextStyle(
                fontSize: _s(12),
                color: Colors.grey[600],
                fontFamily: 'Poppins',
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontSize: _s(12),
                color: valueColor,
                fontWeight: valueWeight,
                fontFamily: 'Poppins',
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyOrdersState extends StatelessWidget {
  final String searchQuery;
  final String? error;

  const _EmptyOrdersState({
    required this.searchQuery,
    this.error,
  });

  @override
  Widget build(BuildContext context) {
    final message = searchQuery.isEmpty
        ? 'Aucune commande pour le moment'
        : 'Aucune commande ne correspond a votre recherche';

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.receipt_long_outlined,
            size: _s(44),
            color: Colors.grey[400],
          ),
          SizedBox(height: _s(12)),
          Text(
            message,
            style: TextStyle(
              fontSize: _s(13),
              color: Colors.grey[700],
              fontFamily: 'Poppins',
            ),
          ),
          if (error != null && error!.trim().isNotEmpty) ...[
            SizedBox(height: _s(10)),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: _s(20)),
              child: Text(
                error!,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: _s(11),
                  color: Colors.red[600],
                  fontFamily: 'Poppins',
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
