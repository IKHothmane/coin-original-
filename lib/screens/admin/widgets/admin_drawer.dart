import 'package:flutter/material.dart';

enum AdminSection {
  dashboard,
  products,
  orders,
  clients,
}

class AdminNavBar extends StatelessWidget {
  final double Function(double) scale;
  final AdminSection currentSection;
  final VoidCallback onDashboard;
  final VoidCallback onProducts;
  final VoidCallback onOrders;
  final VoidCallback onClients;

  const AdminNavBar({
    super.key,
    required this.scale,
    required this.currentSection,
    required this.onDashboard,
    required this.onProducts,
    required this.onOrders,
    required this.onClients,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: EdgeInsets.fromLTRB(
        scale(16),
        scale(10),
        scale(16),
        scale(12),
      ),
      child: Row(
        children: [
          Expanded(
            child: _AdminNavItem(
              icon: Icons.dashboard_outlined,
              title: 'Dashboard',
              scale: scale,
              isActive: currentSection == AdminSection.dashboard,
              onTap: onDashboard,
            ),
          ),
          SizedBox(width: scale(8)),
          Expanded(
            child: _AdminNavItem(
              icon: Icons.inventory_2_outlined,
              title: 'Produits',
              scale: scale,
              isActive: currentSection == AdminSection.products,
              onTap: onProducts,
            ),
          ),
          SizedBox(width: scale(8)),
          Expanded(
            child: _AdminNavItem(
              icon: Icons.receipt_long_outlined,
              title: 'Commandes',
              scale: scale,
              isActive: currentSection == AdminSection.orders,
              onTap: onOrders,
            ),
          ),
          SizedBox(width: scale(8)),
          Expanded(
            child: _AdminNavItem(
              icon: Icons.people_outline,
              title: 'Clients',
              scale: scale,
              isActive: currentSection == AdminSection.clients,
              onTap: onClients,
            ),
          ),
        ],
      ),
    );
  }
}

class _AdminNavItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final double Function(double) scale;
  final bool isActive;
  final VoidCallback onTap;

  const _AdminNavItem({
    required this.icon,
    required this.title,
    required this.scale,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    const activeColor = Color(0xFFFF6A00);

    return Material(
      color: isActive
          ? activeColor.withValues(alpha: 0.12)
          : const Color(0xFFF5F5F7),
      borderRadius: BorderRadius.circular(scale(14)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(scale(14)),
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: scale(8),
            vertical: scale(9),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                color: isActive ? activeColor : const Color(0xFF5F5F5F),
                size: scale(18),
              ),
              SizedBox(width: scale(6)),
              Flexible(
                child: Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: scale(11),
                    fontWeight: FontWeight.w700,
                    fontFamily: 'Poppins',
                    color: isActive ? activeColor : const Color(0xFF171717),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
