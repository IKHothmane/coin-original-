import 'dart:io';

import 'package:flutter_local_notifications/flutter_local_notifications.dart';

const String _kOrdersChannelId = 'orders_sound_channel';
const String _kOrdersSoundName = 'slot_machine';
const String _kIosSoundName = 'slot_machine.caf';

class LocalNotificationService {
  LocalNotificationService._();

  static final LocalNotificationService instance = LocalNotificationService._();

  final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  bool _initialized = false;

  Future<void> initialize() async {
    if (_initialized) return;

    const androidSettings = AndroidInitializationSettings(
      '@mipmap/ic_launcher',
    );
    const darwinSettings = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
      defaultPresentAlert: true,
      defaultPresentBadge: true,
      defaultPresentSound: true,
    );
    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: darwinSettings,
      macOS: darwinSettings,
    );

    await _plugin.initialize(settings: initSettings);

    if (Platform.isAndroid) {
      final androidPlugin = _plugin.resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>();
      await androidPlugin?.requestNotificationsPermission();
      await androidPlugin?.createNotificationChannel(
        const AndroidNotificationChannel(
          _kOrdersChannelId,
          'Commandes',
          description: 'Notifications temps reel des nouvelles commandes',
          importance: Importance.max,
          sound: RawResourceAndroidNotificationSound(_kOrdersSoundName),
          playSound: true,
        ),
      );
    }

    _initialized = true;
  }

  Future<void> showOrderNotification({
    required String title,
    required String body,
    int id = 1001,
  }) async {
    await initialize();

    const details = NotificationDetails(
      android: AndroidNotificationDetails(
        _kOrdersChannelId,
        'Commandes',
        channelDescription: 'Notifications temps reel des nouvelles commandes',
        importance: Importance.max,
        priority: Priority.high,
        sound: RawResourceAndroidNotificationSound(_kOrdersSoundName),
        playSound: true,
      ),
      iOS: DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
        sound: _kIosSoundName,
      ),
      macOS: DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      ),
    );

    await _plugin.show(
      id: id,
      title: title,
      body: body,
      notificationDetails: details,
    );
  }
}
