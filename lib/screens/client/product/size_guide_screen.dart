import 'package:flutter/material.dart';
import 'package:coin_original_mobile/widgets/app_back_button.dart';

const double _kScale = 0.8;

double _s(double value) => value * _kScale;

class SizeGuideScreen extends StatefulWidget {
  const SizeGuideScreen({super.key});

  @override
  State<SizeGuideScreen> createState() => _SizeGuideScreenState();
}

class _SizeGuideScreenState extends State<SizeGuideScreen> {
  int selectedTab = 0;

  final List<Map<String, String>> hommeSizes = [
    {'EU': '38', 'US': '6.5', 'UK': '5.5', 'CM': '24.0'},
    {'EU': '39', 'US': '7', 'UK': '6', 'CM': '24.5'},
    {'EU': '40', 'US': '7.5', 'UK': '6.5', 'CM': '25.0'},
    {'EU': '41', 'US': '8.5', 'UK': '7.5', 'CM': '26.0'},
    {'EU': '42', 'US': '9', 'UK': '8', 'CM': '26.5'},
    {'EU': '43', 'US': '10', 'UK': '9', 'CM': '27.5'},
    {'EU': '44', 'US': '10.5', 'UK': '9.5', 'CM': '28.0'},
    {'EU': '45', 'US': '11', 'UK': '10', 'CM': '28.5'},
    {'EU': '46', 'US': '12', 'UK': '11', 'CM': '29.5'},
  ];

  final List<Map<String, String>> femmeSizes = [
    {'EU': '35.5', 'US': '5.5', 'UK': '3', 'CM': '22.5'},
    {'EU': '36', 'US': '6', 'UK': '3.5', 'CM': '23.0'},
    {'EU': '36.5', 'US': '6.5', 'UK': '4', 'CM': '23.5'},
    {'EU': '37.5', 'US': '7', 'UK': '4.5', 'CM': '24.0'},
    {'EU': '38', 'US': '7.5', 'UK': '5', 'CM': '24.5'},
    {'EU': '38.5', 'US': '8', 'UK': '5.5', 'CM': '25.0'},
    {'EU': '39', 'US': '8.5', 'UK': '6', 'CM': '25.5'},
    {'EU': '40', 'US': '9', 'UK': '6.5', 'CM': '26.0'},
    {'EU': '41', 'US': '10', 'UK': '7.5', 'CM': '26.5'},
  ];

  final List<Map<String, String>> enfantSizes = [
    {'EU': '28', 'US': '11C', 'UK': '10C', 'CM': '17.0'},
    {'EU': '29', 'US': '12C', 'UK': '11C', 'CM': '18.0'},
    {'EU': '30', 'US': '13C', 'UK': '12C', 'CM': '19.0'},
    {'EU': '31', 'US': '13.5C', 'UK': '13C', 'CM': '19.5'},
    {'EU': '32', 'US': '1Y', 'UK': '13.5C', 'CM': '20.0'},
    {'EU': '33', 'US': '2Y', 'UK': '1', 'CM': '20.5'},
    {'EU': '34', 'US': '3Y', 'UK': '2', 'CM': '21.5'},
    {'EU': '35', 'US': '3.5Y', 'UK': '3', 'CM': '22.0'},
  ];

  List<Map<String, String>> get currentSizes {
    switch (selectedTab) {
      case 0:
        return hommeSizes;
      case 1:
        return femmeSizes;
      case 2:
        return enfantSizes;
      default:
        return hommeSizes;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        leading: AppBackButton(
          onTap: () => Navigator.pop(context),
          size: _s(20),
        ),
        title: const Text(
          'Guide des tailles',
          style: TextStyle(
            color: Colors.black,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.help_outline, color: Colors.black),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(_s(20)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildBrandHeader(),
              SizedBox(height: _s(20)),
              _buildTabSelector(),
              SizedBox(height: _s(24)),
              _buildSizeTable(),
              SizedBox(height: _s(12)),
              _buildDisclaimer(),
              SizedBox(height: _s(24)),
              _buildHowToMeasure(),
              SizedBox(height: _s(100)),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomButton(),
    );
  }

  Widget _buildBrandHeader() {
    return Row(
      children: [
        Image.asset(
          'assets/images/llogo.png',
          height: _s(20),
          fit: BoxFit.contain,
        ),
        SizedBox(width: _s(8)),
        Text(
          'Coin Original',
          style: TextStyle(fontSize: _s(14), color: Colors.grey.shade600),
        ),
      ],
    );
  }

  Widget _buildTabSelector() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(_s(12)),
      ),
      child: Row(
        children: [
          _buildTab('Homme', 0),
          _buildTab('Femme', 1),
          _buildTab('Enfant', 2),
        ],
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    final isSelected = selectedTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => selectedTab = index),
        child: Container(
          padding: EdgeInsets.symmetric(vertical: _s(12)),
          decoration: BoxDecoration(
            color: isSelected ? Colors.black : Colors.transparent,
            borderRadius: BorderRadius.circular(_s(12)),
          ),
          child: Center(
            child: Text(
              title,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.black,
                fontWeight: FontWeight.w600,
                fontSize: _s(14),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSizeTable() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Tableau de conversion des tailles',
          style: TextStyle(fontSize: 14.4, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: _s(12)),
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade200),
            borderRadius: BorderRadius.circular(_s(12)),
          ),
          child: Table(
            columnWidths: const {
              0: FlexColumnWidth(1),
              1: FlexColumnWidth(1),
              2: FlexColumnWidth(1),
              3: FlexColumnWidth(1),
            },
            children: [
              TableRow(
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(_s(12))),
                ),
                children: [
                  _buildTableCell('EU', isHeader: true),
                  _buildTableCell('US', isHeader: true),
                  _buildTableCell('UK', isHeader: true),
                  _buildTableCell('CM', isHeader: true),
                ],
              ),
              ...currentSizes.asMap().entries.map((entry) {
                final index = entry.key;
                final size = entry.value;
                final isLast = index == currentSizes.length - 1;
                return TableRow(
                  decoration: BoxDecoration(
                    border: isLast ? null : Border(bottom: BorderSide(color: Colors.grey.shade100)),
                  ),
                  children: [
                    _buildTableCell(size['EU']!),
                    _buildTableCell(size['US']!),
                    _buildTableCell(size['UK']!),
                    _buildTableCell(size['CM']!),
                  ],
                );
              }),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTableCell(String text, {bool isHeader = false}) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: _s(14), horizontal: _s(8)),
      child: Center(
        child: Text(
          text,
          style: TextStyle(
            fontSize: _s(14),
            fontWeight: isHeader ? FontWeight.bold : FontWeight.w500,
            color: isHeader ? Colors.black : Colors.grey.shade800,
          ),
        ),
      ),
    );
  }

  Widget _buildDisclaimer() {
    return Text(
      '* Les tailles sont indicatives. Nous vous recommandons de mesurer votre pied pour un confort optimal.',
      style: TextStyle(fontSize: _s(12), color: Colors.grey.shade600, height: 1.4),
    );
  }

  Widget _buildHowToMeasure() {
    return Container(
      padding: EdgeInsets.all(_s(16)),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade200),
        borderRadius: BorderRadius.circular(_s(12)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.straighten, size: _s(20), color: Colors.grey.shade800),
              SizedBox(width: _s(8)),
              const Text(
                'Comment mesurer votre pied',
                style: TextStyle(fontSize: 12.8, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          SizedBox(height: _s(16)),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 2,
                child: Column(
                  children: [
                    Image.asset(
                      'assets/images/foot_measurement_diagram.webp',
                      height: _s(120),
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) => Container(
                        height: _s(120),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(_s(10)),
                        ),
                        alignment: Alignment.center,
                        child: Icon(
                          Icons.accessibility_new,
                          size: _s(40),
                          color: Colors.grey.shade500,
                        ),
                      ),
                    ),
                    SizedBox(height: _s(8)),
                    Text(
                      'Mesurez du talon au bout du gros orteil',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: _s(11), color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ),
              SizedBox(width: _s(16)),
              Expanded(
                flex: 3,
                child: Column(
                  children: [
                    _buildStep('1', 'Placez votre pied a plat sur une feuille de papier.'),
                    SizedBox(height: _s(12)),
                    _buildStep('2', "Marquez le talon et l'extremite du plus long orteil."),
                    SizedBox(height: _s(12)),
                    _buildStep('3', 'Mesurez la distance en cm et referez-vous au tableau ci-dessus.'),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: _s(16)),
          Container(
            padding: EdgeInsets.all(_s(12)),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(_s(8)),
            ),
            child: Row(
              children: [
                Icon(Icons.info_outline, size: _s(18), color: Colors.blue.shade700),
                SizedBox(width: _s(8)),
                Expanded(
                  child: Text(
                    'Conseil : Mesurez votre pied en fin de journee pour une taille plus precise.',
                    style: TextStyle(fontSize: _s(12), color: Colors.blue.shade900),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStep(String number, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: _s(20),
          height: _s(20),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade400),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              number,
              style: TextStyle(fontSize: _s(11), fontWeight: FontWeight.bold),
            ),
          ),
        ),
        SizedBox(width: _s(8)),
        Expanded(
          child: Text(
            text,
            style: TextStyle(fontSize: _s(13), height: 1.4),
          ),
        ),
      ],
    );
  }

  Widget _buildBottomButton() {
    return Container(
      padding: EdgeInsets.all(_s(20)),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: ElevatedButton(
          onPressed: () => Navigator.pop(context),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.black,
            padding: EdgeInsets.symmetric(vertical: _s(16)),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(_s(12))),
          ),
          child: Text(
            'Valider ma taille',
            style: TextStyle(
              color: Colors.white,
              fontSize: _s(16),
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
