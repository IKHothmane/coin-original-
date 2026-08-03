import 'dart:async';

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

    Future.microtask(() {
      if (!mounted) return;
      final categoryProvider = context.read<CategoryProvider>();
      final productProvider = context.read<ProductProvider>();

      if (categoryProvider.categories.isEmpty) {
        categoryProvider.loadCategories();
      }
      if (productProvider.products.isEmpty) {
        productProvider.loadCatalogProducts();
      }
      if (productProvider.popularProducts.isEmpty) {
        productProvider.loadPopularProducts();
      }
    });

    Timer(const Duration(milliseconds: 1500), () {
      if (mounted) {
        Navigator.pushReplacementNamed(context, AppRoutes.home);
      }
    });
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
