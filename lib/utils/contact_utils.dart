import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class AppContact {
  static const String whatsAppPhone = '0727541242';
  static const String instagramUsername = 'coinoriginal_';
  static const String instagramUrl =
      'https://www.instagram.com/$instagramUsername/?igsh=MTE3emZxbzQ2d3dlcA==';
}

class ContactUtils {
  static String normalizePhoneForWhatsApp(String phone) {
    final digits = phone.replaceAll(RegExp(r'[^0-9+]'), '');
    if (digits.startsWith('+')) {
      return digits.substring(1);
    }
    if (digits.startsWith('0')) {
      return '212${digits.substring(1)}';
    }
    return digits;
  }

  static Future<bool> openInstagram(BuildContext context) async {
    final candidates = <Uri>[
      Uri.parse('instagram://user?username=${AppContact.instagramUsername}'),
      Uri.parse('https://www.instagram.com/${AppContact.instagramUsername}/'),
      Uri.parse(AppContact.instagramUrl),
    ];

    for (final uri in candidates) {
      try {
        final launched = await launchUrl(
          uri,
          mode: LaunchMode.externalApplication,
        );
        if (launched) return true;
      } catch (_) {
        // Try next URI scheme.
      }
    }

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Impossible d\'ouvrir Instagram'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
    return false;
  }

  static Future<bool> openWhatsApp(
    BuildContext context, {
    String? phone,
    String? message,
  }) async {
    final normalizedPhone =
        normalizePhoneForWhatsApp(phone ?? AppContact.whatsAppPhone);
    final encodedMessage =
        message != null ? Uri.encodeComponent(message) : null;

    final candidates = <Uri>[
      if (encodedMessage != null)
        Uri.parse(
          'whatsapp://send?phone=$normalizedPhone&text=$encodedMessage',
        ),
      Uri.parse('whatsapp://send?phone=$normalizedPhone'),
      if (encodedMessage != null)
        Uri.parse(
          'https://api.whatsapp.com/send?phone=$normalizedPhone&text=$encodedMessage',
        ),
      Uri.parse('https://api.whatsapp.com/send?phone=$normalizedPhone'),
      Uri.parse('https://wa.me/$normalizedPhone'),
    ];

    for (final uri in candidates) {
      try {
        final launched = await launchUrl(
          uri,
          mode: LaunchMode.externalApplication,
        );
        if (launched) return true;
      } catch (_) {
        // Try next URI scheme.
      }
    }

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Impossible d\'ouvrir WhatsApp'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
    return false;
  }
}
