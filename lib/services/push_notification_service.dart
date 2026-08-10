import 'dart:async';
import 'dart:io';

import 'package:coin_original_mobile/config/firebase_config.dart';
import 'package:coin_original_mobile/services/firebase_service.dart';
import 'package:coin_original_mobile/services/local_notification_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

const String _kAdminOrdersTopic = 'admin_orders';

@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await FirebaseConfig.initialize();
  await LocalNotificationService.instance.initialize();
}

class PushNotificationService {
  PushNotificationService._();

  static final PushNotificationService instance = PushNotificationService._();

  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final ValueNotifier<String?> statusMessage = ValueNotifier<String?>(null);

  StreamSubscription<RemoteMessage>? _foregroundSubscription;
  StreamSubscription<String>? _tokenRefreshSubscription;
  bool _initialized = false;
  bool _isAdminSubscribed = false;
  String? _currentUserId;
  bool _currentIsAdmin = false;

  Future<void> initialize() async {
    if (_initialized) return;

    await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );

    await _messaging.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );

    FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

    _foregroundSubscription = FirebaseMessaging.onMessage.listen((message) async {
      final notification = message.notification;
      if (notification == null) return;
      if (!_shouldDisplayAdminOrderNotification(message)) return;

      await LocalNotificationService.instance.showOrderNotification(
        id: message.messageId.hashCode,
        title: notification.title ?? 'Nouvelle commande recue',
        body: notification.body ?? 'Une nouvelle commande vient d\'arriver.',
      );
    });

    _tokenRefreshSubscription = _messaging.onTokenRefresh.listen((token) async {
      try {
        await _syncTokenToFirestore(token: token);
        if (_isAdminSubscribed) {
          await _messaging.subscribeToTopic(_kAdminOrdersTopic);
        }
      } catch (_) {
        _setStatusMessage('FCM: echec refresh token/topic');
      }
    });

    _initialized = true;
  }

  Future<String?> getToken() async {
    await initialize();
    return _safeGetToken();
  }

  Future<void> syncWithAuth({
    required bool isAdmin,
    String? userId,
  }) async {
    try {
      await initialize();
      _currentUserId = userId;
      _currentIsAdmin = isAdmin;

      final token = await _safeGetToken();
      final tokenSaved = await _syncTokenToFirestore(token: token);

      if (isAdmin) {
        try {
          await _messaging.subscribeToTopic(_kAdminOrdersTopic);
          _isAdminSubscribed = true;
          if (tokenSaved) {
            _setStatusMessage('FCM admin actif: token enregistre et topic connecte');
          } else {
            _setStatusMessage('FCM admin: topic connecte, token non disponible');
          }
        } catch (_) {
          _isAdminSubscribed = false;
          _setStatusMessage('FCM admin: echec abonnement topic');
        }
        return;
      }

      if (_isAdminSubscribed) {
        try {
          await _messaging.unsubscribeFromTopic(_kAdminOrdersTopic);
          _setStatusMessage(
            tokenSaved
                ? 'FCM client actif: token enregistre'
                : 'FCM client: token non disponible',
          );
        } catch (_) {
          _setStatusMessage('FCM client: echec desabonnement topic admin');
        }
        _isAdminSubscribed = false;
      } else {
        _setStatusMessage(
          tokenSaved
              ? 'FCM client actif: token enregistre'
              : 'FCM client: token non disponible',
        );
      }
    } catch (_) {
      _isAdminSubscribed = false;
      _setStatusMessage('FCM indisponible sur cet appareil ou reseau');
    }
  }

  Future<String?> _safeGetToken() async {
    try {
      return await _messaging.getToken();
    } on FirebaseException catch (_) {
      return null;
    } on PlatformException catch (_) {
      return null;
    } catch (_) {
      return null;
    }
  }

  bool _shouldDisplayAdminOrderNotification(RemoteMessage message) {
    final isOrderNotification = message.data['type'] == 'order';
    if (!isOrderNotification) return false;
    return _currentIsAdmin && _isAdminSubscribed;
  }

  Future<bool> _syncTokenToFirestore({required String? token}) async {
    final userId = _currentUserId;
    if (userId == null || token == null || token.isEmpty) return false;

    try {
      await FirebaseService.firestore.collection('users').doc(userId).set({
        'fcmToken': token,
        'fcmPlatform': Platform.operatingSystem,
        'fcmUpdatedAt': Timestamp.now(),
        'fcmAdminTopic': _currentIsAdmin,
      }, SetOptions(merge: true));
      return true;
    } catch (error) {
      _setStatusMessage('FCM: echec enregistrement token Firebase');
      return false;
    }
  }

  void _setStatusMessage(String message) {
    statusMessage.value = '${DateTime.now().millisecondsSinceEpoch}|$message';
  }

  Future<void> dispose() async {
    await _foregroundSubscription?.cancel();
    await _tokenRefreshSubscription?.cancel();
  }
}
