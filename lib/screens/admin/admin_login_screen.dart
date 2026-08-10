import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:coin_original_mobile/utils/constants.dart';
import 'package:coin_original_mobile/utils/validators.dart';
import 'package:coin_original_mobile/widgets/custom_text_field.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

const double _kScale = 0.8;
double _s(double value) => value * _kScale;

class AdminLoginScreen extends StatefulWidget {
  final bool showBackButton;

  const AdminLoginScreen({
    super.key,
    this.showBackButton = false,
  });

  @override
  State<AdminLoginScreen> createState() => _AdminLoginScreenState();
}

class _AdminLoginScreenState extends State<AdminLoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController(text: 'mero@gmail.com');
  final _passwordController = TextEditingController(text: '123123');
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _loginAdmin() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();
    final success = await authProvider.signIn(
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );

    if (!mounted) return;

    if (!success) {
      return;
    }

    if (!authProvider.isAdmin) {
      authProvider.setAdminSessionActive(false);
      await authProvider.signOut();
      if (!mounted) return;
      return;
    }

    authProvider.setAdminSessionActive(true);
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: widget.showBackButton
          ? AppBar(
              backgroundColor: const Color(0xFFF8F9FA),
              elevation: 0,
              scrolledUnderElevation: 0,
              leading: IconButton(
                onPressed: () => Navigator.pop(context),
                icon:
                    Icon(Icons.arrow_back, color: Colors.black87, size: _s(24)),
              ),
            )
          : null,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(_s(24)),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(height: _s(24)),
                Center(
                  child: Image.asset(
                    AppAssets.logo,
                    width: _s(118),
                    height: _s(118),
                    fit: BoxFit.contain,
                  ),
                ),
                SizedBox(height: _s(22)),
                Text(
                  'Connexion Admin',
                  style: TextStyle(
                    fontSize: _s(28),
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                SizedBox(height: _s(8)),
                Text(
                  'Connectez-vous pour acceder a la partie administration',
                  style: TextStyle(
                    fontSize: _s(14),
                    color: Colors.black54,
                  ),
                ),
                SizedBox(height: _s(32)),
                CustomTextField(
                  label: AppStrings.email,
                  hint: 'admin@email.com',
                  controller: _emailController,
                  validator: Validators.validateEmail,
                  keyboardType: TextInputType.emailAddress,
                  textColor: Colors.black87,
                  prefixIcon:
                      const Icon(Icons.email_outlined, color: Colors.black54),
                ),
                SizedBox(height: _s(16)),
                CustomTextField(
                  label: AppStrings.password,
                  hint: 'Votre mot de passe admin',
                  controller: _passwordController,
                  validator: Validators.validatePassword,
                  obscureText: _obscurePassword,
                  textColor: Colors.black87,
                  prefixIcon:
                      const Icon(Icons.lock_outline, color: Colors.black54),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword
                          ? Icons.visibility_off
                          : Icons.visibility,
                      color: Colors.black54,
                    ),
                    onPressed: () =>
                        setState(() => _obscurePassword = !_obscurePassword),
                  ),
                ),
                SizedBox(height: _s(24)),
                SizedBox(
                  width: double.infinity,
                  height: _s(56),
                  child: ElevatedButton(
                    onPressed: authProvider.isLoading ? null : _loginAdmin,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF6A00),
                      foregroundColor: Colors.white,
                      disabledBackgroundColor: const Color(0xFFFF6A00),
                      disabledForegroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(_s(12)),
                      ),
                    ),
                    child: authProvider.isLoading
                        ? SizedBox(
                            width: _s(22),
                            height: _s(22),
                            child: const CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor:
                                  AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              'Connexion admin',
                              maxLines: 1,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: _s(15),
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                          ),
                  ),
                ),
                SizedBox(height: _s(18)),
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(_s(14)),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(_s(12)),
                    border: Border.all(color: const Color(0xFFE8E8E8)),
                  ),
                  child: Text(
                    'Seuls les comptes avec le role admin peuvent ouvrir le dashboard, les produits et les commandes.',
                    style: TextStyle(
                      fontSize: _s(13),
                      color: Colors.black54,
                      height: 1.45,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
