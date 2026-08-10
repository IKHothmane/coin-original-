import 'package:flutter_test/flutter_test.dart';
import 'package:coin_original_mobile/utils/validators.dart';

void main() {
  group('Validators Tests', () {
    test('validateEmail', () {
      expect(Validators.validateEmail(''), 'L\'email est requis');
      expect(Validators.validateEmail(null), 'L\'email est requis');
      expect(Validators.validateEmail('invalid-email'), 'Email invalide');
      expect(Validators.validateEmail('user@domain.com'), isNull);
    });

    test('validatePassword', () {
      expect(Validators.validatePassword(''), 'Le mot de passe est requis');
      expect(Validators.validatePassword(null), 'Le mot de passe est requis');
      expect(Validators.validatePassword('12345'), 'Minimum 6 caractères');
      expect(Validators.validatePassword('123456'), isNull);
    });

    test('validateConfirmPassword', () {
      expect(Validators.validateConfirmPassword('', 'password'), 'Veuillez confirmer le mot de passe');
      expect(Validators.validateConfirmPassword('wrong', 'password'), 'Les mots de passe ne correspondent pas');
      expect(Validators.validateConfirmPassword('password', 'password'), isNull);
    });

    test('validateName', () {
      expect(Validators.validateName(''), 'Le nom est requis');
      expect(Validators.validateName('A'), 'Nom trop court');
      expect(Validators.validateName('Bob'), isNull);
    });

    test('validatePhone', () {
      expect(Validators.validatePhone(''), 'Le téléphone est requis');
      expect(Validators.validatePhone('123'), 'Numéro invalide');
      expect(Validators.validatePhone('+33612345678'), isNull);
    });
  });
}
