class AddressModel {
  final String id;
  final String street;
  final String city;
  final String postalCode;
  final String country;
  final String? phone;
  final bool isDefault;

  const AddressModel({
    required this.id,
    required this.street,
    required this.city,
    required this.postalCode,
    this.country = 'Maroc',
    this.phone,
    this.isDefault = false,
  });

  factory AddressModel.fromMap(Map<String, dynamic> map, String id) {
    return AddressModel(
      id: id,
      street: (map['street'] ?? '') as String,
      city: (map['city'] ?? '') as String,
      postalCode: (map['postalCode'] ?? '') as String,
      country: (map['country'] ?? 'Maroc') as String,
      phone: map['phone'] as String?,
      isDefault: (map['isDefault'] ?? false) as bool,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'street': street,
      'city': city,
      'postalCode': postalCode,
      'country': country,
      'phone': phone,
      'isDefault': isDefault,
    };
  }

  AddressModel copyWith({
    String? id,
    String? street,
    String? city,
    String? postalCode,
    String? country,
    String? phone,
    bool? isDefault,
  }) {
    return AddressModel(
      id: id ?? this.id,
      street: street ?? this.street,
      city: city ?? this.city,
      postalCode: postalCode ?? this.postalCode,
      country: country ?? this.country,
      phone: phone ?? this.phone,
      isDefault: isDefault ?? this.isDefault,
    );
  }
}
