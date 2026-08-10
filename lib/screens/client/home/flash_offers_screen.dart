import 'dart:async';

import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/providers/product_provider.dart';
import 'package:coin_original_mobile/utils/helpers.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

const double _kScale = 0.8;

double _s(double value) => value * _kScale;

class FlashOffersScreen extends StatefulWidget {
  const FlashOffersScreen({super.key});

  @override
  State<FlashOffersScreen> createState() => _FlashOffersScreenState();
}

class _FlashOffersScreenState extends State<FlashOffersScreen> {
  static const Color _accent = Color(0xFFFF6A00);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final provider = context.read<ProductProvider>();
      if (provider.products.isEmpty && !provider.isLoading) {
        provider.loadCatalogProducts();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProductProvider>();
    final offers = _flashProducts(provider.products);

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.black87, size: _s(24)),
          onPressed: () => Navigator.pop(context),
        ),
        titleSpacing: 0,
        title: Row(
          children: [
            Text(
              'Offres Flash',
              style: TextStyle(
                color: Colors.black87,
                fontWeight: FontWeight.w800,
                fontSize: _s(22),
              ),
            ),
            SizedBox(width: _s(6)),
            Icon(Icons.bolt_rounded, color: _accent, size: _s(22)),
          ],
        ),
        actions: const [
          _CountdownBadge(),
        ],
      ),
      body: Column(
        children: [
          Container(
            color: Colors.white,
            padding: EdgeInsets.all(_s(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      'Coin Original',
                      style: TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: _s(18),
                      ),
                    ),
                    SizedBox(width: _s(6)),
                    Icon(
                      Icons.verified,
                      color: Colors.blue.shade600,
                      size: _s(18),
                    ),
                    SizedBox(width: _s(12)),
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: _s(10),
                        vertical: _s(4),
                      ),
                      decoration: BoxDecoration(
                        color: _accent.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(_s(6)),
                        border: Border.all(
                          color: _accent.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Text(
                        'VENTE FLASH | JUSQU\'A -50%',
                        style: TextStyle(
                          fontSize: _s(11),
                          color: _accent,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: _s(12)),
                Text(
                  'Profitez des offres limitees avant la fin du compte a rebours!',
                  style: TextStyle(fontSize: _s(13), color: Colors.black87),
                ),
              ],
            ),
          ),
          Expanded(
            child: provider.isLoading && offers.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : offers.isEmpty
                    ? Center(
                        child: Text(
                          'Aucune offre flash dans la base',
                          style: TextStyle(
                            fontSize: _s(14),
                            color: Colors.grey.shade600,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      )
                    : GridView.builder(
                        padding: EdgeInsets.all(_s(12)),
                        itemCount: offers.length,
                        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: _s(12),
                          mainAxisSpacing: _s(12),
                          childAspectRatio: 0.68,
                        ),
                        itemBuilder: (context, index) {
                          return _FlashCard(
                            offer: offers[index],
                            onTap: () => _openProductDetail(offers[index]),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  void _openProductDetail(ProductModel product) {
    Navigator.pushNamed(context, '/product-detail', arguments: product);
  }

  List<ProductModel> _flashProducts(List<ProductModel> products) {
    final visibleProducts = products.where((product) {
      return product.isActive && !product.hidden && product.imageUrl.isNotEmpty;
    }).toList();

    final discounted = visibleProducts.where((product) {
      final promoPrice = product.promoPrice;
      final hasPromoPrice =
          promoPrice != null && promoPrice > 0 && promoPrice < product.price;
      final hasOldPrice =
          product.oldPrice != null && product.oldPrice! > product.price;
      return hasPromoPrice || hasOldPrice;
    }).toList();

    final source = discounted.isNotEmpty ? discounted : visibleProducts;
    source.sort(_compareFlashProducts);
    return source.take(8).toList();
  }
}

class _CountdownBadge extends StatefulWidget {
  const _CountdownBadge();

  @override
  State<_CountdownBadge> createState() => _CountdownBadgeState();
}

class _CountdownBadgeState extends State<_CountdownBadge> {
  late final Timer _timer;
  Duration _remaining = const Duration(hours: 2, minutes: 14, seconds: 35);

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      if (_remaining.inSeconds > 0) {
        setState(() {
          _remaining -= const Duration(seconds: 1);
        });
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  String _formatDuration(Duration duration) {
    final hours = duration.inHours.toString().padLeft(2, '0');
    final minutes = (duration.inMinutes % 60).toString().padLeft(2, '0');
    final seconds = (duration.inSeconds % 60).toString().padLeft(2, '0');
    return '$hours:$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(right: _s(16)),
      padding: EdgeInsets.symmetric(horizontal: _s(12), vertical: _s(6)),
      decoration: BoxDecoration(
        color: _FlashOffersScreenState._accent,
        borderRadius: BorderRadius.circular(_s(8)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.timer_outlined, color: Colors.white, size: _s(18)),
          SizedBox(width: _s(4)),
          Text(
            _formatDuration(_remaining),
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: _s(14),
            ),
          ),
        ],
      ),
    );
  }
}

class _FlashCard extends StatelessWidget {
  final ProductModel offer;
  final VoidCallback onTap;

  const _FlashCard({
    required this.offer,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final currentPrice = offer.promoPrice != null &&
            offer.promoPrice! > 0 &&
            offer.promoPrice! < offer.price
        ? offer.promoPrice!
        : offer.price;
    final oldPrice = offer.oldPrice != null && offer.oldPrice! > currentPrice
        ? offer.oldPrice!
        : offer.price;
    final discount = offer.discountPercent?.toInt() ??
        (oldPrice > currentPrice
            ? (((oldPrice - currentPrice) / oldPrice) * 100).round()
            : 0);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(_s(12)),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(_s(12)),
            border: Border.all(color: const Color(0xFFF0D7C5)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: _s(8),
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(_s(12)),
                      topRight: Radius.circular(_s(12)),
                    ),
                    child: AspectRatio(
                      aspectRatio: 1.2,
                      child: Container(
                        color: const Color(0xFFFFF4EC),
                        child: NetworkImageWidget(
                          imageUrl: offer.imageUrl,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: _s(7),
                    left: _s(7),
                    child: Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: _s(7),
                        vertical: _s(3),
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFF6A00),
                        borderRadius: BorderRadius.circular(_s(5)),
                      ),
                      child: Text(
                        discount > 0 ? '-$discount%' : 'Flash',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                          fontSize: _s(10),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              Expanded(
                child: Padding(
                  padding: EdgeInsets.fromLTRB(_s(8), _s(7), _s(8), _s(8)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: _s(30),
                        child: Text(
                          offer.name,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: _s(11),
                            fontWeight: FontWeight.w600,
                            color: Colors.black87,
                            height: 1.2,
                          ),
                        ),
                      ),
                      const Spacer(),
                      Text(
                        Helpers.formatPrice(currentPrice),
                        style: TextStyle(
                          fontSize: _s(13),
                          fontWeight: FontWeight.w800,
                          color: const Color(0xFFE45A00),
                        ),
                      ),
                      if (oldPrice > currentPrice)
                        Text(
                          Helpers.formatPrice(oldPrice),
                          style: TextStyle(
                            fontSize: _s(9),
                            color: Colors.grey.shade500,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                      SizedBox(height: _s(4)),
                      Row(
                        children: [
                          Icon(
                            Icons.star,
                            size: _s(12),
                            color: const Color(0xFFFF6A00),
                          ),
                          SizedBox(width: _s(4)),
                          Expanded(
                            child: Text(
                              '${offer.rating.toStringAsFixed(1)} (${offer.reviewCount})',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: _s(9),
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

int _compareFlashProducts(ProductModel a, ProductModel b) {
  final discountComparison =
      (b.discountPercent ?? 0).compareTo(a.discountPercent ?? 0);
  if (discountComparison != 0) return discountComparison;

  final createdAtComparison = b.createdAt.compareTo(a.createdAt);
  if (createdAtComparison != 0) return createdAtComparison;

  return a.id.compareTo(b.id);
}
