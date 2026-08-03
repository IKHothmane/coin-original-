import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

const double _kScale = 0.8;
double _s(double value) => value * _kScale;

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notificationsEnabled = true;
  bool _darkModeEnabled = false;
  String _selectedLanguage = 'Francais';

  final List<Map<String, String>> _languages = const [
    {'label': 'Francais', 'code': 'fr'},
    {'label': 'Arabe', 'code': 'ar'},
  ];

  void _showSnackBar(String message) {}

  Future<void> _changePassword() async {
    final authProvider = context.read<AuthProvider>();
    final email = authProvider.user?.email;

    if (email == null || email.isEmpty) {
      _showSnackBar('Aucun email associe a ce compte.');
      return;
    }

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Changer le mot de passe'),
        content: Text(
            'Un email de reinitialisation sera envoye a $email. Continuer ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Annuler'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Envoyer',
                style: TextStyle(color: Color(0xFFFF6A00))),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    try {
      await authProvider.resetPassword(email);
      if (mounted) {
        _showSnackBar('Email de reinitialisation envoye.');
      }
    } catch (e) {
      if (mounted) {
        _showSnackBar('Erreur : ${e.toString()}');
      }
    }
  }

  void _showLanguageDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Choisir la langue'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: _languages.map((lang) {
            final isSelected = lang['label'] == _selectedLanguage;
            return ListTile(
              leading: isSelected
                  ? const Icon(Icons.check_circle, color: Color(0xFFFF6A00))
                  : const Icon(Icons.circle_outlined, color: Colors.grey),
              title: Text(lang['label']!),
              onTap: () {
                setState(() => _selectedLanguage = lang['label']!);
                Navigator.pop(context);
                _showSnackBar('Langue selectionnee : ${lang['label']}');
              },
            );
          }).toList(),
        ),
      ),
    );
  }

  void _showPrivacyPolicy() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Politique de confidentialite'),
        content: const SingleChildScrollView(
          child: Text(
            'Coin Original collecte uniquement les informations necessaires au fonctionnement de l\'application (nom, email, telephone, adresses). '
            'Vos donnees sont stockees de maniere securisee et ne sont pas partagees avec des tiers sans votre consentement. '
            'Vous pouvez demander la suppression de vos donnees en contactant le support.',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  void _showVersionInfo() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('A propos'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Coin Original',
                style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('Version : 1.0.0'),
            SizedBox(height: 8),
            Text('© 2026 Coin Original. Tous droits reserves.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
        title: Text(
          'Parametres',
          style: TextStyle(
            color: Colors.black,
            fontSize: _s(24),
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: ListView(
        padding: EdgeInsets.symmetric(vertical: _s(16)),
        children: [
          _buildSectionTitle('General'),
          _buildTile(
            icon: Icons.notifications_outlined,
            color: const Color(0xFFB4D4FF),
            title: 'Notifications',
            trailing: Switch(
              value: _notificationsEnabled,
              activeColor: const Color(0xFFFF6A00),
              onChanged: (value) {
                setState(() => _notificationsEnabled = value);
                _showSnackBar(
                  value
                      ? 'Notifications activees'
                      : 'Notifications desactivees',
                );
              },
            ),
          ),
          _buildTile(
            icon: Icons.dark_mode_outlined,
            color: const Color(0xFFFFD6B8),
            title: 'Mode sombre',
            trailing: Switch(
              value: _darkModeEnabled,
              activeColor: const Color(0xFFFF6A00),
              onChanged: (value) {
                setState(() => _darkModeEnabled = value);
                _showSnackBar(
                  value ? 'Mode sombre active' : 'Mode sombre desactive',
                );
              },
            ),
          ),
          _buildTile(
            icon: Icons.language_outlined,
            color: const Color(0xFFA2D8A2),
            title: 'Langue',
            subtitle: _selectedLanguage,
            onTap: _showLanguageDialog,
          ),
          _buildSectionTitle('Compte'),
          _buildTile(
            icon: Icons.lock_outline,
            color: const Color(0xFFFFD4B4),
            title: 'Changer le mot de passe',
            onTap: _changePassword,
          ),
          _buildTile(
            icon: Icons.privacy_tip_outlined,
            color: const Color(0xFFB4D4FF),
            title: 'Politique de confidentialite',
            onTap: _showPrivacyPolicy,
          ),
          _buildSectionTitle('A propos'),
          _buildTile(
            icon: Icons.info_outline,
            color: Colors.grey.shade300,
            title: 'Version de l\'application',
            subtitle: '1.0.0',
            onTap: _showVersionInfo,
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: EdgeInsets.fromLTRB(_s(20), _s(16), _s(20), _s(8)),
      child: Text(
        title,
        style: TextStyle(
          fontSize: _s(14),
          fontWeight: FontWeight.w600,
          color: const Color(0xFFFF6A00),
        ),
      ),
    );
  }

  Widget _buildTile({
    required IconData icon,
    required Color color,
    required String title,
    String? subtitle,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return Column(
      children: [
        ListTile(
          contentPadding: EdgeInsets.symmetric(horizontal: _s(20)),
          leading: Container(
            width: _s(44),
            height: _s(44),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(_s(12)),
            ),
            child: Icon(icon, color: Colors.black54, size: _s(22)),
          ),
          title: Text(
            title,
            style: TextStyle(
              fontSize: _s(16),
              fontWeight: FontWeight.w500,
              color: Colors.black,
            ),
          ),
          subtitle: subtitle != null
              ? Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: _s(13),
                    color: Colors.grey.shade600,
                  ),
                )
              : null,
          trailing: trailing ??
              (onTap != null
                  ? Icon(Icons.chevron_right, color: Colors.grey.shade400)
                  : null),
          onTap: onTap,
        ),
        Divider(height: 1, color: Colors.grey.shade100, indent: _s(20)),
      ],
    );
  }
}
