import 'package:coin_original_mobile/providers/category_provider.dart';
import 'package:coin_original_mobile/providers/product_provider.dart';
import 'package:coin_original_mobile/utils/routes.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final categoryProvider = context.read<CategoryProvider>();
    final productProvider = context.read<ProductProvider>();

    final dataFuture = Future.wait([
      if (categoryProvider.categories.isEmpty) categoryProvider.loadCategories(),
      if (productProvider.products.isEmpty) productProvider.loadHomeProducts(),
    ]);

    final splashFuture = Future.delayed(const Duration(milliseconds: 800));

    try {
      await Future.wait([dataFuture, splashFuture]).timeout(
        const Duration(seconds: 5),
      );
    } catch (_) {
      // Timeout: on ouvre quand meme l'accueil.
    }

    if (!mounted) return;
    Navigator.pushReplacementNamed(context, AppRoutes.home);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(
            'assets/images/splashscreen.png',
            fit: BoxFit.cover,
          ),
          Center(
            child: Image.asset(
              'assets/images/llogo.png',
              width: 280,
              fit: BoxFit.contain,
            ),
          ),
        ],
      ),
    );
  }
}
