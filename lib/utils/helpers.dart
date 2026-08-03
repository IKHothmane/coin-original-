import 'package:intl/intl.dart';

class Helpers {
  static String formatPrice(double price) {
    final formatter = NumberFormat.decimalPatternDigits(
      locale: 'fr_FR',
      decimalDigits: 2,
    );
    return '${formatter.format(price)} DH';
  }

  static String formatDate(DateTime date) {
    final formatter = DateFormat('dd/MM/yyyy HH:mm', 'fr_FR');
    return formatter.format(date);
  }

  static String formatDateShort(DateTime date) {
    final formatter = DateFormat('dd/MM/yyyy', 'fr_FR');
    return formatter.format(date);
  }

  static String truncateText(String text, int maxLength) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength)}...';
  }
}
