// Import module
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:internet_connection_checker_plus/internet_connection_checker_plus.dart';

// Fichier annexe
import 'package:la_nuit_blanche/config.dart';
import 'package:la_nuit_blanche/notification.dart';
import 'package:la_nuit_blanche/storage.dart';

Future<Map<String, bool>?> sendCodeToServer(BuildContext context, String code,
    {String tofetch = ''}) async {
  if (tofetch.isEmpty) {
    throw Exception(
        'L\'URL de récupération des données ne peut pas être vide (sendCodeToServer).');
  }

  // Corps de la requête
  final Map<String, String> requestBody = {
    'CodeApp': code,
  };

  try {
    // Vérifiez si l'utilisateur a une connexion Internet
    bool isConnected = await InternetConnection().hasInternetAccess;
    if (isConnected == false) {
      return {'Logged': false, 'Internet': false};
    }

    // Requéte
    final response = await http.post(
      Uri.parse('${Config.serverUrl}$tofetch'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(requestBody),
    );

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      // print('Response data: $responseData');

      if (responseData['Gestion']['Logged'] == true) {
        if (tofetch == 'login') {
          await writeJson(responseData);

          if (context.mounted) {
            Navigator.pushReplacementNamed(context, '/home');
          }
        }

        return {'Logged': true, 'Internet': true};
      } else if (context.mounted && tofetch == 'login') {
        showErrorNotification(context, 'Code invalide');

        await clearStorage();
        return {'Logged': false, 'Internet': true};
      } else {
        return {'Logged': false, 'Internet': true};
      }
    } else {
      // Erreur côté serveur
      // print('Server error: ${response.statusCode}');
      // print('Message: ${response.body}');
      if (context.mounted) {
        showErrorNotification(context, 'Erreur interne (code Lo_01)');
      }
      return {'Logged': false, 'Internet': true};
    }
  } catch (e) {
    // Gestion des erreurs réseau ou autres
    // print('\n\nError sending code: $e');
    if (context.mounted) {
      showErrorNotification(context, 'Erreur interne (code Lo_02)');
    }
    return {'Logged': false, 'Internet': true};
  }
}
