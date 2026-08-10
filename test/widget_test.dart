import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:coin_original_mobile/widgets/loading_indicator.dart';

void main() {
  testWidgets('LoadingIndicator shows message', (WidgetTester tester) async {
    await tester.pumpWidget(const MaterialApp(
      home: Scaffold(
        body: LoadingIndicator(message: 'Chargement en cours...'),
      ),
    ));

    expect(find.text('Chargement en cours...'), findsOneWidget);
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
}
