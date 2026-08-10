import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:coin_original_mobile/utils/auth_flow.dart';
import 'package:coin_original_mobile/utils/constants.dart';
import 'package:coin_original_mobile/utils/platform_utils.dart';
import 'package:coin_original_mobile/utils/routes.dart';
import 'package:coin_original_mobile/utils/validators.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

const double _kLoginScale = 0.8;
double _ls(double value) => value * _kLoginScale;

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _obscure = true;
  bool _remember = true;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();
    authProvider.setAdminSessionActive(false);
    final success = await authProvider.signIn(
      email: _emailCtrl.text.trim(),
      password: _passCtrl.text,
    );

    if (!mounted) return;

    if (success) {
      await handleAuthSuccess(context, authProvider);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(_ls(24)),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                IconButton(
                  onPressed: () {
                    Navigator.pushReplacementNamed(context, AppRoutes.home);
                  },
                  icon: Icon(
                    Icons.arrow_back_ios_new_rounded,
                    color: Colors.black,
                    size: _ls(20),
                  ),
                  padding: EdgeInsets.zero,
                  constraints: BoxConstraints(
                    minWidth: _ls(32),
                    minHeight: _ls(32),
                  ),
                ),
                SizedBox(height: _ls(18)),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(_ls(18)),
                      child: Image.asset(
                        AppAssets.logo,
                        width: _ls(60),
                        height: _ls(60),
                        fit: BoxFit.cover,
                      ),
                    ),
                    SizedBox(width: _ls(12)),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Coin',
                          style: TextStyle(
                            fontSize: _ls(28),
                            fontWeight: FontWeight.w800,
                            height: 1,
                            color: Colors.black,
                          ),
                        ),
                        Text(
                          'Original',
                          style: TextStyle(
                            fontSize: _ls(28),
                            fontWeight: FontWeight.w800,
                            height: 1,
                            color: Colors.black,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                SizedBox(height: _ls(32)),
                Text(
                  'Bonjour',
                  style: TextStyle(
                    fontSize: _ls(28),
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: _ls(8)),
                Text(
                  'Connectez-vous a votre compte',
                  style: TextStyle(
                    fontSize: _ls(14),
                    color: Colors.grey.shade600,
                  ),
                ),
                SizedBox(height: _ls(32)),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Email ou numero de telephone',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: _ls(14),
                      color: Colors.black,
                    ),
                  ),
                ),
                SizedBox(height: _ls(8)),
                TextFormField(
                  controller: _emailCtrl,
                  validator: Validators.validateEmail,
                  keyboardType: TextInputType.emailAddress,
                  style: TextStyle(color: Colors.black, fontSize: _ls(14)),
                  decoration: InputDecoration(
                    hintText: 'votre@email.com',
                    prefixIcon: Icon(
                      Icons.email_outlined,
                      color: Colors.grey.shade500,
                      size: _ls(24),
                    ),
                    hintStyle: TextStyle(fontSize: _ls(14)),
                    filled: true,
                    fillColor: const Color(0xFFF8F9FA),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(_ls(12)),
                      borderSide: BorderSide(color: Colors.grey.shade300),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(_ls(12)),
                      borderSide: BorderSide(color: Colors.grey.shade300),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(_ls(12))),
                      borderSide: BorderSide(
                        color: Color(0xFFFF6A00),
                        width: _ls(1.2),
                      ),
                    ),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: _ls(16),
                      vertical: _ls(14),
                    ),
                  ),
                ),
                SizedBox(height: _ls(20)),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Mot de passe',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: _ls(14),
                      color: Colors.black,
                    ),
                  ),
                ),
                SizedBox(height: _ls(8)),
                TextFormField(
                  controller: _passCtrl,
                  validator: Validators.validatePassword,
                  obscureText: _obscure,
                  style: TextStyle(color: Colors.black, fontSize: _ls(14)),
                  decoration: InputDecoration(
                    hintText: '••••••••',
                    prefixIcon: Icon(
                      Icons.lock_outline,
                      color: Colors.grey.shade500,
                      size: _ls(24),
                    ),
                    hintStyle: TextStyle(fontSize: _ls(14)),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscure
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                        size: _ls(22),
                      ),
                      onPressed: () => setState(() => _obscure = !_obscure),
                    ),
                    filled: true,
                    fillColor: const Color(0xFFF8F9FA),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(_ls(12)),
                      borderSide: BorderSide(color: Colors.grey.shade300),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(_ls(12)),
                      borderSide: BorderSide(color: Colors.grey.shade300),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.all(Radius.circular(_ls(12))),
                      borderSide: BorderSide(
                        color: Color(0xFFFF6A00),
                        width: _ls(1.2),
                      ),
                    ),
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: _ls(16),
                      vertical: _ls(14),
                    ),
                  ),
                ),
                SizedBox(height: _ls(16)),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Checkbox(
                          value: _remember,
                          activeColor: const Color(0xFFFF6A00),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(_ls(4)),
                          ),
                          onChanged: (value) =>
                              setState(() => _remember = value ?? true),
                        ),
                        Text(
                          'Se souvenir de moi',
                          style: TextStyle(
                            fontSize: _ls(13),
                            color: Colors.black,
                          ),
                        ),
                      ],
                    ),
                    TextButton(
                      onPressed: () {},
                      child: const Text(
                        'Mot de passe oublie?',
                        style: TextStyle(
                          color: Color(0xFFFF6A00),
                          fontSize: 10.4,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: _ls(12)),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: authProvider.isLoading ? null : _login,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF6A00),
                      padding: EdgeInsets.symmetric(vertical: _ls(16)),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(_ls(12)),
                      ),
                    ),
                    child: authProvider.isLoading
                        ? SizedBox(
                            width: _ls(20),
                            height: _ls(20),
                            child: CircularProgressIndicator(
                              strokeWidth: _ls(2),
                              valueColor:
                                  AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : Text(
                            'Se connecter',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: _ls(16),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                ),
                SizedBox(height: _ls(20)),
                Row(
                  children: [
                    Expanded(child: Divider(color: Colors.grey.shade300)),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: _ls(12)),
                      child: Text(
                        'ou continuer avec',
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: _ls(13),
                        ),
                      ),
                    ),
                    Expanded(child: Divider(color: Colors.grey.shade300)),
                  ],
                ),
                SizedBox(height: _ls(20)),
                _SocialButton(
                  icon: 'G',
                  label: 'Continuer avec Google',
                  onPressed: authProvider.isLoading
                      ? null
                      : () => signInWithGoogle(context),
                ),
                if (supportsAppleSignIn) ...[
                  SizedBox(height: _ls(12)),
                  _SocialButton(
                    icon: '',
                    label: 'Continuer avec Apple',
                    leading: Icon(Icons.apple, size: _ls(22), color: Colors.black),
                    onPressed: authProvider.isLoading
                        ? null
                        : () => signInWithApple(context),
                  ),
                ],
                SizedBox(height: _ls(24)),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Pas encore de compte? ',
                      style: TextStyle(
                        color: Colors.grey.shade700,
                        fontSize: _ls(14),
                      ),
                    ),
                    GestureDetector(
                      onTap: () =>
                          Navigator.pushNamed(context, AppRoutes.register),
                      child: Text(
                        'S\'inscrire',
                        style: TextStyle(
                          color: Color(0xFFFF6A00),
                          fontWeight: FontWeight.bold,
                          fontSize: _ls(14),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SocialButton extends StatelessWidget {
  final String icon;
  final String label;
  final VoidCallback? onPressed;
  final Widget? leading;

  const _SocialButton({
    required this.icon,
    required this.label,
    this.onPressed,
    this.leading,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          padding: EdgeInsets.symmetric(vertical: _ls(14)),
          side: BorderSide(color: Colors.grey.shade300),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(_ls(12)),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (leading != null)
              leading!
            else
              Text(
                icon,
                style: TextStyle(
                  fontSize: _ls(20),
                  color: Colors.black,
                  fontWeight: FontWeight.w700,
                ),
              ),
            SizedBox(width: _ls(12)),
            Text(
              label,
              style: TextStyle(
                color: Colors.black87,
                fontWeight: FontWeight.w600,
                fontSize: _ls(14),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
