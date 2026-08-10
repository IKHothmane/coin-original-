  import 'dart:async';
import 'package:flutter/material.dart';
import 'package:coin_original_mobile/models/user_model.dart';
import 'package:coin_original_mobile/services/auth_service.dart';
import 'package:coin_original_mobile/services/firebase_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();

  UserModel? _user;
  bool _isLoading = false;
  String? _error;
  bool _isAdminSessionActive = false;
  int _authStateReloadLock = 0;
  final Completer<void> _initCompleter = Completer<void>();

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  bool get isAdmin => _user?.isAdmin ?? false;
  bool get isAdminSessionActive => _isAdminSessionActive;
  Future<void> get initializationComplete => _initCompleter.future;

  AuthProvider() {
    _checkAuthState();
  }

  void _checkAuthState() {
    FirebaseService.auth.authStateChanges().listen((firebaseUser) async {
      if (_authStateReloadLock > 0) return;

      try {
        if (firebaseUser != null) {
          if (_user?.id == firebaseUser.uid) return;
          _user = await _authService.getUserData(firebaseUser.uid);
        } else {
          _user = null;
          _isAdminSessionActive = false;
        }
      } catch (e) {
        _user = null;
        _isAdminSessionActive = false;
      } finally {
        if (!_initCompleter.isCompleted) {
          _initCompleter.complete();
        }
        notifyListeners();
      }
    });
  }

  Future<T> _withAuthStateReloadLock<T>(Future<T> Function() action) async {
    _authStateReloadLock++;
    try {
      return await action();
    } finally {
      _authStateReloadLock--;
    }
  }

  Future<bool> signUp({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    _setLoading(true);
    _error = null;

    try {
      _user = await _withAuthStateReloadLock(
        () => _authService.signUp(
          name: name,
          email: email,
          password: password,
          phone: phone,
        ),
      );
      _setLoading(false);
      return _user != null;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<bool> signIn({
    required String email,
    required String password,
  }) async {
    _setLoading(true);
    _error = null;

    try {
      _user = await _withAuthStateReloadLock(
        () => _authService.signIn(
          email: email,
          password: password,
        ),
      );
      if (!isAdmin) {
        _isAdminSessionActive = false;
      }
      _setLoading(false);
      return _user != null;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<bool> signInWithGoogle() async {
    _setLoading(true);
    _error = null;

    try {
      _user = await _withAuthStateReloadLock(_authService.signInWithGoogle);
      if (!isAdmin) {
        _isAdminSessionActive = false;
      }
      _setLoading(false);
      if (_user == null) {
        _error = 'Connexion Google impossible';
        notifyListeners();
        return false;
      }
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<bool> signInWithApple() async {
    _setLoading(true);
    _error = null;

    try {
      _user = await _withAuthStateReloadLock(_authService.signInWithApple);
      if (!isAdmin) {
        _isAdminSessionActive = false;
      }
      _setLoading(false);
      if (_user == null) {
        _error = 'Connexion Apple impossible';
        notifyListeners();
        return false;
      }
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<bool> deleteAccount({String? password}) async {
    _setLoading(true);
    _error = null;

    try {
      await _withAuthStateReloadLock(
        () => _authService.deleteAccount(password: password),
      );
      _user = null;
      _isAdminSessionActive = false;
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<void> signOut() async {
    await _authService.signOut();
    _user = null;
    _isAdminSessionActive = false;
    notifyListeners();
  }

  void setAdminSessionActive(bool value) {
    if (_isAdminSessionActive == value) return;
    _isAdminSessionActive = value;
    notifyListeners();
  }

  Future<bool> updateProfile(Map<String, dynamic> data) async {
    if (_user == null) return false;

    _setLoading(true);
    try {
      await _authService.updateUserProfile(_user!.id, data);
      _user = await _authService.getUserData(_user!.id);
      _setLoading(false);
      return true;
    } catch (e) {
      _error = e.toString();
      _setLoading(false);
      return false;
    }
  }

  Future<void> resetPassword(String email) async {
    await _authService.resetPassword(email);
  }

  Future<List<UserModel>> getClients() async {
    return _authService.getClients();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}
