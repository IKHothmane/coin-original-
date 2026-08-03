import 'package:coin_original_mobile/models/user_model.dart';
import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:coin_original_mobile/screens/admin/admin_dashboard_screen.dart';
import 'package:coin_original_mobile/screens/admin/orders/orders_screen.dart';
import 'package:coin_original_mobile/screens/admin/products/products_screen.dart';
import 'package:coin_original_mobile/screens/admin/widgets/admin_drawer.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

const double _kScale = 0.8;
double _s(double value) => value * _kScale;

class ClientsScreen extends StatefulWidget {
  const ClientsScreen({super.key});

  @override
  State<ClientsScreen> createState() => _ClientsScreenState();
}

class _ClientsScreenState extends State<ClientsScreen> {
  late Future<List<UserModel>> _clientsFuture;

  @override
  void initState() {
    super.initState();
    _clientsFuture = context.read<AuthProvider>().getClients();
  }

  Future<void> _refresh() async {
    setState(() {
      _clientsFuture = context.read<AuthProvider>().getClients();
    });
  }

  Future<void> _callPhone(String phone) async {
    final uri = Uri(scheme: 'tel', path: phone.trim());
    try {
      final launched = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
      if (launched) {
        return;
      }
    } catch (_) {
      // Fall through to snackbar below.
    }

    if (!mounted) return;
  }

  Future<void> _openWhatsApp(String phone) async {
    final normalizedPhone = _normalizePhoneForWhatsApp(phone);
    final candidates = <Uri>[
      Uri.parse('whatsapp://send?phone=$normalizedPhone'),
      Uri.parse('https://api.whatsapp.com/send?phone=$normalizedPhone'),
      Uri.parse('https://wa.me/$normalizedPhone'),
    ];

    for (final uri in candidates) {
      try {
        final launched = await launchUrl(
          uri,
          mode: LaunchMode.externalApplication,
        );
        if (launched) {
          return;
        }
      } catch (_) {
        // Try the next fallback URI.
      }
    }

    if (!mounted) return;
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        title: Text(
          'Liste des clients',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w700,
            fontFamily: 'Poppins',
            fontSize: _s(20),
          ),
        ),
      ),
      body: Column(
        children: [
          AdminNavBar(
            scale: _s,
            currentSection: AdminSection.clients,
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
            onClients: () {},
          ),
          Expanded(
            child: FutureBuilder<List<UserModel>>(
              future: _clientsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(
                    child: CircularProgressIndicator(color: Color(0xFFFF6A00)),
                  );
                }

                if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      'Erreur : ${snapshot.error}',
                      style: TextStyle(color: Colors.red, fontSize: _s(14)),
                    ),
                  );
                }

                final clients = snapshot.data ?? [];

                if (clients.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.people_outline,
                          size: _s(64),
                          color: Colors.grey.shade400,
                        ),
                        SizedBox(height: _s(16)),
                        Text(
                          'Aucun client trouve',
                          style: TextStyle(
                            fontSize: _s(16),
                            color: Colors.grey.shade600,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  );
                }

                return RefreshIndicator(
                  color: const Color(0xFFFF6A00),
                  backgroundColor: Colors.white,
                  onRefresh: _refresh,
                  child: ListView.builder(
                    padding: EdgeInsets.all(_s(16)),
                    itemCount: clients.length,
                    itemBuilder: (context, index) {
                      final client = clients[index];
                      return _buildClientCard(client);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildClientCard(UserModel client) {
    final dateFormat = DateFormat('dd/MM/yyyy HH:mm', 'fr_FR');
    final isGuest = client.id.startsWith('guest-order-');
    final initials = client.name.trim().isNotEmpty
        ? client.name.trim().substring(0, 1).toUpperCase()
        : 'C';

    return Container(
      margin: EdgeInsets.only(bottom: _s(12)),
      padding: EdgeInsets.all(_s(16)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_s(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: _s(10),
            offset: Offset(0, _s(2)),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: _s(28),
            backgroundColor: const Color(0xFFFFE4D1),
            backgroundImage:
                client.photoUrl != null && client.photoUrl!.isNotEmpty
                    ? NetworkImage(client.photoUrl!)
                    : null,
            child: client.photoUrl == null || client.photoUrl!.isEmpty
                ? Text(
                    initials,
                    style: TextStyle(
                      color: const Color(0xFFFF6A00),
                      fontSize: _s(22),
                      fontWeight: FontWeight.bold,
                    ),
                  )
                : null,
          ),
          SizedBox(width: _s(16)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        client.name.trim().isEmpty
                            ? 'Client sans nom'
                            : client.name.trim(),
                        style: TextStyle(
                          fontSize: _s(16),
                          fontWeight: FontWeight.w700,
                          color: Colors.black87,
                        ),
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(
                          horizontal: _s(8), vertical: _s(4)),
                      decoration: BoxDecoration(
                        color: (isGuest ? Colors.blue : const Color(0xFFFF6A00))
                            .withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(_s(999)),
                      ),
                      child: Text(
                        isGuest ? 'Invite' : 'Compte',
                        style: TextStyle(
                          fontSize: _s(10),
                          fontWeight: FontWeight.w700,
                          color: isGuest
                              ? Colors.blue.shade700
                              : const Color(0xFFFF6A00),
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: _s(4)),
                Text(
                  client.email.trim().isEmpty
                      ? 'Commande sans compte'
                      : client.email,
                  style: TextStyle(
                    fontSize: _s(13),
                    color: Colors.grey.shade600,
                  ),
                ),
                if (client.phone != null && client.phone!.isNotEmpty) ...[
                  SizedBox(height: _s(4)),
                  Row(
                    children: [
                      Expanded(
                        child: InkWell(
                          onTap: () => _callPhone(client.phone!),
                          borderRadius: BorderRadius.circular(_s(8)),
                          child: Padding(
                            padding: EdgeInsets.symmetric(vertical: _s(2)),
                            child: Text(
                              client.phone!,
                              style: TextStyle(
                                fontSize: _s(13),
                                color: const Color(0xFFFF6A00),
                                fontWeight: FontWeight.w600,
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ),
                        ),
                      ),
                      IconButton(
                        tooltip: 'Appeler',
                        onPressed: () => _callPhone(client.phone!),
                        icon: Icon(
                          Icons.phone_outlined,
                          size: _s(18),
                          color: const Color(0xFFFF6A00),
                        ),
                      ),
                      IconButton(
                        tooltip: 'WhatsApp',
                        onPressed: () => _openWhatsApp(client.phone!),
                        icon: Icon(
                          Icons.chat_outlined,
                          size: _s(18),
                          color: const Color(0xFF25D366),
                        ),
                      ),
                    ],
                  ),
                ],
                SizedBox(height: _s(8)),
                Text(
                  'Inscrit le ${dateFormat.format(client.createdAt)}',
                  style: TextStyle(
                    fontSize: _s(12),
                    color: Colors.grey.shade500,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            Icons.chevron_right,
            color: Colors.grey.shade400,
            size: _s(24),
          ),
        ],
      ),
    );
  }
}
