import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:coin_original_mobile/config/firebase_config.dart';
import 'package:coin_original_mobile/models/order_model.dart';
import 'package:coin_original_mobile/models/user_model.dart';
import 'package:coin_original_mobile/services/firebase_service.dart';
import 'package:coin_original_mobile/utils/enums.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:google_sign_in/google_sign_in.dart';

/// SHA-1 debug de cette machine — doit etre ajoutee dans Firebase Console.
const String _requiredDebugSha1 =
    'C0:AE:D5:5B:BE:0F:A0:CF:2F:95:53:EA:C4:2C:A6:53:D8:B1:EC:28';

class AuthService {
  final FirebaseAuth _auth = FirebaseService.auth;
  final _usersCollection = FirebaseService.firestore.collection('users');
  final _ordersCollection = FirebaseService.firestore.collection('orders');
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    serverClientId: FirebaseConfig.googleWebClientId,
  );

  Future<void> _debugReportGoogleAuth(
    String hypothesisId,
    String location,
    String msg,
    Map<String, Object?> data,
  ) async {
    debugPrint('[$hypothesisId] $location | $msg | $data');
  }

  Future<UserModel?> signUp({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    try {
      final credential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      final user = credential.user;
      if (user == null) return null;

      final userModel = UserModel(
        id: user.uid,
        name: name,
        email: email,
        phone: phone,
        createdAt: DateTime.now(),
      );

      await _usersCollection.doc(user.uid).set(userModel.toMap());
      return userModel;
    } on FirebaseAuthException catch (e) {
      throw _handleAuthError(e);
    }
  }

  Future<UserModel?> signIn({
    required String email,
    required String password,
  }) async {
    try {
      final credential = await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );

      final user = credential.user;
      if (user == null) return null;

      return await getUserData(user.uid);
    } on FirebaseAuthException catch (e) {
      throw _handleAuthError(e);
    }
  }

  Future<UserModel?> signInWithGoogle() async {
    try {
      await _debugReportGoogleAuth(
        'A',
        'lib/services/auth_service.dart:signInWithGoogle:start',
        'google sign-in started',
        {
          'isAlreadySignedIn': await _googleSignIn.isSignedIn(),
        },
      );
      final googleUser = await _googleSignIn.signIn();
      await _debugReportGoogleAuth(
        'A',
        'lib/services/auth_service.dart:signInWithGoogle:googleUser',
        'google sign-in result received',
        {
          'hasGoogleUser': googleUser != null,
          'id': googleUser?.id,
          'email': googleUser?.email,
          'displayName': googleUser?.displayName,
          'hasServerAuthCode':
              (googleUser?.serverAuthCode?.isNotEmpty ?? false),
        },
      );
      if (googleUser == null) {
        throw 'Connexion Google annulee par l\'utilisateur';
      }

      final googleAuth = await googleUser.authentication;
      await _debugReportGoogleAuth(
        'B',
        'lib/services/auth_service.dart:signInWithGoogle:googleAuth',
        'google auth tokens received',
        {
          'hasAccessToken': googleAuth.accessToken != null,
          'hasIdToken': googleAuth.idToken != null,
          'accessTokenLen': googleAuth.accessToken?.length,
          'idTokenLen': googleAuth.idToken?.length,
        },
      );

      if (googleAuth.idToken == null && googleAuth.accessToken == null) {
        throw 'Configuration Google invalide : aucun token recu. Verifiez le Web Client ID (SHA-1 sur Android) ou REVERSED_CLIENT_ID sur iOS.';
      }
      if (googleAuth.idToken == null) {
        throw 'Configuration Google invalide : ID Token manquant. Verifiez le Web Client ID dans Firebase (SHA-1 sur Android).';
      }

      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final userCredential = await _auth.signInWithCredential(credential);
      final firebaseUser = userCredential.user;
      await _debugReportGoogleAuth(
        'C',
        'lib/services/auth_service.dart:signInWithGoogle:firebaseCredential',
        'firebase credential exchange finished',
        {
          'hasFirebaseUser': firebaseUser != null,
          'uid': firebaseUser?.uid,
          'email': firebaseUser?.email,
          'isNewUser': userCredential.additionalUserInfo?.isNewUser,
          'providerId': userCredential.additionalUserInfo?.providerId,
        },
      );
      if (firebaseUser == null) {
        throw 'Echec de la connexion Firebase avec Google';
      }

      final existingDoc = await _usersCollection.doc(firebaseUser.uid).get();
      final existingData = existingDoc.data() ?? const <String, dynamic>{};
      final existingRole = UserRole.fromString(
        (existingData['role'] ?? 'client').toString(),
      );

      final userModel = UserModel(
        id: firebaseUser.uid,
        name: firebaseUser.displayName?.trim().isNotEmpty == true
            ? firebaseUser.displayName!.trim()
            : (firebaseUser.email ?? '').split('@').first,
        email: firebaseUser.email ?? '',
        phone: firebaseUser.phoneNumber,
        photoUrl: firebaseUser.photoURL,
        role: existingRole,
        addresses: existingDoc.exists
            ? UserModel.fromMap(existingData, firebaseUser.uid).addresses
            : const [],
        createdAt: existingDoc.exists
            ? UserModel.fromMap(existingData, firebaseUser.uid).createdAt
            : (firebaseUser.metadata.creationTime ?? DateTime.now()),
      );

      await _usersCollection.doc(firebaseUser.uid).set(
            userModel.toMap(),
            SetOptions(merge: true),
          );
      await _debugReportGoogleAuth(
        'D',
        'lib/services/auth_service.dart:signInWithGoogle:profileSaved',
        'user profile saved after google sign-in',
        {
          'uid': firebaseUser.uid,
          'docExistsBeforeSave': existingDoc.exists,
          'role': existingRole.value,
        },
      );

      return await getUserData(firebaseUser.uid);
    } on FirebaseAuthException catch (e) {
      await _debugReportGoogleAuth(
        'B',
        'lib/services/auth_service.dart:signInWithGoogle:firebaseAuthException',
        'firebase auth exception during google sign-in',
        {
          'code': e.code,
          'message': e.message,
        },
      );
      throw _handleAuthError(e);
    } on PlatformException catch (e) {
      await _debugReportGoogleAuth(
        'E',
        'lib/services/auth_service.dart:signInWithGoogle:platformException',
        'platform exception during google sign-in',
        {
          'code': e.code,
          'message': e.message,
          'details': e.details?.toString(),
        },
      );
      throw _mapGoogleSignInError(e);
    } catch (e, st) {
      await _debugReportGoogleAuth(
        'E',
        'lib/services/auth_service.dart:signInWithGoogle:genericException',
        'generic exception during google sign-in',
        {
          'type': e.runtimeType.toString(),
          'error': e.toString(),
          'stack': st.toString().split('\n').take(12).join('\n'),
        },
      );
      throw _mapGoogleSignInError(e, st);
    }
  }

  String _mapGoogleSignInError(Object error, [StackTrace? stackTrace]) {
    final text = error.toString();
    final isConfigError = text.contains('[16]') ||
        text.contains('reauth failed') ||
        text.contains('DEVELOPER_ERROR') ||
        text.contains('ApiException: 10') ||
        text.contains(': 10:') ||
        text.contains('sign_in_failed');

    if (isConfigError) {
      return 'Erreur config Google (SHA-1).\n'
          'Ajoutez dans Firebase la SHA-1 debug :\n'
          '$_requiredDebugSha1\n'
          'Puis re-telechargez google-services.json et faites flutter clean.';
    }

    if (error is PlatformException) {
      if (error.code == 'sign_in_canceled') {
        return 'Connexion Google annulee par l\'utilisateur';
      }
      return 'Connexion Google echouee (${error.code}) : ${error.message ?? text}';
    }

    if (error is String) {
      return error;
    }

    return 'Connexion Google impossible : $text';
  }

  Future<void> signOut() async {
    await _googleSignIn.signOut().catchError((_) => null);
    await _auth.signOut();
  }

  Future<UserModel?> getUserData(String uid) async {
    try {
      final doc = await _usersCollection.doc(uid).get();
      if (!doc.exists) {
        final fallbackUser = _buildFallbackUser(_auth.currentUser);
        if (fallbackUser != null) {
          await _usersCollection
              .doc(uid)
              .set(fallbackUser.toMap(), SetOptions(merge: true));
        }
        return fallbackUser;
      }

      final data = doc.data()!;
      final user = UserModel.fromMap(data, doc.id);
      if (!data.containsKey('role')) {
        await _usersCollection.doc(uid).set({
          'role': user.role.value,
        }, SetOptions(merge: true));
      }
      return user;
    } catch (e) {
      return _buildFallbackUser(_auth.currentUser);
    }
  }

  UserModel? _buildFallbackUser(User? firebaseUser) {
    if (firebaseUser == null) return null;

    final normalizedEmail = (firebaseUser.email ?? '').trim().toLowerCase();

    return UserModel(
      id: firebaseUser.uid,
      name: firebaseUser.displayName?.trim().isNotEmpty == true
          ? firebaseUser.displayName!.trim()
          : normalizedEmail.split('@').first,
      email: firebaseUser.email ?? '',
      phone: firebaseUser.phoneNumber,
      photoUrl: firebaseUser.photoURL,
      role: UserRole.client,
      createdAt: firebaseUser.metadata.creationTime ?? DateTime.now(),
    );
  }

  Future<void> updateUserProfile(String uid, Map<String, dynamic> data) async {
    await _usersCollection.doc(uid).update(data);
  }

  Future<List<UserModel>> getClients() async {
    final currentUser = _auth.currentUser;
    _logAdminClients(
      'getClients:start',
      {
        'hasCurrentUser': currentUser != null,
        'uid': currentUser?.uid,
        'email': currentUser?.email,
      },
    );

    if (currentUser == null) {
      _logAdminClients('getClients:no-current-user');
      throw 'Vous devez etre connecte pour ouvrir la liste des clients';
    }

    final currentUserDoc = await _usersCollection.doc(currentUser.uid).get();
    _logAdminClients(
      'getClients:current-user-doc',
      {
        'exists': currentUserDoc.exists,
        'data': currentUserDoc.data(),
      },
    );

    if (!currentUserDoc.exists) {
      _logAdminClients('getClients:missing-current-user-doc');
      throw 'Le document users/${currentUser.uid} est introuvable pour le compte admin connecte';
    }

    final currentUserModel =
        UserModel.fromMap(currentUserDoc.data()!, currentUserDoc.id);
    _logAdminClients(
      'getClients:current-user-role',
      {
        'role': currentUserModel.role.value,
        'isAdmin': currentUserModel.isAdmin,
      },
    );

    if (!currentUserModel.isAdmin) {
      _logAdminClients('getClients:not-admin');
      throw 'Le compte connecte n\'a pas le role admin dans Firestore';
    }

    try {
      _logAdminClients('getClients:reading-orders');
      final ordersSnapshot = await _ordersCollection.get();
      _logAdminClients(
        'getClients:orders-loaded',
        {
          'count': ordersSnapshot.docs.length,
        },
      );
      final orders = ordersSnapshot.docs
          .map((doc) => OrderModel.fromMap(doc.data(), doc.id))
          .toList();

      final registeredClients = _buildRegisteredClientsFromOrders(orders);
      _logAdminClients(
        'getClients:registered-clients-from-orders',
        {
          'count': registeredClients.length,
        },
      );

      final guestClients = _buildGuestClientsFromOrders(
        orders,
        registeredClients,
      );

      final clients = [...registeredClients, ...guestClients]
        ..sort(_compareUsersByDateDesc);
      _logAdminClients(
        'getClients:success',
        {
          'guestClients': guestClients.length,
          'totalClients': clients.length,
        },
      );

      return clients;
    } on FirebaseException catch (e) {
      _logAdminClients(
        'getClients:firebase-exception',
        {
          'code': e.code,
          'message': e.message,
          'plugin': e.plugin,
        },
      );
      if (e.code == 'permission-denied') {
        throw 'Firestore refuse la lecture des donnees admin. Verifiez les regles deployees et l\'acces de l\'admin a la collection orders.';
      }
      rethrow;
    }
  }

  Future<void> resetPassword(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
    } on FirebaseAuthException catch (e) {
      throw _handleAuthError(e);
    }
  }

  Stream<User?> get authStateChanges => _auth.authStateChanges();

  String _handleAuthError(FirebaseAuthException e) {
    switch (e.code) {
      case 'email-already-in-use':
        return 'Cet email est déjà utilisé';
      case 'invalid-email':
        return 'Email invalide';
      case 'weak-password':
        return 'Mot de passe trop faible (minimum 6 caractères)';
      case 'user-not-found':
        return 'Utilisateur non trouvé';
      case 'wrong-password':
        return 'Mot de passe incorrect';
      case 'user-disabled':
        return 'Ce compte a été désactivé';
      default:
        return 'Une erreur est survenue : ${e.message}';
    }
  }

  void _logAdminClients(String step, [Map<String, Object?> data = const {}]) {}
}

int _compareUsersByDateDesc(UserModel a, UserModel b) {
  final dateComparison = b.createdAt.compareTo(a.createdAt);
  if (dateComparison != 0) return dateComparison;
  return b.id.compareTo(a.id);
}

List<UserModel> _buildRegisteredClientsFromOrders(List<OrderModel> orders) {
  final clientsByKey = <String, UserModel>{};

  for (final order in orders) {
    if (_isGuestOrder(order)) continue;

    final userId = order.userId.trim();
    final name =
        order.userName.trim().isEmpty ? 'Client' : order.userName.trim();
    final email = order.userEmail.trim();
    final phone = (order.address?.phone ?? '').trim();

    final key = userId.isNotEmpty
        ? 'uid:$userId'
        : email.isNotEmpty
            ? 'email:${email.toLowerCase()}'
            : phone.isNotEmpty
                ? 'phone:$phone'
                : 'order:${order.id}';

    final client = UserModel(
      id: userId.isNotEmpty ? userId : 'ordered-client-${order.id}',
      name: name,
      email: email,
      phone: phone.isEmpty ? null : phone,
      createdAt: order.createdAt,
    );

    final existing = clientsByKey[key];
    if (existing == null || client.createdAt.isAfter(existing.createdAt)) {
      clientsByKey[key] = client;
    }
  }

  return clientsByKey.values.toList()..sort(_compareUsersByDateDesc);
}

const String _guestOrderPrefix = 'guest-';
const String _guestOrderUserPrefix = 'guest-order-';
const String _guestPlaceholderEmail = 'guest@coin-original.app';

List<UserModel> _buildGuestClientsFromOrders(
  List<OrderModel> orders,
  List<UserModel> registeredClients,
) {
  final knownEmails = registeredClients
      .map((user) => user.email.trim().toLowerCase())
      .where((email) => email.isNotEmpty)
      .toSet();
  final knownPhones = registeredClients
      .map((user) => (user.phone ?? '').trim())
      .where((phone) => phone.isNotEmpty)
      .toSet();

  final guestsByKey = <String, UserModel>{};

  for (final order in orders) {
    if (!_isGuestOrder(order)) continue;

    final phone = (order.address?.phone ?? '').trim();
    final email = order.userEmail.trim().toLowerCase();
    if (email.isNotEmpty &&
        email != _guestPlaceholderEmail &&
        knownEmails.contains(email)) {
      continue;
    }
    if (phone.isNotEmpty && knownPhones.contains(phone)) {
      continue;
    }

    final displayName =
        order.userName.trim().isEmpty ? 'Client invite' : order.userName.trim();
    final city = (order.address?.city ?? '').trim().toLowerCase();
    final key = phone.isNotEmpty
        ? 'phone:$phone'
        : 'name:${displayName.toLowerCase()}|city:$city';

    final guestClient = UserModel(
      id: '$_guestOrderUserPrefix${order.id}',
      name: displayName,
      email: email == _guestPlaceholderEmail ? '' : order.userEmail.trim(),
      phone: phone.isEmpty ? null : phone,
      createdAt: order.createdAt,
    );

    final existing = guestsByKey[key];
    if (existing == null || guestClient.createdAt.isAfter(existing.createdAt)) {
      guestsByKey[key] = guestClient;
    }
  }

  return guestsByKey.values.toList()..sort(_compareUsersByDateDesc);
}

bool _isGuestOrder(OrderModel order) {
  return order.userId.startsWith(_guestOrderPrefix) ||
      order.userEmail.trim().toLowerCase() == _guestPlaceholderEmail;
}
