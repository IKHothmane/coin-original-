import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:coin_original_mobile/screens/admin/orders/orders_screen.dart';
import 'package:coin_original_mobile/screens/admin/products/products_screen.dart';
import 'package:coin_original_mobile/screens/admin/clients/clients_screen.dart';
import 'package:coin_original_mobile/screens/admin/widgets/admin_drawer.dart';
import 'package:coin_original_mobile/providers/notifications_provider.dart';
import 'package:coin_original_mobile/providers/order_provider.dart';

const double _kScale = 0.8;
double _s(double value) => value * _kScale;

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  late final Future<void> _dateLocaleFuture;

  @override
  void initState() {
    super.initState();
    _dateLocaleFuture = initializeDateFormatting('fr_FR', null);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      context.read<OrderProvider>().ensureAdminRealtime();
      context.read<NotificationsProvider>().ensureAdminListening();
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<void>(
      future: _dateLocaleFuture,
      builder: (context, snapshot) {
        final now = DateTime.now();
        final dayLabel = snapshot.connectionState == ConnectionState.done
            ? DateFormat('dd MMMM yyyy', 'fr_FR').format(now)
            : DateFormat('dd/MM/yyyy').format(now);
        final syncLabel = snapshot.connectionState == ConnectionState.done
            ? DateFormat('dd/MM/yyyy HH:mm', 'fr_FR').format(now)
            : DateFormat('dd/MM/yyyy HH:mm').format(now);

        return Scaffold(
          backgroundColor: const Color(0xFFF8F9FA),
          appBar: AppBar(
            backgroundColor: Colors.white,
            surfaceTintColor: Colors.white,
            elevation: 0,
            title: Text(
              'Admin Dashboard',
              style: TextStyle(
                color: Colors.black87,
                fontSize: _s(20),
                fontWeight: FontWeight.w700,
                fontFamily: 'Poppins',
              ),
            ),
          ),
          body: Column(
            children: [
              AdminNavBar(
                scale: _s,
                currentSection: AdminSection.dashboard,
                onDashboard: () {},
                onProducts: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ProductsScreen(),
                    ),
                  );
                },
                onOrders: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const OrdersScreen(),
                    ),
                  );
                },
                onClients: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ClientsScreen(),
                    ),
                  );
                },
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.all(_s(16)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                Text(
                  'Coin Original',
                  style: TextStyle(
                    fontSize: _s(24),
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Poppins',
                    color: const Color(0xFF171717),
                  ),
                ),
                Text(
                  'Aperçu du $dayLabel • Temps réel',
                  style: TextStyle(
                    fontSize: _s(13),
                    color: Colors.grey[600],
                    fontFamily: 'Poppins',
                  ),
                ),
                SizedBox(height: _s(20)),
                Text(
                  'Indicateurs clés',
                  style: TextStyle(
                    fontSize: _s(18),
                    fontWeight: FontWeight.w700,
                    fontFamily: 'Poppins',
                    color: const Color(0xFF171717),
                  ),
                ),
                SizedBox(height: _s(12)),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: _s(12),
                  mainAxisSpacing: _s(12),
                  childAspectRatio: 1.5,
                  children: const [
                    _KpiCard(
                      icon: Icons.payments_rounded,
                      title: 'Chiffre d\'affaires\ndu jour',
                      value: '12 450 DH',
                      change: '+12%',
                      isPositive: true,
                    ),
                    _KpiCard(
                      icon: Icons.shopping_bag_outlined,
                      title: 'Commandes\naujourd\'hui',
                      value: '87',
                      change: '+8%',
                      isPositive: true,
                    ),
                    _KpiCard(
                      icon: Icons.shopping_cart_outlined,
                      title: 'Panier\nabandonnés',
                      value: '24',
                      change: '-5%',
                      isPositive: false,
                    ),
                    _KpiCard(
                      icon: Icons.person_add_alt_1_outlined,
                      title: 'Nouveaux\nclients',
                      value: '15',
                      change: '+22%',
                      isPositive: true,
                    ),
                    _KpiCard(
                      icon: Icons.inventory_2_outlined,
                      title: 'Produits\nvendus',
                      value: '142',
                      change: '+10%',
                      isPositive: true,
                    ),
                    _KpiCard(
                      icon: Icons.trending_up_rounded,
                      title: 'Croissance %',
                      value: '+12,4%',
                      change: '+2,1 pts',
                      isPositive: true,
                    ),
                  ],
                ),
                SizedBox(height: _s(12)),
                const _KpiCardFull(
                  icon: Icons.star_border_rounded,
                  title: 'Note moyenne',
                  value: '4,6/5',
                  subtitle: '124 avis • +0,2',
                ),
                SizedBox(height: _s(24)),
                _ChartCard(
                  title: 'Ventes par jour',
                  subtitle: '7 derniers jours',
                  child: SizedBox(
                    height: _s(180),
                    child: LineChart(
                      LineChartData(
                        minX: 0,
                        maxX: 6,
                        minY: 1000,
                        maxY: 2000,
                        gridData: const FlGridData(show: false),
                        titlesData: FlTitlesData(
                          leftTitles: const AxisTitles(
                            sideTitles: SideTitles(showTitles: false),
                          ),
                          topTitles: const AxisTitles(
                            sideTitles: SideTitles(showTitles: false),
                          ),
                          rightTitles: const AxisTitles(
                            sideTitles: SideTitles(showTitles: false),
                          ),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              interval: 1,
                              getTitlesWidget: (value, meta) {
                                const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
                                final index = value.toInt();
                                if (index < 0 || index >= days.length) {
                                  return const SizedBox.shrink();
                                }
                                return Padding(
                                  padding: EdgeInsets.only(top: _s(8)),
                                  child: Text(
                                    days[index],
                                    style: TextStyle(
                                      fontSize: _s(10),
                                      fontFamily: 'Poppins',
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        ),
                        borderData: FlBorderData(show: false),
                        lineBarsData: [
                          LineChartBarData(
                            spots: const [
                              FlSpot(0, 1200),
                              FlSpot(1, 1450),
                              FlSpot(2, 1300),
                              FlSpot(3, 1600),
                              FlSpot(4, 1550),
                              FlSpot(5, 1900),
                              FlSpot(6, 1750),
                            ],
                            isCurved: true,
                            color: const Color(0xFFFF6A00),
                            barWidth: _s(3),
                            dotData: const FlDotData(show: true),
                            belowBarData: BarAreaData(
                              show: true,
                              color: const Color(0xFFFF6A00).withValues(alpha: 0.15),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                SizedBox(height: _s(16)),
                _ChartCard(
                  title: 'Produits les plus vendus',
                  subtitle: 'Octobre',
                  child: Column(
                    children: [
                      const _ProductBar(
                        name: 'Montre Connectée X2',
                        sales: 31,
                        max: 40,
                      ),
                      const _ProductBar(
                        name: 'Tasse Thermique 500ml',
                        sales: 24,
                        max: 40,
                      ),
                      SizedBox(height: _s(8)),
                      Text(
                        'Octobre : 98 320 DH • +18% vs septembre',
                        style: TextStyle(
                          fontSize: _s(12),
                          color: Colors.grey[600],
                          fontFamily: 'Poppins',
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: _s(16)),
                const _ChartCard(
                  title: 'Marques les plus vendues',
                  child: Column(
                    children: [
                      _BrandItem(
                        initial: 'TP',
                        name: 'TechPro',
                        sales: '35 ventes',
                        percent: '28,5%',
                      ),
                      _BrandItem(
                        initial: 'HL',
                        name: 'HomeLife Style&Co',
                        sales: '26 ventes',
                        percent: '21,1%',
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                Center(
                  child: Text(
                    'Mise à jour : $syncLabel • Données synchronisées',
                    style: TextStyle(
                      fontSize: _s(11),
                      color: Colors.grey[500],
                      fontFamily: 'Poppins',
                    ),
                  ),
                ),
                      SizedBox(height: _s(40)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _KpiCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final String change;
  final bool isPositive;

  const _KpiCard({
    required this.icon,
    required this.title,
    required this.value,
    required this.change,
    required this.isPositive,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(_s(14)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_s(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: _s(10),
            offset: Offset(0, _s(2)),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: EdgeInsets.all(_s(6)),
                decoration: BoxDecoration(
                  color: const Color(0xFFFF6A00).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(_s(10)),
                ),
                child: Icon(icon, color: const Color(0xFFFF6A00), size: _s(18)),
              ),
              SizedBox(width: _s(10)),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: _s(11),
                        color: Colors.grey[600],
                        fontFamily: 'Poppins',
                      ),
                    ),
                    SizedBox(height: _s(4)),
                    Text(
                      value,
                      style: TextStyle(
                        fontSize: _s(20),
                        fontWeight: FontWeight.bold,
                        fontFamily: 'Poppins',
                      ),
                    ),
                    SizedBox(height: _s(2)),
                    Text(
                      '$change vs hier',
                      style: TextStyle(
                        fontSize: _s(11),
                        color: isPositive ? Colors.green : Colors.red,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'Poppins',
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _KpiCardFull extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final String subtitle;

  const _KpiCardFull({
    required this.icon,
    required this.title,
    required this.value,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(_s(14)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_s(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: _s(10),
            offset: Offset(0, _s(2)),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(_s(6)),
            decoration: BoxDecoration(
              color: const Color(0xFFFF6A00).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(_s(10)),
            ),
            child: Icon(icon, color: const Color(0xFFFF6A00), size: _s(18)),
          ),
          SizedBox(width: _s(12)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: _s(11),
                    color: Colors.grey[600],
                    fontFamily: 'Poppins',
                  ),
                ),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: _s(20),
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Poppins',
                  ),
                ),
              ],
            ),
          ),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: _s(11),
              color: Colors.green,
              fontWeight: FontWeight.w600,
              fontFamily: 'Poppins',
            ),
          ),
        ],
      ),
    );
  }
}

class _ChartCard extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget child;

  const _ChartCard({
    required this.title,
    this.subtitle,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(_s(16)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_s(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: _s(10),
            offset: Offset(0, _s(2)),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: _s(16),
                  fontWeight: FontWeight.w700,
                  fontFamily: 'Poppins',
                ),
              ),
              if (subtitle != null)
                Text(
                  subtitle!,
                  style: TextStyle(
                    fontSize: _s(11),
                    color: Colors.grey[600],
                    fontFamily: 'Poppins',
                  ),
                ),
            ],
          ),
          SizedBox(height: _s(16)),
          child,
        ],
      ),
    );
  }
}

class _ProductBar extends StatelessWidget {
  final String name;
  final int sales;
  final int max;

  const _ProductBar({
    required this.name,
    required this.sales,
    required this.max,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: _s(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                name,
                style: TextStyle(
                  fontSize: _s(13),
                  fontFamily: 'Poppins',
                ),
              ),
              Text(
                '$sales ventes',
                style: TextStyle(
                  fontSize: _s(12),
                  fontWeight: FontWeight.w600,
                  fontFamily: 'Poppins',
                ),
              ),
            ],
          ),
          SizedBox(height: _s(6)),
          ClipRRect(
            borderRadius: BorderRadius.circular(_s(4)),
            child: LinearProgressIndicator(
              value: sales / max,
              minHeight: _s(6),
              backgroundColor: Colors.grey[200],
              valueColor: const AlwaysStoppedAnimation(Color(0xFFFF6A00)),
            ),
          ),
        ],
      ),
    );
  }
}

class _BrandItem extends StatelessWidget {
  final String initial;
  final String name;
  final String sales;
  final String percent;

  const _BrandItem({
    required this.initial,
    required this.name,
    required this.sales,
    required this.percent,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: _s(12)),
      child: Row(
        children: [
          CircleAvatar(
            radius: _s(18),
            backgroundColor: const Color(0xFFFF6A00).withValues(alpha: 0.1),
            child: Text(
              initial,
              style: TextStyle(
                color: const Color(0xFFFF6A00),
                fontWeight: FontWeight.bold,
                fontFamily: 'Poppins',
                fontSize: _s(12),
              ),
            ),
          ),
          SizedBox(width: _s(12)),
          Expanded(
            child: Text(
              name,
              style: TextStyle(
                fontSize: _s(13),
                fontFamily: 'Poppins',
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                sales,
                style: TextStyle(
                  fontSize: _s(12),
                  fontWeight: FontWeight.w600,
                  fontFamily: 'Poppins',
                ),
              ),
              Text(
                percent,
                style: TextStyle(
                  fontSize: _s(11),
                  color: Colors.grey[600],
                  fontFamily: 'Poppins',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
