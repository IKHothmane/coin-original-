import 'package:flutter/material.dart';
import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:coin_original_mobile/providers/favorites_provider.dart';
import 'package:coin_original_mobile/providers/order_provider.dart';
import 'package:coin_original_mobile/utils/routes.dart';
import 'package:provider/provider.dart';

const double _kScale = 0.8;
double _s(double value) => value * _kScale;

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _didRequestOrders = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_didRequestOrders) return;

    final authProvider = context.read<AuthProvider>();
    final orderProvider = context.read<OrderProvider>();
    if (authProvider.user != null &&
        orderProvider.orders.isEmpty &&
        !orderProvider.isLoading) {
      _didRequestOrders = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        context.read<OrderProvider>().loadUserOrders();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final favoritesCount = context.watch<FavoritesProvider>().count;
    final user = authProvider.user;

    if (user == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!context.mounted) return;
        Navigator.pushReplacementNamed(context, AppRoutes.login);
      });

      return Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: SizedBox(
            width: _s(28),
            height: _s(28),
            child: CircularProgressIndicator(
              strokeWidth: _s(2.6),
              color: const Color(0xFFFF6A00),
            ),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        title: Text(
          'Profil',
          style: TextStyle(
            color: Colors.black,
            fontSize: _s(24),
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: Colors.black),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildProfileHeader(user),
            SizedBox(height: _s(20)),
            _buildStatsCard(
              ordersCount: context.watch<OrderProvider>().orders.length,
              favoritesCount: favoritesCount,
              addressesCount: user.addresses.length,
            ),
            SizedBox(height: _s(24)),
            _buildMenuList(context, authProvider),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(user) {
    final userName =
        user.name.trim().isEmpty ? 'Client Coin Original' : user.name.trim();
    final userEmail =
        user.email.trim().isEmpty ? 'Aucun email' : user.email.trim();
    final avatarUrl = user.photoUrl;

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: _s(20)),
      child: Row(
        children: [
          CircleAvatar(
            radius: _s(35),
            backgroundColor: const Color(0xFFFFE4D1),
            backgroundImage: avatarUrl != null && avatarUrl.isNotEmpty
                ? NetworkImage(avatarUrl)
                : null,
            child: avatarUrl == null || avatarUrl.isEmpty
                ? Text(
                    userName.isNotEmpty ? userName[0].toUpperCase() : 'C',
                    style: TextStyle(
                      fontSize: _s(24),
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFFFF6A00),
                    ),
                  )
                : null,
          ),
          SizedBox(width: _s(16)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  userName,
                  style: TextStyle(
                    fontSize: _s(20),
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: _s(4)),
                Text(
                  userEmail,
                  style: TextStyle(
                    fontSize: _s(14),
                    color: Colors.grey.shade600,
                  ),
                ),
                if (user.isAdmin) ...[
                  SizedBox(height: _s(8)),
                  _buildAdminBadge(),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAdminBadge() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: _s(12), vertical: _s(6)),
      decoration: BoxDecoration(
        color: const Color(0xFFFFE4D1),
        borderRadius: BorderRadius.circular(_s(20)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.verified_user,
              color: const Color(0xFFFF6A00), size: _s(14)),
          SizedBox(width: _s(4)),
          Text(
            'Compte admin',
            style: TextStyle(
              color: const Color(0xFFFF6A00),
              fontSize: _s(12),
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsCard({
    required int ordersCount,
    required int favoritesCount,
    required int addressesCount,
  }) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: _s(20)),
      padding: EdgeInsets.symmetric(vertical: _s(20)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_s(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: _s(10),
            offset: Offset(0, _s(2)),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildStatItem(ordersCount.toString(), 'commandes'),
          _buildDivider(),
          _buildStatItem(favoritesCount.toString(), 'favoris'),
          _buildDivider(),
          _buildStatItem(addressesCount.toString(), 'adresses'),
        ],
      ),
    );
  }

  Widget _buildStatItem(String count, String label) {
    return Column(
      children: [
        Text(
          count,
          style: TextStyle(
            fontSize: _s(24),
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        SizedBox(height: _s(4)),
        Text(
          label,
          style: TextStyle(
            fontSize: _s(14),
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }

  Widget _buildDivider() {
    return Container(
      height: _s(40),
      width: 1,
      color: Colors.grey.shade200,
    );
  }

  Widget _buildMenuList(BuildContext context, AuthProvider authProvider) {
    final items = [
      MenuItem(
        Icons.local_shipping_outlined,
        'Suivi de commande',
        const Color(0xFFB4D4FF),
        () => Navigator.pushNamed(context, AppRoutes.orderTracking),
      ),
      if (authProvider.isAdmin)
        MenuItem(
          Icons.admin_panel_settings_outlined,
          'Admin Dashboard',
          const Color(0xFFFFD6B8),
          () => Navigator.pushNamed(context, AppRoutes.admin),
        ),
      MenuItem(
        Icons.settings_outlined,
        'Parametres',
        Colors.grey.shade300,
        () => Navigator.pushNamed(context, AppRoutes.settings),
      ),
      MenuItem(
        Icons.help_outline,
        'Aide',
        const Color(0xFFFFD4B4),
        () => Navigator.pushNamed(context, AppRoutes.help),
      ),
      MenuItem(
        Icons.logout,
        'Deconnexion',
        const Color(0xFFFFB4B4),
        () async {
          await authProvider.signOut();
          if (context.mounted) {
            Navigator.pushNamedAndRemoveUntil(
              context,
              AppRoutes.home,
              (route) => false,
            );
          }
        },
        isLogout: true,
      ),
    ];

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: _s(20)),
      child: Column(
        children: items.map((item) => _buildMenuItem(item)).toList(),
      ),
    );
  }

  Widget _buildMenuItem(MenuItem item) {
    return Column(
      children: [
        ListTile(
          contentPadding: EdgeInsets.symmetric(vertical: _s(4)),
          leading: Container(
            width: _s(44),
            height: _s(44),
            decoration: BoxDecoration(
              color: item.bgColor,
              borderRadius: BorderRadius.circular(_s(12)),
            ),
            child: Icon(
              item.icon,
              color: item.isLogout ? Colors.red : Colors.black54,
              size: _s(22),
            ),
          ),
          title: Text(
            item.title,
            style: TextStyle(
              fontSize: _s(16),
              fontWeight: FontWeight.w500,
              color: item.isLogout ? Colors.red : Colors.black,
            ),
          ),
          trailing: Icon(
            Icons.chevron_right,
            color: Colors.grey.shade400,
          ),
          onTap: item.onTap,
        ),
        Divider(height: 1, color: Colors.grey.shade100),
      ],
    );
  }
}

class MenuItem {
  final IconData icon;
  final String title;
  final Color bgColor;
  final VoidCallback onTap;
  final bool isLogout;

  MenuItem(this.icon, this.title, this.bgColor, this.onTap,
      {this.isLogout = false});
}
