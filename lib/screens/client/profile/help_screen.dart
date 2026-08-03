import 'package:flutter/material.dart';

const double _kScale = 0.8;
double _s(double value) => value * _kScale;

class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});

  final List<Map<String, String>> _faqs = const [
    {
      'question': 'Comment passer une commande ?',
      'answer': 'Parcourez les produits, ajoutez-les au panier, puis validez votre commande depuis le panier.',
    },
    {
      'question': 'Comment suivre ma commande ?',
      'answer': 'Vous recevrez une notification a chaque etape de votre commande.',
    },
    {
      'question': 'Comment modifier mon profil ?',
      'answer': 'Rendez-vous dans l\'onglet Profil, puis appuyez sur le crayon pour modifier vos informations.',
    },
    {
      'question': 'Comment contacter le support ?',
      'answer': 'Utilisez le bouton "Contacter le support" en bas de cette page.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F7),
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
        title: Text(
          'Aide',
          style: TextStyle(
            color: Colors.black,
            fontSize: _s(24),
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(_s(20)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(_s(20)),
              decoration: BoxDecoration(
                color: const Color(0xFFFF6A00),
                borderRadius: BorderRadius.circular(_s(16)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Besoin d\'aide ?',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: _s(22),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: _s(8)),
                  Text(
                    'Consultez les questions frequentes ou contactez notre support.',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.9),
                      fontSize: _s(14),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: _s(24)),
            Text(
              'Questions frequentes',
              style: TextStyle(
                fontSize: _s(18),
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            SizedBox(height: _s(16)),
            ..._faqs.map((faq) => _buildFaqItem(faq['question']!, faq['answer']!)),
            SizedBox(height: _s(24)),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _showContactSupport(context),
                icon: Icon(Icons.chat_bubble_outline, size: _s(20)),
                label: Text(
                  'Contacter le support',
                  style: TextStyle(fontSize: _s(16), fontWeight: FontWeight.w600),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFF6A00),
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: _s(16)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(_s(12)),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFaqItem(String question, String answer) {
    return Container(
      margin: EdgeInsets.only(bottom: _s(12)),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(_s(12)),
      ),
      child: ExpansionTile(
        iconColor: const Color(0xFFFF6A00),
        collapsedIconColor: Colors.grey.shade400,
        title: Text(
          question,
          style: TextStyle(
            fontSize: _s(15),
            fontWeight: FontWeight.w600,
            color: Colors.black,
          ),
        ),
        children: [
          Padding(
            padding: EdgeInsets.fromLTRB(_s(16), 0, _s(16), _s(16)),
            child: Text(
              answer,
              style: TextStyle(
                fontSize: _s(14),
                color: Colors.grey.shade700,
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  static void _showContactSupport(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Contacter le support'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Email : support@coinoriginal.ma'),
            SizedBox(height: 8),
            Text('Telephone : +212 6 12 34 56 78'),
            SizedBox(height: 8),
            Text('Disponible : 7j/7 de 9h a 18h.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }
}
