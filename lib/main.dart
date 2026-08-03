import 'package:flutter/material.dart';
import 'package:coin_original_mobile/config/firebase_config.dart';
import 'package:coin_original_mobile/screens/client/product/product_detail_screen.dart';
import 'package:coin_original_mobile/utils/constants.dart';
import 'package:coin_original_mobile/utils/routes.dart';
import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:coin_original_mobile/providers/category_provider.dart';
import 'package:coin_original_mobile/providers/favorites_provider.dart';
import 'package:coin_original_mobile/providers/product_provider.dart';
import 'package:coin_original_mobile/providers/cart_provider.dart';
import 'package:coin_original_mobile/providers/notifications_provider.dart';
import 'package:coin_original_mobile/providers/order_provider.dart';
import 'package:coin_original_mobile/services/local_notification_service.dart';
import 'package:coin_original_mobile/services/push_notification_service.dart';
import 'package:coin_original_mobile/models/product_model.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await FirebaseConfig.initialize();
  await LocalNotificationService.instance.initialize();
  await PushNotificationService.instance.initialize();
  runApp(const CoinOriginalApp());
}

class CoinOriginalApp extends StatelessWidget {
  const CoinOriginalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CategoryProvider()),
        ChangeNotifierProxyProvider<AuthProvider, FavoritesProvider>(
          create: (_) => FavoritesProvider(),
          update: (_, auth, favoritesProvider) {
            final provider = favoritesProvider ?? FavoritesProvider();
            provider.syncWithAuth(auth.user?.id);
            return provider;
          },
        ),
        ChangeNotifierProvider(create: (_) => ProductProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProxyProvider<AuthProvider, OrderProvider>(
          create: (_) => OrderProvider(),
          update: (_, auth, orderProvider) {
            final provider = orderProvider ?? OrderProvider();
            provider.syncAdminRealtime(
              enabled: auth.isAdmin && auth.isAdminSessionActive,
            );
            return provider;
          },
        ),
        ChangeNotifierProxyProvider<AuthProvider, NotificationsProvider>(
          create: (_) => NotificationsProvider(),
          update: (_, auth, notificationsProvider) {
            final provider = notificationsProvider ?? NotificationsProvider();
            provider.syncWithAuth(
              isAdmin: auth.isAdmin && auth.isAdminSessionActive,
            );
            PushNotificationService.instance.syncWithAuth(
              isAdmin: auth.isAdmin && auth.isAdminSessionActive,
              userId: auth.user?.id,
            );
            return provider;
          },
        ),
      ],
      child: MaterialApp(
        title: AppStrings.appName,
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primaryColor: AppColors.primary,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primary,
            primary: AppColors.primary,
            secondary: AppColors.secondary,
          ),
          scaffoldBackgroundColor: AppColors.background,
          fontFamily: 'Poppins',
          useMaterial3: true,
          appBarTheme: const AppBarTheme(
            centerTitle: true,
            elevation: 0,
            backgroundColor: AppColors.primary,
            foregroundColor: Colors.white,
            titleTextStyle: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.white,
            ),
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              textStyle: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          inputDecorationTheme: InputDecorationTheme(
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.primary, width: 2),
            ),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
        initialRoute: AppRoutes.splash,
        routes: AppRoutes.routes,
        onGenerateRoute: (settings) {
          if (settings.name == '/product-detail') {
            final product = settings.arguments;
            if (product is ProductModel) {
              return MaterialPageRoute(
                builder: (context) => ProductDetailScreen(product: product),
              );
            }
          }
          return null;
        },
      ),
    );
  }
}
