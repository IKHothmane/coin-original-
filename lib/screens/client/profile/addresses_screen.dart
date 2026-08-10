import 'package:flutter/material.dart';
import 'package:coin_original_mobile/models/address_model.dart';
import 'package:coin_original_mobile/utils/constants.dart';
import 'package:coin_original_mobile/widgets/app_back_button.dart';
import 'package:coin_original_mobile/widgets/custom_button.dart';
import 'package:coin_original_mobile/widgets/empty_state.dart';

class AddressesScreen extends StatefulWidget {
  const AddressesScreen({super.key});

  @override
  State<AddressesScreen> createState() => _AddressesScreenState();
}

class _AddressesScreenState extends State<AddressesScreen> {
  final List<AddressModel> _addresses = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        leading: AppBackButton(
          onTap: () => Navigator.pop(context),
        ),
        title: const Text('Mes adresses'),
      ),
      body: _addresses.isEmpty
          ? EmptyState(
              message: 'Aucune adresse enregistrée',
              icon: Icons.location_on_outlined,
              actionLabel: 'Ajouter une adresse',
              onAction: () => _showAddAddressDialog(),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _addresses.length,
              itemBuilder: (context, index) {
                final address = _addresses[index];
                return _buildAddressCard(address);
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddAddressDialog(),
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildAddressCard(AddressModel address) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSizes.borderRadiusMedium),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.location_on, color: AppColors.primary),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    address.street,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                if (address.isDefault)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      'Défaut',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              '${address.postalCode} ${address.city}',
              style: const TextStyle(color: AppColors.textSecondary),
            ),
            Text(
              address.country,
              style: const TextStyle(color: AppColors.textSecondary),
            ),
            if (address.phone != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.phone, size: 16, color: AppColors.textSecondary),
                  const SizedBox(width: 8),
                  Text(
                    address.phone!,
                    style: const TextStyle(color: AppColors.textSecondary),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => _showEditAddressDialog(address),
                  child: const Text('Modifier'),
                ),
                TextButton(
                  onPressed: () => _deleteAddress(address),
                  child: const Text('Supprimer', style: TextStyle(color: AppColors.error)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showAddAddressDialog() {
    _showAddressDialog();
  }

  void _showEditAddressDialog(AddressModel address) {
    _showAddressDialog(address: address);
  }

  void _showAddressDialog({AddressModel? address}) {
    final streetController = TextEditingController(text: address?.street ?? '');
    final cityController = TextEditingController(text: address?.city ?? '');
    final postalCodeController = TextEditingController(text: address?.postalCode ?? '');
    final phoneController = TextEditingController(text: address?.phone ?? '');

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(address == null ? 'Nouvelle adresse' : 'Modifier l\'adresse'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: streetController,
                decoration: const InputDecoration(labelText: 'Rue'),
              ),
              TextField(
                controller: cityController,
                decoration: const InputDecoration(labelText: 'Ville'),
              ),
              TextField(
                controller: postalCodeController,
                decoration: const InputDecoration(labelText: 'Code postal'),
                keyboardType: TextInputType.number,
              ),
              TextField(
                controller: phoneController,
                decoration: const InputDecoration(labelText: 'Téléphone'),
                keyboardType: TextInputType.phone,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          CustomButton(
            text: 'Enregistrer',
            width: 120,
            height: 40,
            onPressed: () {
              // TODO: Save address
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }

  void _deleteAddress(AddressModel address) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Supprimer l\'adresse'),
        content: const Text('Voulez-vous vraiment supprimer cette adresse ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          TextButton(
            onPressed: () {
              setState(() => _addresses.removeWhere((a) => a.id == address.id));
              Navigator.pop(context);
            },
            child: const Text('Supprimer', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }
}
