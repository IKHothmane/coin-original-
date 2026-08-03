import 'package:flutter/material.dart';

enum AppNotificationType { order, promo, stock, collection }

class AppNotificationModel {
  final String id;
  final String title;
  final String body;
  final DateTime createdAt;
  final AppNotificationType type;
  final bool isRead;
  final String? orderId;

  const AppNotificationModel({
    required this.id,
    required this.title,
    required this.body,
    required this.createdAt,
    required this.type,
    this.isRead = false,
    this.orderId,
  });

  AppNotificationModel copyWith({
    String? id,
    String? title,
    String? body,
    DateTime? createdAt,
    AppNotificationType? type,
    bool? isRead,
    String? orderId,
  }) {
    return AppNotificationModel(
      id: id ?? this.id,
      title: title ?? this.title,
      body: body ?? this.body,
      createdAt: createdAt ?? this.createdAt,
      type: type ?? this.type,
      isRead: isRead ?? this.isRead,
      orderId: orderId ?? this.orderId,
    );
  }
}

extension AppNotificationTypeX on AppNotificationType {
  IconData get icon {
    switch (this) {
      case AppNotificationType.order:
        return Icons.local_shipping;
      case AppNotificationType.promo:
        return Icons.local_offer;
      case AppNotificationType.stock:
        return Icons.favorite;
      case AppNotificationType.collection:
        return Icons.sell;
    }
  }

  Color get backgroundColor {
    switch (this) {
      case AppNotificationType.order:
        return const Color(0xFFB4D4FF);
      case AppNotificationType.promo:
        return const Color(0xFFFFD4B4);
      case AppNotificationType.stock:
        return const Color(0xFFFFB4B4);
      case AppNotificationType.collection:
        return const Color(0xFFD4B4FF);
    }
  }
}
