import 'dart:io' show Platform;

import 'package:flutter/foundation.dart' show kIsWeb;

bool get supportsAppleSignIn => !kIsWeb && Platform.isIOS;
