import 'dart:io';

import 'package:coin_original_mobile/models/product_model.dart';
import 'package:coin_original_mobile/providers/product_provider.dart';
import 'package:coin_original_mobile/screens/admin/admin_dashboard_screen.dart';
import 'package:coin_original_mobile/screens/admin/orders/orders_screen.dart';
import 'package:coin_original_mobile/screens/admin/products/products_screen.dart';
import 'package:coin_original_mobile/screens/admin/clients/clients_screen.dart';
import 'package:coin_original_mobile/screens/admin/widgets/admin_drawer.dart';
import 'package:coin_original_mobile/services/cloudinary_service.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

const double _kScale = 0.8;
double _s(double value) => value * _kScale;

class AddProductScreen extends StatefulWidget {
  final ProductModel? product;

  const AddProductScreen({super.key, this.product});

  @override
  State<AddProductScreen> createState() => _AddProductScreenState();
}

class _AddProductScreenState extends State<AddProductScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _descriptionCtrl = TextEditingController();
  final _videoUrlCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _promoPriceCtrl = TextEditingController();

  List<String> selectedSizes = [];
  List<String> selectedColors = [];
  String productType = 'Chaussures';
  bool autoManageStock = true;
  DateTime? promoStartDate;
  DateTime? promoEndDate;
  bool _isSubmitting = false;

  // Images sélectionnées (fichiers locaux pour nouvelles images)
  final List<File> _selectedImageFiles = [];
  // URLs d'images existantes (pour l'édition)
  final List<String> _existingImageUrls = [];

  final ImagePicker _imagePicker = ImagePicker();

  @override
  void initState() {
    super.initState();
    final product = widget.product;
    if (product != null) {
      _nameCtrl.text = product.name;
      _descriptionCtrl.text = product.description;
      _videoUrlCtrl.text = product.videoUrl ?? '';
      _priceCtrl.text = product.price.toStringAsFixed(0);
      _promoPriceCtrl.text = product.promoPrice?.toStringAsFixed(0) ?? '';
      selectedSizes = List<String>.from(product.variants);
      // Charger les images existantes
      _existingImageUrls.addAll(product.images);
      if (product.image != null &&
          product.image!.isNotEmpty &&
          !_existingImageUrls.contains(product.image)) {
        _existingImageUrls.insert(0, product.image!);
      }
      // Détecter le type de produit depuis les variants
      if (product.variants.isNotEmpty) {
        final firstVariant = product.variants.first;
        if (['XS', 'S', 'M', 'L', 'XL', 'XXL'].contains(firstVariant)) {
          productType = 'Vêtements';
        } else {
          productType = 'Chaussures';
        }
      }
      // Charger les couleurs sélectionnées du produit
      selectedColors = List<String>.from(product.colors);
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _descriptionCtrl.dispose();
    _videoUrlCtrl.dispose();
    _priceCtrl.dispose();
    _promoPriceCtrl.dispose();
    super.dispose();
  }

  // Méthodes pour la gestion des images — MAX 5 IMAGES TOTALES (existantes + nouvelles)
  int get _totalImages => _existingImageUrls.length + _selectedImageFiles.length;

  static const int _kMaxImages = 5;

  bool _checkMaxImages({int adding = 1}) {
    if (_totalImages + adding > _kMaxImages) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Maximum $_kMaxImages images autorisées (actuellement $_totalImages).'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
      return false;
    }
    return true;
  }

  Future<void> _pickImage() async {
    if (!_checkMaxImages()) return;
    final allowed = _kMaxImages - _totalImages;
    try {
      final picked = await _imagePicker.pickMultiImage(
        imageQuality: 85,
        maxWidth: 1400,
        limit: allowed,
      );
      if (picked.isEmpty) return;
      if (!mounted) return;
      if (!_checkMaxImages(adding: picked.length)) return;
      setState(() {
        for (final x in picked) {
          _selectedImageFiles.add(File(x.path));
          if (_totalImages >= _kMaxImages) break;
        }
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur lors de l\'import: $e')),
      );
    }
  }

  Future<void> _takePhoto() async {
    if (!_checkMaxImages()) return;
    try {
      final pickedFile = await _imagePicker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
        maxWidth: 1400,
      );
      if (pickedFile != null) {
        if (!mounted) return;
        if (!_checkMaxImages()) return;
        setState(() => _selectedImageFiles.add(File(pickedFile.path)));
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur caméra: $e')),
      );
    }
  }

  void _removeImage(int index) {
    setState(() {
      if (index < _existingImageUrls.length) {
        _existingImageUrls.removeAt(index);
      } else {
        final fileIndex = index - _existingImageUrls.length;
        if (fileIndex < _selectedImageFiles.length) {
          _selectedImageFiles.removeAt(fileIndex);
        }
      }
    });
  }

  Widget _buildImagePickerSection() {
    final allImages = <dynamic>[..._existingImageUrls, ..._selectedImageFiles];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Grille d'images
        if (allImages.isNotEmpty)
          SizedBox(
            height: _s(120),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: allImages.length,
              itemBuilder: (context, index) {
                final item = allImages[index];
                final isNetwork = item is String;
                return Stack(
                  children: [
                    Container(
                      width: _s(120),
                      height: _s(120),
                      margin: EdgeInsets.only(right: _s(8)),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(_s(12)),
                        border: Border.all(color: Colors.grey[300]!),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(_s(12)),
                        child: isNetwork
                            ? NetworkImageWidget(
                                imageUrl: item,
                                width: _s(120),
                                height: _s(120),
                                fit: BoxFit.cover,
                              )
                            : Image.file(
                                item as File,
                                width: _s(120),
                                height: _s(120),
                                fit: BoxFit.cover,
                              ),
                      ),
                    ),
                    Positioned(
                      top: _s(4),
                      right: _s(12),
                      child: GestureDetector(
                        onTap: () => _removeImage(index),
                        child: Container(
                          padding: EdgeInsets.all(_s(4)),
                          decoration: const BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.close,
                            size: _s(16),
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        SizedBox(height: _s(8)),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Images',
              style: TextStyle(
                fontSize: _s(14),
                fontWeight: FontWeight.w600,
                color: const Color(0xFF1F2937),
                fontFamily: 'Poppins',
              ),
            ),
            Container(
              padding: EdgeInsets.symmetric(
                horizontal: _s(10),
                vertical: _s(4),
              ),
              decoration: BoxDecoration(
                color: _totalImages >= _kMaxImages
                    ? const Color(0xFFFEF3C7)
                    : const Color(0xFFE0F2FE),
                borderRadius: BorderRadius.circular(_s(8)),
              ),
              child: Text(
                '$_totalImages / $_kMaxImages',
                style: TextStyle(
                  fontSize: _s(12),
                  fontWeight: FontWeight.w600,
                  color: _totalImages >= _kMaxImages
                      ? const Color(0xFFB45309)
                      : const Color(0xFF0369A1),
                  fontFamily: 'Poppins',
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: _s(12)),
        // Boutons d'ajout
        Row(
          children: [
            Expanded(
              child: _ImagePickerButton(
                icon: Icons.photo_library_outlined,
                label: 'Galerie',
                onTap: _pickImage,
                enabled: _totalImages < _kMaxImages,
              ),
            ),
            SizedBox(width: _s(12)),
            Expanded(
              child: _ImagePickerButton(
                icon: Icons.camera_alt_outlined,
                label: 'Appareil',
                onTap: _takePhoto,
                enabled: _totalImages < _kMaxImages,
              ),
            ),
          ],
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.product != null;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        title: Text(
          isEdit ? 'Modifier produit' : 'Ajouter un produit',
          style: TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w700,
            fontFamily: 'Poppins',
            fontSize: _s(18),
          ),
        ),
      ),
      body: Column(
        children: [
          AdminNavBar(
            scale: _s,
            currentSection: AdminSection.products,
            onDashboard: () {
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(
                  builder: (_) => const AdminDashboardScreen(),
                ),
                (route) => false,
              );
            },
            onProducts: () {
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(
                  builder: (_) => const ProductsScreen(),
                ),
                (route) => false,
              );
            },
            onOrders: () {
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(
                  builder: (_) => const OrdersScreen(),
                ),
                (route) => false,
              );
            },
            onClients: () {
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(
                  builder: (_) => const ClientsScreen(),
                ),
                (route) => false,
              );
            },
          ),
          Expanded(
            child: Form(
              key: _formKey,
              child: ListView(
                padding: EdgeInsets.all(_s(16)),
                children: [
                  _Section(
                    title: 'Informations',
                    children: [
                      _TextField(label: 'Nom *', controller: _nameCtrl),
                      _TextField(
                        label: 'Description',
                        controller: _descriptionCtrl,
                        maxLines: 3,
                      ),
                    ],
                  ),
                  _Section(
                    title: 'Images',
                    children: [
                      _buildImagePickerSection(),
                      _TextField(
                        label: 'Vidéo URL',
                        controller: _videoUrlCtrl,
                        isRequired: false,
                      ),
                    ],
                  ),
                  _Section(
                    title: 'Prix & Stock',
                    children: [
                      _TextField(
                        label: 'Prix de vente *',
                        controller: _priceCtrl,
                        keyboardType: TextInputType.number,
                      ),
                      _TextField(
                        label: 'Prix d\'avant',
                        controller: _promoPriceCtrl,
                        keyboardType: TextInputType.number,
                        isRequired: false,
                      ),
                    ],
                  ),
                  _Section(
                    title: 'Variantes',
                    children: [
                      DropdownButtonFormField<String>(
                        value: productType,
                        decoration: InputDecoration(
                          labelText: 'Type',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(_s(12)),
                          ),
                          filled: true,
                          fillColor: const Color(0xFFF8F9FA),
                        ),
                        items: ['Chaussures', 'Vêtements']
                            .map(
                              (e) => DropdownMenuItem<String>(
                                value: e,
                                child: Text(e),
                              ),
                            )
                            .toList(),
                        onChanged: (value) =>
                            setState(() => productType = value!),
                      ),
                      SizedBox(height: _s(12)),
                      Wrap(
                        spacing: _s(8),
                        runSpacing: _s(8),
                        children: (productType == 'Chaussures'
                                ? ['40', '41', '42', '43', '44', '45']
                                : ['XS', 'S', 'M', 'L', 'XL', 'XXL'])
                            .map(
                              (size) => FilterChip(
                                label: Text(size),
                                selected: selectedSizes.contains(size),
                                onSelected: (selected) {
                                  setState(() {
                                    if (selected) {
                                      selectedSizes.add(size);
                                    } else {
                                      selectedSizes.remove(size);
                                    }
                                  });
                                },
                                selectedColor: const Color(0xFFFF6A00)
                                    .withValues(alpha: 0.2),
                                checkmarkColor: const Color(0xFFFF6A00),
                              ),
                            )
                            .toList(),
                      ),
                      SizedBox(height: _s(12)),
                      Text(
                        'Couleurs',
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: _s(14),
                          fontFamily: 'Poppins',
                        ),
                      ),
                      SizedBox(height: _s(8)),
                      Wrap(
                        spacing: _s(8),
                        runSpacing: _s(8),
                        children: ['Noir', 'Blanc', 'Rouge', 'Bleu']
                            .map(
                              (color) => FilterChip(
                                label: Text(color),
                                selected: selectedColors.contains(color),
                                onSelected: (selected) {
                                  setState(() {
                                    if (selected) {
                                      selectedColors.add(color);
                                    } else {
                                      selectedColors.remove(color);
                                    }
                                  });
                                },
                                selectedColor: const Color(0xFFFF6A00)
                                    .withValues(alpha: 0.2),
                                checkmarkColor: const Color(0xFFFF6A00),
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  ),
                  SizedBox(height: _s(24)),
                  SizedBox(
                    height: _s(50),
                    child: ElevatedButton(
                      onPressed: _isSubmitting ? null : _saveProduct,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFF6A00),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(_s(12)),
                        ),
                      ),
                      child: _isSubmitting
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor:
                                    AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Text(
                                isEdit
                                    ? 'Enregistrer les modifications'
                                    : 'Enregistrer le produit',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: _s(20),
                                  fontWeight: FontWeight.w600,
                                  fontFamily: 'Poppins',
                                ),
                              ),
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
  }

  Future<void> _saveProduct() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    final now = DateTime.now();
    final price = double.tryParse(_priceCtrl.text.trim()) ?? 0;
    final promoPrice = _promoPriceCtrl.text.trim().isEmpty
        ? null
        : double.tryParse(_promoPriceCtrl.text.trim());
    final productName = _nameCtrl.text.trim();

    // Valeurs conservées du produit existant ou valeurs par défaut
    final existing = widget.product;
    final weight = existing?.weight ?? 0;
    final dimensions = existing?.dimensions ?? '';
    final shortDescription = existing?.shortDescription ?? '';
    final sku = existing?.sku ?? '';
    final barcode = existing?.barcode;
    final existingAuthenticity = existing?.authenticityLabel;
    final existingDeliveryLabel = existing?.deliveryLabel;
    final existingDeliveryRegion = existing?.deliveryRegion;
    final existingBadge = existing?.badge;
    final rawBrand = existing?.brand;
    final brand = (rawBrand != null && rawBrand.isNotEmpty)
        ? rawBrand
        : 'Coin Original';
    final existingCategoryId = existing?.categoryId ?? '';
    final existingCategoryName = existing?.categoryName ?? '';
    final seoTitle = existing?.seoTitle ?? '';
    final seoDescription = existing?.seoDescription ?? '';
    final seoUrl = existing?.seoUrl ?? '';

    // Slug (exactement même algo que le web: slugifyProductName)
    final existingSlug = widget.product?.slug;
    final slug = existingSlug != null && existingSlug.isNotEmpty
        ? existingSlug
        : slugifyProductName(productName);

    // Catégorie: même normalisation que le web (Chaussures / Accessoires / sinon Vetements)
    final category = () {
      if (productType == 'Chaussures') return 'Chaussures';
      if (productType == 'Accessoires') return 'Accessoires';
      final existing = existingCategoryId.isNotEmpty ? existingCategoryId : existingCategoryName;
      if (existing == 'Chaussures' || existing == 'Accessoires') return existing;
      return 'Vetements';
    }();

    // Upload des nouvelles images vers Cloudinary
    List<String> allImageUrls = List.from(_existingImageUrls);
    int cloudinaryTotalExpected = 0;
    int cloudinaryTotalSuccess = 0;
    String? cloudinaryError;
    if (_selectedImageFiles.isNotEmpty) {
      cloudinaryTotalExpected = _selectedImageFiles.length;
      final uploadedUrls = await CloudinaryService.uploadImages(
        imageFiles: _selectedImageFiles,
        productSlug: slug,
      );
      cloudinaryTotalSuccess = uploadedUrls.length;
      allImageUrls.addAll(uploadedUrls);
      if (cloudinaryTotalSuccess < cloudinaryTotalExpected) {
        cloudinaryError =
            'Échec de l\'envoi des images vers Cloudinary (${uploadedUrls.length}/${_selectedImageFiles.length} upload réussi). Vérifie la connexion et le preset Cloudinary.';
      }
    }

    final galleryPayload = allImageUrls
        .asMap()
        .entries
        .map((entry) => <String, dynamic>{
              'src': entry.value,
              'alt':
                  '${productName.isNotEmpty ? productName : 'Produit'} image ${entry.key + 1}',
            })
        .toList();

    final mainImage = allImageUrls.isNotEmpty ? allImageUrls.first : '';

    // 🔴 GARDE-FOU IDENTIQUE AU WEB: on ANNULE la sauvegarde si Cloudinary a échoué
    //    (sinon le produit se crée VIDE sans aucune image, ce qui est pire qu'une erreur affichée)
    if (cloudinaryError != null) {
      if (mounted) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(this.context).showSnackBar(
          SnackBar(
            backgroundColor: const Color(0xFFB91C1C),
            content: Text(cloudinaryError!),
            duration: const Duration(seconds: 6),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
      return;
    }
    // Aussi: si AUCUNE image du tout (pas même existante en édition) => annulation
    final int totalImagesFinal = allImageUrls.length;
    if (totalImagesFinal == 0) {
      if (mounted) {
        setState(() => _isSubmitting = false);
        ScaffoldMessenger.of(this.context).showSnackBar(
          const SnackBar(
            backgroundColor: Color(0xFFB91C1C),
            content: Text('Ajoute au moins une image avant d\'enregistrer le produit.'),
            duration: Duration(seconds: 5),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
      return;
    }

    final authenticityLabel =
        (existingAuthenticity != null && existingAuthenticity!.isNotEmpty)
            ? existingAuthenticity
            : 'Original Authentique';
    final deliveryLabel =
        (existingDeliveryLabel != null && existingDeliveryLabel!.isNotEmpty)
            ? existingDeliveryLabel
            : 'PAIEMENT A LA LIVRAISON';
    final deliveryRegion =
        (existingDeliveryRegion != null && existingDeliveryRegion!.isNotEmpty)
            ? existingDeliveryRegion
            : 'MAROC';

    final hasCompareAt =
        promoPrice != null && promoPrice > 0 && promoPrice > price;

    final Map<String, dynamic> data = {
      // === Champs UNIFORMES (identiques entre web et mobile) ===
      'slug': slug,
      'brand': brand,
      'category': category,
      'name': productName,
      'priceValue': price,
      'description': _descriptionCtrl.text.trim(),
      'sizes': selectedSizes,
      'colors': selectedColors,
      'soldOut': existing?.soldOut ?? false,
      'hidden': existing?.hidden ?? false,
      'image': mainImage,
      'gallery': galleryPayload,
      'authenticityLabel': authenticityLabel,
      'deliveryLabel': deliveryLabel,
      'deliveryRegion': deliveryRegion,
      'createdAt': existing?.createdAt.millisecondsSinceEpoch ??
          now.millisecondsSinceEpoch,
      'updatedAt': now.millisecondsSinceEpoch,
      if (hasCompareAt) 'compareAtPriceValue': promoPrice,
      if (existingBadge != null && existingBadge.isNotEmpty) 'badge': existingBadge,
    };

    // Champs spécifiques mobile (préservés d'une édition à l'autre)
    if (existing?.sku != null && existing!.sku.isNotEmpty) {
      data['sku'] = existing!.sku;
    } else if (sku.isNotEmpty) {
      data['sku'] = sku;
    }
    if (existing?.shortDescription != null && existing!.shortDescription.isNotEmpty) {
      data['shortDescription'] = existing!.shortDescription;
    } else if (shortDescription.isNotEmpty) {
      data['shortDescription'] = shortDescription;
    }
    if (existing?.barcode != null && existing!.barcode!.isNotEmpty) {
      data['barcode'] = existing!.barcode;
    } else if (barcode != null && barcode!.isNotEmpty) {
      data['barcode'] = barcode;
    }
    if (existing != null) {
      if (existing!.weight > 0) data['weight'] = existing!.weight;
      if (existing!.dimensions.isNotEmpty) data['dimensions'] = existing!.dimensions;
      if (existing!.seoTitle.isNotEmpty) data['seoTitle'] = existing!.seoTitle;
      if (existing!.seoDescription.isNotEmpty) data['seoDescription'] = existing!.seoDescription;
      if (existing!.seoUrl.isNotEmpty) data['seoUrl'] = existing!.seoUrl;
    } else {
      if (weight > 0) data['weight'] = weight;
      if (dimensions.isNotEmpty) data['dimensions'] = dimensions;
      if (seoTitle.isNotEmpty) data['seoTitle'] = seoTitle;
      if (seoDescription.isNotEmpty) data['seoDescription'] = seoDescription;
      if (seoUrl.isNotEmpty) data['seoUrl'] = seoUrl;
    }
    if (_videoUrlCtrl.text.trim().isNotEmpty) {
      data['videoUrl'] = _videoUrlCtrl.text.trim();
    } else if (existing?.videoUrl != null && existing!.videoUrl!.isNotEmpty) {
      data['videoUrl'] = existing!.videoUrl;
    }

    final provider = context.read<ProductProvider>();
    bool success;

    if (widget.product != null) {
      try {
        success = await provider.updateProduct(widget.product!.id, data);
      } catch (e) {
        success = false;
      }
    } else {
      // Création: format strictement identique au site web (via toMap + ProductModel)
      final galleryItems = galleryPayload
          .map((m) => Map<String, String>.from(m))
          .toList();
      final existingCatId = existingCategoryId.isNotEmpty ? existingCategoryId : category;
      final existingCatName = existingCategoryName.isNotEmpty ? existingCategoryName : category;

      final product = ProductModel(
        id: slug,
        slug: slug,
        brand: brand,
        category: category,
        categoryId: existingCatId,
        categoryName: existingCatName,
        name: productName,
        price: price,
        compareAtPriceValue: hasCompareAt ? promoPrice : null,
        oldPrice: hasCompareAt ? promoPrice : null,
        promoPrice: hasCompareAt ? promoPrice : null,
        description: _descriptionCtrl.text.trim(),
        image: mainImage,
        gallery: galleryItems,
        sizes: selectedSizes,
        variants: selectedSizes,
        colors: selectedColors,
        soldOut: false,
        hidden: false,
        authenticityLabel: authenticityLabel,
        deliveryLabel: deliveryLabel,
        deliveryRegion: deliveryRegion,
        createdAt: now,
        updatedAt: now,
        sku: sku,
        barcode: barcode,
        shortDescription: shortDescription,
        videoUrl: _videoUrlCtrl.text.trim().isNotEmpty
            ? _videoUrlCtrl.text.trim()
            : null,
        weight: weight,
        dimensions: dimensions,
        seoTitle: seoTitle,
        seoDescription: seoDescription,
        seoUrl: seoUrl,
      );

      final createPayload = Map<String, dynamic>.from(product.toMap());
      try {
        success = await provider.addProductWithId(slug, createPayload);
      } catch (e) {
        success = false;
      }
    }

    if (!mounted) return;

    setState(() => _isSubmitting = false);

    if (success) {
      if (mounted) Navigator.pop(context);
    }
  }
}

class _Section extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _Section({
    required this.title,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: _s(16)),
      padding: EdgeInsets.all(_s(16)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_s(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: _s(10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: _s(16),
              fontWeight: FontWeight.w700,
              fontFamily: 'Poppins',
            ),
          ),
          SizedBox(height: _s(16)),
          ...children,
        ],
      ),
    );
  }
}

class _TextField extends StatelessWidget {
  final String label;
  final TextEditingController? controller;
  final int maxLines;
  final TextInputType? keyboardType;
  final bool isRequired;

  const _TextField({
    required this.label,
    this.controller,
    this.maxLines = 1,
    this.keyboardType,
    this.isRequired = true,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: _s(12)),
      child: TextFormField(
        controller: controller,
        maxLines: maxLines,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_s(12)),
          ),
          filled: true,
          fillColor: const Color(0xFFF8F9FA),
        ),
        validator: (value) {
          if (!isRequired) return null;
          if (value == null || value.trim().isEmpty) return 'Requis';
          return null;
        },
      ),
    );
  }
}

class _ImagePickerButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool enabled;

  const _ImagePickerButton({
    required this.icon,
    required this.label,
    required this.onTap,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    final accent = enabled ? const Color(0xFFFF6A00) : Colors.grey[400]!;
    final bg = enabled ? const Color(0xFFF8F9FA) : Colors.grey[200]!;
    final textColor = enabled ? Colors.grey[600] : Colors.grey[500];

    return GestureDetector(
      onTap: enabled ? onTap : null,
      child: AbsorbPointer(
        absorbing: !enabled,
        child: Opacity(
          opacity: enabled ? 1.0 : 0.55,
          child: Container(
            height: _s(80),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey[300]!),
              borderRadius: BorderRadius.circular(_s(12)),
              color: bg,
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    icon,
                    size: _s(28),
                    color: accent,
                  ),
                  SizedBox(height: _s(4)),
                  Text(
                    label,
                    style: TextStyle(
                      color: textColor,
                      fontFamily: 'Poppins',
                      fontSize: _s(12),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
