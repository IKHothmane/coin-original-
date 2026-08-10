import 'package:flutter_test/flutter_test.dart';
import 'package:coin_original_mobile/models/user_model.dart';
import 'package:coin_original_mobile/models/address_model.dart';
import 'package:coin_original_mobile/utils/enums.dart';

void main() {
  group('UserModel Tests', () {
    test('should construct model and serialize/deserialize correctly', () {
      final now = DateTime.now();
      final user = UserModel(
        id: 'user1',
        name: 'Alice',
        email: 'alice@example.com',
        role: UserRole.admin,
        addresses: [
          const AddressModel(
            id: 'addr1',
            street: '123 Main St',
            city: 'Paris',
            postalCode: '75001',
          ),
        ],
        createdAt: now,
      );

      expect(user.isAdmin, isTrue);

      final map = user.toMap();
      expect(map['role'], 'admin');
      expect(map['addresses'].length, 1);

      final reconstructed = UserModel.fromMap(map, 'user1');
      expect(reconstructed.id, 'user1');
      expect(reconstructed.role, UserRole.admin);
      expect(reconstructed.addresses.length, 1);
      expect(reconstructed.addresses.first.city, 'Paris');
    });
  });
}
