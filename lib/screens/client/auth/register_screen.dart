import 'package:coin_original_mobile/providers/auth_provider.dart';
import 'package:coin_original_mobile/utils/auth_flow.dart';
import 'package:coin_original_mobile/utils/constants.dart';
import 'package:coin_original_mobile/utils/platform_utils.dart';
import 'package:coin_original_mobile/utils/routes.dart';
import 'package:coin_original_mobile/utils/validators.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

const double _kRegisterScale = 0.8;
double _rs(double value) => value * _kRegisterScale;

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.signUp(
      name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text,
      phone: _phoneController.text.trim(),
    );

    if (success && mounted) {
      Navigator.pushReplacementNamed(
        context,
        AppRoutes.home,
        arguments: {'initialTab': 4},
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(_rs(24)),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                IconButton(
                  onPressed: () {
                    if (Navigator.canPop(context)) {
                      Navigator.pop(context);
                      return;
                    }
                    Navigator.pushReplacementNamed(context, AppRoutes.home);
                  },
                  icon: Icon(
                    Icons.arrow_back_ios_new_rounded,
                    color: Colors.black,
                    size: _rs(20),
                  ),
                  padding: EdgeInsets.zero,
                  constraints: BoxConstraints(
                    minWidth: _rs(32),
                    minHeight: _rs(32),
                  ),
                ),
                SizedBox(height: _rs(18)),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(_rs(18)),
                      child: Image.asset(
                        AppAssets.logo,
                        width: _rs(60),
                        height: _rs(60),
                        fit: BoxFit.cover,
                      ),
                    ),
                    SizedBox(width: _rs(12)),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Coin',
                          style: TextStyle(
                            fontSize: _rs(28),
                            fontWeight: FontWeight.w800,
                            height: 1,
                            color: Colors.black,
                          ),
                        ),
                        Text(
                          'Original',
                          style: TextStyle(
                            fontSize: _rs(28),
                            fontWeight: FontWeight.w800,
                            height: 1,
                            color: Colors.black,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                SizedBox(height: _rs(32)),
                Text(
                  'Creer un compte',
                  style: TextStyle(
                    fontSize: _rs(28),
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: _rs(8)),
                Text(
                  'Inscrivez-vous pour commencer',
                  style: TextStyle(
                    fontSize: _rs(14),
                    color: Colors.grey.shade600,
                  ),
                ),
                SizedBox(height: _rs(32)),
                _AuthField(
                  label: 'Nom complet',
                  hint: 'Votre nom complet',
                  controller: _nameController,
                  validator: Validators.validateName,
                  prefixIcon: Icons.person_outline,
                ),
                SizedBox(height: _rs(16)),
                _AuthField(
                  label: 'Email',
                  hint: 'exemple@email.com',
                  controller: _emailController,
                  validator: Validators.validateEmail,
                  keyboardType: TextInputType.emailAddress,
                  prefixIcon: Icons.email_outlined,
                ),
                SizedBox(height: _rs(16)),
                _AuthField(
                  label: 'Telephone',
                  hint: '+212 6 12 34 56 78',
                  controller: _phoneController,
                  validator: Validators.validatePhone,
                  keyboardType: TextInputType.phone,
                  prefixIcon: Icons.phone_outlined,
                ),
                SizedBox(height: _rs(16)),
                _AuthField(
                  label: 'Mot de passe',
                  hint: 'Minimum 6 caractères',
                  controller: _passwordController,
                  validator: Validators.validatePassword,
                  obscureText: _obscurePassword,
                  prefixIcon: Icons.lock_outline,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      color: Colors.grey.shade500,
                      size: _rs(22),
                    ),
                    onPressed: () =>
                        setState(() => _obscurePassword = !_obscurePassword),
                  ),
                ),
                SizedBox(height: _rs(16)),
                _AuthField(
                  label: 'Confirmer le mot de passe',
                  hint: 'Confirmez votre mot de passe',
                  controller: _confirmPasswordController,
                  validator: (value) => Validators.validateConfirmPassword(
                    value,
                    _passwordController.text,
                  ),
                  obscureText: _obscureConfirmPassword,
                  prefixIcon: Icons.lock_outline,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscureConfirmPassword
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      color: Colors.grey.shade500,
                      size: _rs(22),
                    ),
                    onPressed: () => setState(
                      () => _obscureConfirmPassword = !_obscureConfirmPassword,
                    ),
                  ),
                ),
                SizedBox(height: _rs(32)),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: authProvider.isLoading ? null : _register,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF6A00),
                      padding: EdgeInsets.symmetric(vertical: _rs(16)),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(_rs(12)),
                      ),
                    ),
                    child: authProvider.isLoading
                        ? SizedBox(
                            width: _rs(20),
                            height: _rs(20),
                            child: CircularProgressIndicator(
                              strokeWidth: _rs(2),
                              valueColor: const AlwaysStoppedAnimation<Color>(
                                  Colors.white),
                            ),
                          )
                        : Text(
                            'S\'inscrire',
                            style: TextStyle(
                              fontSize: _rs(16),
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                  ),
                ),
                SizedBox(height: _rs(20)),
                Row(
                  children: [
                    Expanded(child: Divider(color: Colors.grey.shade300)),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: _rs(12)),
                      child: Text(
                        'ou continuer avec',
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: _rs(13),
                        ),
                      ),
                    ),
                    Expanded(child: Divider(color: Colors.grey.shade300)),
                  ],
                ),
                SizedBox(height: _rs(20)),
                _SocialButton(
                  icon: 'G',
                  label: 'S\'inscrire avec Google',
                  onPressed: authProvider.isLoading
                      ? null
                      : () => signInWithGoogle(context),
                ),
                if (supportsAppleSignIn) ...[
                  SizedBox(height: _rs(12)),
                  _SocialButton(
                    icon: '',
                    label: 'S\'inscrire avec Apple',
                    leading: Icon(Icons.apple, size: _rs(22), color: Colors.black),
                    onPressed: authProvider.isLoading
                        ? null
                        : () => signInWithApple(context),
                  ),
                ],
                SizedBox(height: _rs(24)),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Vous avez deja un compte ?',
                      style: TextStyle(
                        color: Colors.grey.shade700,
                        fontSize: _rs(14),
                      ),
                    ),
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: Text(
                        'Se connecter',
                        style: TextStyle(
                          fontSize: _rs(14),
                          color: const Color(0xFFFF6A00),
                          fontWeight: FontWeight.bold,
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
          padding: EdgeInsets.symmetric(vertical: _rs(14)),
          side: BorderSide(color: Colors.grey.shade300),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(_rs(12)),
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
                  fontSize: _rs(20),
                  color: Colors.black,
                  fontWeight: FontWeight.w700,
                ),
              ),
            SizedBox(width: _rs(12)),
            Text(
              label,
              style: TextStyle(
                color: Colors.black87,
                fontWeight: FontWeight.w600,
                fontSize: _rs(14),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AuthField extends StatelessWidget {
  final String label;
  final String hint;
  final TextEditingController controller;
  final String? Function(String?)? validator;
  final TextInputType keyboardType;
  final bool obscureText;
  final IconData prefixIcon;
  final Widget? suffixIcon;

  const _AuthField({
    required this.label,
    required this.hint,
    required this.controller,
    required this.validator,
    required this.prefixIcon,
    this.keyboardType = TextInputType.text,
    this.obscureText = false,
    this.suffixIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: _rs(14),
            color: Colors.black,
          ),
        ),
        SizedBox(height: _rs(8)),
        TextFormField(
          controller: controller,
          validator: validator,
          keyboardType: keyboardType,
          obscureText: obscureText,
          style: TextStyle(
            color: Colors.black,
            fontSize: _rs(14),
          ),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(fontSize: _rs(14)),
            prefixIcon: Icon(
              prefixIcon,
              color: Colors.grey.shade500,
              size: _rs(24),
            ),
            suffixIcon: suffixIcon,
            filled: true,
            fillColor: const Color(0xFFF8F9FA),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(_rs(12)),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(_rs(12)),
              borderSide: BorderSide(color: Colors.grey.shade300),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(_rs(12)),
              borderSide: BorderSide(
                color: const Color(0xFFFF6A00),
                width: _rs(1.2),
              ),
            ),
            contentPadding: EdgeInsets.symmetric(
              horizontal: _rs(16),
              vertical: _rs(14),
            ),
          ),
        ),
      ],
    );
  }
}
