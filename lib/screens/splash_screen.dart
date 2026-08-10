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
    WidgetsBinding.instance.addPostFrameCallback((_) => _bootstrap());
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
        const Duration(seconds: 3),
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
      body: Image.asset(
        'assets/images/splashscreen.png',
        fit: BoxFit.cover,
        width: double.infinity,
        height: double.infinity,
      ),
    );
  }
}
