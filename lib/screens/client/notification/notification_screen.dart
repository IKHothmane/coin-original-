import 'package:coin_original_mobile/models/app_notification_model.dart';
import 'package:coin_original_mobile/providers/notifications_provider.dart';
import 'package:coin_original_mobile/widgets/app_back_button.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

const double _kScale = 0.8;
double _s(double value) => value * _kScale;

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<NotificationsProvider>(
      builder: (context, notificationsProvider, child) {
        final notifications = notificationsProvider.notifications;

        return Scaffold(
          backgroundColor: const Color(0xFFF8F8F8),
          appBar: AppBar(
            backgroundColor: Colors.white,
            surfaceTintColor: Colors.white,
            elevation: 0,
            leading: AppBackButton(
              onTap: () => Navigator.pop(context),
              size: _s(20),
            ),
            title: Text(
              'Notifications',
              style: TextStyle(
                color: Colors.black,
                fontSize: _s(24),
                fontWeight: FontWeight.bold,
              ),
            ),
            actions: [
              if (notifications.isNotEmpty)
                TextButton(
                  onPressed: notificationsProvider.markAllAsRead,
                  child: Text(
                    'Tout lire',
                    style: TextStyle(
                      color: const Color(0xFFF47A20),
                      fontSize: _s(13),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
            ],
          ),
          body: notifications.isEmpty
              ? _buildEmptyState()
              : ListView.separated(
                  padding: EdgeInsets.all(_s(16)),
                  itemCount: notifications.length,
                  separatorBuilder: (context, index) => SizedBox(height: _s(12)),
                  itemBuilder: (context, index) {
                    final notification = notifications[index];
                    return _buildNotificationCard(
                      context,
                      notification,
                      onTap: () => notificationsProvider.markAsRead(notification.id),
                      onDelete: () =>
                          notificationsProvider.deleteNotification(notification.id),
                    );
                  },
                ),
        );
      },
    );
  }

  Widget _buildNotificationCard(
    BuildContext context,
    AppNotificationModel notification, {
    required VoidCallback onTap,
    required VoidCallback onDelete,
  }) {
    return Dismissible(
      key: Key(notification.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: EdgeInsets.only(right: _s(20)),
        decoration: BoxDecoration(
          color: Colors.red,
          borderRadius: BorderRadius.circular(_s(16)),
        ),
        child: Icon(Icons.delete, color: Colors.white, size: _s(24)),
      ),
      onDismissed: (_) => onDelete(),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: EdgeInsets.all(_s(16)),
          decoration: BoxDecoration(
            color: notification.isRead
                ? Colors.white
                : const Color(0xFFE8F1FF),
            borderRadius: BorderRadius.circular(_s(16)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: _s(8),
                offset: Offset(0, _s(2)),
              ),
            ],
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildIcon(notification.type),
              SizedBox(width: _s(12)),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      notification.title,
                      style: TextStyle(
                        fontSize: _s(15),
                        fontWeight: notification.isRead
                            ? FontWeight.w500
                            : FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    SizedBox(height: _s(4)),
                    Text(
                      notification.body,
                      style: TextStyle(
                        fontSize: _s(13),
                        color: Colors.grey.shade700,
                      ),
                    ),
                    SizedBox(height: _s(6)),
                    Text(
                      _formatTime(notification.createdAt),
                      style: TextStyle(
                        fontSize: _s(12),
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
              if (!notification.isRead)
                Container(
                  width: _s(8),
                  height: _s(8),
                  decoration: const BoxDecoration(
                    color: Colors.blue,
                    shape: BoxShape.circle,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildIcon(AppNotificationType type) {
    return Container(
      width: _s(44),
      height: _s(44),
      decoration: BoxDecoration(
        color: type.backgroundColor,
        shape: BoxShape.circle,
      ),
      child: Icon(type.icon, color: Colors.black54, size: _s(22)),
    );
  }

  String _formatTime(DateTime value) {
    final now = DateTime.now();
    final diff = now.difference(value);

    if (diff.inMinutes < 1) return 'A l\'instant';
    if (diff.inMinutes < 60) return 'Il y a ${diff.inMinutes} min';
    if (diff.inHours < 24) return 'Il y a ${diff.inHours} h';
    if (diff.inDays == 1) return 'Hier';
    if (diff.inDays < 7) return 'Il y a ${diff.inDays} j';

    return DateFormat('dd/MM/yyyy HH:mm').format(value);
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_off_outlined,
            size: _s(80),
            color: Colors.grey.shade300,
          ),
          SizedBox(height: _s(16)),
          Text(
            'Aucune notification',
            style: TextStyle(fontSize: _s(18), color: Colors.grey.shade600),
          ),
          SizedBox(height: _s(8)),
          Text(
            'Les nouvelles commandes apparaitront ici',
            style: TextStyle(fontSize: _s(14), color: Colors.grey.shade500),
          ),
        ],
      ),
    );
  }
}
