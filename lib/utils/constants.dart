import 'package:flutter/material.dart';

class AppColors {
  // Brand core
  static const Color primary = Color(0xFFFF4500);      // accent orange-red
  static const Color secondary = Color(0xFFFFB300);    // gold
  static const Color accent = Color(0xFFFF4500);

  // Dark backgrounds
  static const Color background = Color(0xFF0A0A0A);
  static const Color surface = Color(0xFF141414);
  static const Color card = Color(0xFF1C1C1C);

  // Status
  static const Color error = Color(0xFFE53935);
  static const Color success = Color(0xFF4CAF50);
  static const Color warning = Color(0xFFFF9800);
  static const Color info = Color(0xFF2196F3);

  // Text
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFF9E9E9E);
  static const Color textHint = Color(0xFF5A5A5A);
  static const Color divider = Color(0xFF2A2A2A);
}

class AppSizes {
  static const double paddingSmall = 8.0;
  static const double paddingMedium = 16.0;
  static const double paddingLarge = 24.0;
  static const double borderRadiusSmall = 8.0;
  static const double borderRadiusMedium = 12.0;
  static const double borderRadiusLarge = 16.0;
  static const double iconSizeSmall = 20.0;
  static const double iconSizeMedium = 24.0;
  static const double iconSizeLarge = 32.0;
}

class AppAssets {
  static const String logo = 'assets/images/logo ligh.jpg';
  static const String homeLogo = 'assets/images/llogo.png';
}

class AppStrings {
  static const String appName = 'Coin Original';
  static const String welcome = 'Bienvenue';
  static const String login = 'Connexion';
  static const String register = 'Inscription';
  static const String email = 'Email';
  static const String password = 'Mot de passe';
  static const String confirmPassword = 'Confirmer le mot de passe';
  static const String name = 'Nom complet';
  static const String phone = 'Téléphone';
  static const String forgotPassword = 'Mot de passe oublié ?';
  static const String noAccount = 'Pas encore de compte ?';
  static const String haveAccount = 'Déjà un compte ?';
  static const String home = 'Accueil';
  static const String search = 'Recherche';
  static const String cart = 'Panier';
  static const String profile = 'Profil';
  static const String categories = 'Catégories';
  static const String products = 'Produits';
  static const String orders = 'Commandes';
  static const String users = 'Utilisateurs';
  static const String dashboard = 'Tableau de bord';
  static const String addToCart = 'Ajouter au panier';
  static const String checkout = 'Passer la commande';
  static const String total = 'Total';
  static const String emptyCart = 'Votre panier est vide';
  static const String emptyOrders = 'Aucune commande';
  static const String emptyProducts = 'Aucun produit';
  static const String save = 'Enregistrer';
  static const String cancel = 'Annuler';
  static const String delete = 'Supprimer';
  static const String edit = 'Modifier';
  static const String add = 'Ajouter';
  static const String logout = 'Déconnexion';
  static const String admin = 'Administration';
  static const String client = 'Client';
}
