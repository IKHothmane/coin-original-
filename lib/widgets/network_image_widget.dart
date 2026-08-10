import 'dart:convert';
import 'dart:typed_data';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

/// Widget réutilisable pour afficher une image depuis une URL réseau.
/// Utilise CachedNetworkImage pour le cache et le shimmer pendant le chargement.
/// Gère automatiquement les cas : URL vide, erreur de chargement, asset local.
class NetworkImageWidget extends StatelessWidget {
  final String? imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius? borderRadius;
  final Color placeholderColor;
  final Color shimmerBaseColor;
  final Color shimmerHighlightColor;
  final Widget? placeholder;
  final Widget? errorWidget;

  const NetworkImageWidget({
    super.key,
    this.imageUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
    this.placeholderColor = const Color(0xFFF0F1F5),
    this.shimmerBaseColor = const Color(0xFFE0E0E0),
    this.shimmerHighlightColor = const Color(0xFFF5F5F5),
    this.placeholder,
    this.errorWidget,
  });

  bool get _hasUrl => imageUrl != null && imageUrl!.isNotEmpty;
  bool get _isNetworkUrl => _hasUrl && (imageUrl!.startsWith('http://') || imageUrl!.startsWith('https://'));
  bool get _isAsset => _hasUrl && imageUrl!.startsWith('assets/');
  bool get _isDataUrl => _hasUrl && imageUrl!.startsWith('data:');

  @override
  Widget build(BuildContext context) {
    Widget child;

    if (!_hasUrl) {
      child = _buildPlaceholder();
    } else if (_isAsset) {
      child = _buildAssetImage();
    } else if (_isNetworkUrl) {
      child = _buildNetworkImage();
    } else if (_isDataUrl) {
      child = _buildDataUrlImage();
    } else {
      // URL non reconnue (peut être un chemin de fichier local ou autre)
      child = _buildPlaceholder();
    }

    if (borderRadius != null) {
      return ClipRRect(
        borderRadius: borderRadius!,
        child: child,
      );
    }
    return child;
  }

  Widget _buildNetworkImage() {
    return CachedNetworkImage(
      imageUrl: imageUrl!,
      width: width,
      height: height,
      fit: fit,
      alignment: Alignment.center,
      placeholder: (context, url) => _buildShimmer(),
      errorWidget: (context, url, error) => _buildError(),
    );
  }

  Widget _buildAssetImage() {
    return Image.asset(
      imageUrl!,
      width: width,
      height: height,
      fit: fit,
      errorBuilder: (_, __, ___) => _buildError(),
    );
  }

  Widget _buildDataUrlImage() {
    final bytes = _decodeBase64Image(imageUrl!);
    if (bytes == null || bytes.isEmpty) {
      return _buildError();
    }
    return Image.memory(
      bytes,
      width: width,
      height: height,
      fit: fit,
      errorBuilder: (_, __, ___) => _buildError(),
    );
  }

  Uint8List? _decodeBase64Image(String dataUrl) {
    try {
      final commaIndex = dataUrl.indexOf(',');
      if (commaIndex == -1 || commaIndex == dataUrl.length - 1) return null;
      final base64String = dataUrl.substring(commaIndex + 1);
      return base64Decode(base64String);
    } catch (_) {
      return null;
    }
  }

  Widget _buildShimmer() {
    return Shimmer.fromColors(
      baseColor: shimmerBaseColor,
      highlightColor: shimmerHighlightColor,
      child: Container(
        width: width,
        height: height,
        color: placeholderColor,
      ),
    );
  }

  Widget _buildPlaceholder() {
    if (placeholder != null) return placeholder!;
    return Container(
      width: width,
      height: height,
      color: placeholderColor,
      child: const Center(
        child: Icon(
          Icons.image_outlined,
          color: Colors.grey,
          size: 32,
        ),
      ),
    );
  }

  Widget _buildError() {
    if (errorWidget != null) return errorWidget!;
    return Container(
      width: width,
      height: height,
      color: placeholderColor,
      child: const Center(
        child: Icon(
          Icons.broken_image_outlined,
          color: Colors.grey,
          size: 32,
        ),
      ),
    );
  }
}
