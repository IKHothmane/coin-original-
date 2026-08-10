import 'package:firebase_core/firebase_core.dart';

class FirebaseConfig {
  /// Web Client ID (OAuth client type 3) required for Google Sign-In + Firebase Auth on Android/iOS.
  static const String googleWebClientId =
      '161781855982-d9jtula3k9bmisfk1i05sikin3l6embp.apps.googleusercontent.com';

  static Future<void> initialize() async {
    await Firebase.initializeApp(
      options: const FirebaseOptions(
        apiKey: 'AIzaSyAmcrcFtWQr72eFXhXYwuRvFXSYWjTosTM',
        appId: '1:161781855982:android:0f8ad570a039bf802765ff',
        messagingSenderId: '161781855982',
        projectId: 'chrono-e0636',
        storageBucket: 'chrono-e0636.firebasestorage.app',
      ),
    );
  }
}
