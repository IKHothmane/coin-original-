import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:coin_original_mobile/screens/admin/admin_login_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class AdminAccessGate extends StatelessWidget {
  final Widget child;

  const AdminAccessGate({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return FutureBuilder<void>(
      future: authProvider.initializationComplete,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(
            backgroundColor: Color(0xFFF8F9FA),
            body: Center(
              child: CircularProgressIndicator(
                color: Color(0xFFFF6A00),
              ),
            ),
          );
        }

        if (authProvider.isAdmin) {
          if (!authProvider.isAdminSessionActive) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (context.mounted) {
                context.read<AuthProvider>().setAdminSessionActive(true);
              }
            });
          }
          return child;
        }

        return const AdminLoginScreen();
      },
    );
  }
}
