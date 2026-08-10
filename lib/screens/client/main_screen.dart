import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:coin_original_mobile/providers/cart_provider.dart';
import 'package:coin_original_mobile/screens/client/category/all_categories_screen.dart';
import 'package:coin_original_mobile/screens/client/cart/cart_screen.dart';
import 'package:coin_original_mobile/screens/client/favorites/favorites_screen.dart';
import 'package:coin_original_mobile/screens/client/home/home_screen.dart';
import 'package:coin_original_mobile/screens/client/profile/profile_screen.dart';
import 'package:coin_original_mobile/utils/routes.dart';
import 'package:coin_original_mobile/widgets/shoebox_navbar.dart';
import 'package:provider/provider.dart';

class MainScreenTabScope extends InheritedWidget {
  const MainScreenTabScope({
    super.key,
    required this.onSelectTab,
    required super.child,
  });

  final ValueChanged<int> onSelectTab;

  static MainScreenTabScope? maybeOf(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<MainScreenTabScope>();
  }

  @override
  bool updateShouldNotify(MainScreenTabScope oldWidget) {
    return onSelectTab != oldWidget.onSelectTab;
  }
}

class MainScreen extends StatefulWidget {
  final int initialTab;
  const MainScreen({super.key, this.initialTab = 0});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  late int _currentIndex = widget.initialTab;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ));
    Future.microtask(() {
      if (!mounted) return;
      Provider.of<CartProvider>(context, listen: false).loadCart();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final screens = <Widget>[
      const HomeScreen(),
      const AllCategoriesScreen(),
      const FavoritesScreen(),
      const CartScreen(),
      authProvider.isAuthenticated ? const ProfileScreen() : const SizedBox.shrink(),
    ];

    return MainScreenTabScope(
      onSelectTab: _selectTab,
      child: Scaffold(
        backgroundColor: const Color(0xFFF5F5F7),
        body: Stack(
          children: [
            Positioned.fill(
              child: IndexedStack(
                index: _currentIndex,
                children: screens,
              ),
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Consumer<CartProvider>(
                builder: (context, cartProvider, child) {
                  return ShoeBoxNavBar(
                    currentIndex: _currentIndex,
                    cartBadge: cartProvider.itemCount,
                    onTap: _selectTab,
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _selectTab(int index) {
    if (index == 4) {
      final authProvider = context.read<AuthProvider>();
      if (!authProvider.isAuthenticated) {
        Navigator.pushNamed(context, AppRoutes.login);
        return;
      }
    }

    setState(() => _currentIndex = index);
  }
}
