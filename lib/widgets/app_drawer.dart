import 'package:flutter/material.dart';
import 'package:coin_original_mobile/utils/constants.dart';

class AppDrawer extends StatelessWidget {
  final String userName;
  final String userEmail;
  final String? userPhotoUrl;
  final bool isAdmin;
  final VoidCallback onLogout;
  final VoidCallback? onProfileTap;
  final VoidCallback? onOrdersTap;
  final VoidCallback? onAdminTap;

  const AppDrawer({
    super.key,
    required this.userName,
    required this.userEmail,
    this.userPhotoUrl,
    this.isAdmin = false,
    required this.onLogout,
    this.onProfileTap,
    this.onOrdersTap,
    this.onAdminTap,
  });

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          UserAccountsDrawerHeader(
            decoration: const BoxDecoration(color: AppColors.primary),
            currentAccountPicture: CircleAvatar(
              backgroundColor: Colors.white,
              backgroundImage: userPhotoUrl != null ? NetworkImage(userPhotoUrl!) : null,
              child: userPhotoUrl == null
                  ? const Icon(Icons.person, size: 40, color: AppColors.primary)
                  : null,
            ),
            accountName: Text(
              userName,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            accountEmail: Text(userEmail),
          ),
          ListTile(
            leading: const Icon(Icons.home_outlined),
            title: const Text('Accueil'),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.person_outline),
            title: const Text('Mon profil'),
            onTap: () {
              Navigator.pop(context);
              onProfileTap?.call();
            },
          ),
          ListTile(
            leading: const Icon(Icons.shopping_bag_outlined),
            title: const Text('Mes commandes'),
            onTap: () {
              Navigator.pop(context);
              onOrdersTap?.call();
            },
          ),
          if (isAdmin) ...[
            const Divider(),
            ListTile(
              leading: const Icon(Icons.admin_panel_settings_outlined, color: AppColors.primary),
              title: const Text('Administration', style: TextStyle(color: AppColors.primary)),
              onTap: () {
                Navigator.pop(context);
                onAdminTap?.call();
              },
            ),
          ],
          const Spacer(),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: AppColors.error),
            title: const Text('Déconnexion', style: TextStyle(color: AppColors.error)),
            onTap: onLogout,
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
