import 'package:flutter/material.dart';
import 'package:coin_original_mobile/screens/splash_screen.dart';
import 'package:coin_original_mobile/screens/client/auth/login_screen.dart';
import 'package:coin_original_mobile/screens/client/auth/register_screen.dart';
import 'package:coin_original_mobile/screens/client/main_screen.dart';
import 'package:coin_original_mobile/screens/client/cart/cart_screen.dart';
import 'package:coin_original_mobile/screens/client/checkout/checkout_screen.dart';
import 'package:coin_original_mobile/screens/client/profile/profile_screen.dart';
import 'package:coin_original_mobile/screens/client/profile/edit_profile_screen.dart';
import 'package:coin_original_mobile/screens/client/profile/addresses_screen.dart';
import 'package:coin_original_mobile/screens/client/profile/order_tracking_screen.dart';
import 'package:coin_original_mobile/screens/client/profile/settings_screen.dart';
import 'package:coin_original_mobile/screens/client/profile/help_screen.dart';
import 'package:coin_original_mobile/screens/admin/admin_access_gate.dart';
import 'package:coin_original_mobile/screens/admin/admin_dashboard_screen.dart';
import 'package:coin_original_mobile/screens/admin/products/products_screen.dart';
import 'package:coin_original_mobile/screens/admin/orders/orders_screen.dart';
import 'package:coin_original_mobile/screens/admin/clients/clients_screen.dart';

class AppRoutes {
  static const String splash = '/splash';
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  static const String cart = '/cart';
  static const String checkout = '/checkout';
  static const String profile = '/profile';
  static const String editProfile = '/edit-profile';
  static const String addresses = '/addresses';
  static const String orderTracking = '/order-tracking';
  static const String settings = '/settings';
  static const String help = '/help';
  static const String admin = '/admin';
  static const String adminDashboard = '/admin-dashboard';
  static const String adminProducts = '/admin-products';
  static const String adminOrders = '/admin-orders';
  static const String adminClients = '/admin-clients';

  static Map<String, WidgetBuilder> get routes => {
    splash: (context) => const SplashScreen(),
    login: (context) => const LoginScreen(),
    register: (context) => const RegisterScreen(),
    home: (context) {
      final args = ModalRoute.of(context)!.settings.arguments;
      final initialTab = args is Map ? args['initialTab'] as int? : null;
      return MainScreen(initialTab: initialTab ?? 0);
    },
    cart: (context) => const CartScreen(),
    checkout: (context) => const CheckoutScreen(),
    profile: (context) => const ProfileScreen(),
    editProfile: (context) => const EditProfileScreen(),
    addresses: (context) => const AddressesScreen(),
    orderTracking: (context) {
      final args = ModalRoute.of(context)?.settings.arguments;
      final initialOrderId = args is Map ? args['orderId'] as String? : args as String?;
      return OrderTrackingScreen(initialOrderId: initialOrderId);
    },
    settings: (context) => const SettingsScreen(),
    help: (context) => const HelpScreen(),
    admin: (context) => const AdminAccessGate(child: AdminDashboardScreen()),
    adminDashboard: (context) => const AdminAccessGate(child: AdminDashboardScreen()),
    adminProducts: (context) => const AdminAccessGate(child: ProductsScreen()),
    adminOrders: (context) => const AdminAccessGate(child: OrdersScreen()),
    adminClients: (context) => const AdminAccessGate(child: ClientsScreen()),
  };
}
