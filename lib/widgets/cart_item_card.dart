import 'package:flutter/material.dart';
import 'package:coin_original_mobile/models/cart_item_model.dart';
import 'package:coin_original_mobile/widgets/network_image_widget.dart';
import 'package:coin_original_mobile/utils/constants.dart';
import 'package:coin_original_mobile/utils/helpers.dart';

class CartItemCard extends StatelessWidget {
  final CartItemModel item;
  final Function(int) onQuantityChanged;
  final VoidCallback onDelete;

  const CartItemCard({
    super.key,
    required this.item,
    required this.onQuantityChanged,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSizes.borderRadiusMedium),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(AppSizes.borderRadiusSmall),
              child: SizedBox(
                width: 80,
                height: 80,
                child: NetworkImageWidget(
                  imageUrl: item.product.images.isNotEmpty
                      ? item.product.images.first
                      : item.product.image,
                  width: 80,
                  height: 80,
                  fit: BoxFit.cover,
                  errorWidget: _buildPlaceholder(),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.product.name,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    Helpers.formatPrice(item.product.price),
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildQuantityButton(
                        icon: Icons.remove,
                        onTap: () => onQuantityChanged(item.quantity - 1),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        '${item.quantity}',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(width: 12),
                      _buildQuantityButton(
                        icon: Icons.add,
                        onTap: () => onQuantityChanged(item.quantity + 1),
                      ),
                      const Spacer(),
                      Text(
                        Helpers.formatPrice(item.totalPrice),
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            IconButton(
              onPressed: onDelete,
              icon: const Icon(Icons.delete_outline, color: AppColors.error),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      color: AppColors.divider,
      child: const Center(
        child: Icon(Icons.image_outlined, color: AppColors.textHint),
      ),
    );
  }

  Widget _buildQuantityButton({
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 18, color: AppColors.primary),
      ),
    );
  }
}
