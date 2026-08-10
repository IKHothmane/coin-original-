import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:coin_original_mobile/utils/routes.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

Future<void> handleAuthSuccess(
  BuildContext context,
  AuthProvider authProvider,
) async {
  if (!context.mounted) return;

  if (authProvider.isAdmin) {
    authProvider.setAdminSessionActive(true);
    Navigator.pushReplacementNamed(context, AppRoutes.admin);
  } else {
    Navigator.pushReplacementNamed(context, AppRoutes.home);
  }
}

void showAuthError(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text(message),
      backgroundColor: Colors.red.shade700,
      behavior: SnackBarBehavior.floating,
      duration: const Duration(seconds: 6),
    ),
  );
}

Future<void> signInWithGoogle(BuildContext context) async {
  final authProvider = context.read<AuthProvider>();
  authProvider.setAdminSessionActive(false);
  final success = await authProvider.signInWithGoogle();
  if (!context.mounted) return;

  if (success) {
    await handleAuthSuccess(context, authProvider);
    return;
  }

  showAuthError(
    context,
    authProvider.error ?? 'Connexion Google impossible',
  );
}

Future<void> signInWithApple(BuildContext context) async {
  final authProvider = context.read<AuthProvider>();
  authProvider.setAdminSessionActive(false);
  final success = await authProvider.signInWithApple();
  if (!context.mounted) return;

  if (success) {
    await handleAuthSuccess(context, authProvider);
    return;
  }

  showAuthError(
    context,
    authProvider.error ?? 'Connexion Apple impossible',
  );
}
