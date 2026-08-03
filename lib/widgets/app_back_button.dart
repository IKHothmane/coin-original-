import 'package:flutter/material.dart';

class AppBackButton extends StatelessWidget {
  final VoidCallback onTap;
  final double? size;

  const AppBackButton({
    super.key,
    required this.onTap,
    this.size,
  });

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(
        Icons.arrow_back,
        color: Colors.black,
        size: size,
      ),
      onPressed: onTap,
    );
  }
}
