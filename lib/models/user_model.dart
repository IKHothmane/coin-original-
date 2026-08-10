import 'package:coin_original_mobile/models/address_model.dart';
import 'package:coin_original_mobile/utils/enums.dart';

class UserModel {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String? photoUrl;
  final String? fcmToken;
  final UserRole role;
  final List<AddressModel> addresses;
  final DateTime createdAt;

  const UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.photoUrl,
    this.fcmToken,
    this.role = UserRole.client,
    this.addresses = const [],
    required this.createdAt,
  });

  bool get isAdmin => role == UserRole.admin;

  factory UserModel.fromMap(Map<String, dynamic> map, String id) {
    final addressesData = (map['addresses'] as List<dynamic>? ?? const []);
    return UserModel(
      id: id,
      name: (map['name'] ?? '') as String,
      email: (map['email'] ?? '') as String,
      phone: map['phone'] as String?,
      photoUrl: map['photoUrl'] as String?,
      fcmToken: map['fcmToken'] as String?,
      role: UserRole.fromString((map['role'] ?? 'client') as String),
      addresses: addressesData
          .map((address) {
            final addressMap = address as Map<String, dynamic>;
            return AddressModel.fromMap(
              addressMap,
              (addressMap['id'] ?? DateTime.now().millisecondsSinceEpoch.toString()) as String,
            );
          })
          .toList(),
      createdAt: _parseDate(map['createdAt']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'email': email,
      'phone': phone,
      'photoUrl': photoUrl,
      'fcmToken': fcmToken,
      'role': role.value,
      'addresses': addresses.map((address) => address.toMap()).toList(),
      'createdAt': createdAt.toIso8601String(),
    };
  }

  UserModel copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? photoUrl,
    String? fcmToken,
    UserRole? role,
    List<AddressModel>? addresses,
    DateTime? createdAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      photoUrl: photoUrl ?? this.photoUrl,
      fcmToken: fcmToken ?? this.fcmToken,
      role: role ?? this.role,
      addresses: addresses ?? this.addresses,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}

DateTime _parseDate(dynamic value) {
  if (value is DateTime) return value;
  if (value is String && value.isNotEmpty) {
    return DateTime.tryParse(value) ?? DateTime.now();
  }
  if (value is int) {
    return DateTime.fromMillisecondsSinceEpoch(value);
  }
  if (value != null) {
    try {
      return (value as dynamic).toDate() as DateTime;
    } catch (_) {}
  }
  return DateTime.now();
}
