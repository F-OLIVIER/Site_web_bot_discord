// Import module
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:la_nuit_blanche/no_internet.dart';

// Fichier annexe
import 'package:la_nuit_blanche/home_not_connected.dart';
import 'package:la_nuit_blanche/login.dart';
import 'package:la_nuit_blanche/storage.dart';
import 'package:la_nuit_blanche/notification.dart';
import 'package:la_nuit_blanche/home_connected.dart';
import 'package:la_nuit_blanche/caserne.dart';
import 'package:la_nuit_blanche/character_card.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Maison La Nuit Blanche',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
            seedColor: const Color.fromARGB(255, 252, 110, 110)),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/login': (context) => const LoginPage(),
        '/home': (context) => const HomePage(),
        '/caserne': (context) => const Caserne(),
        '/fichepersonnage': (context) => const FichePersonnagePage(),
        '/no_internet': (context) => const NoInternetPage(),
      },
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    try {
      File file = await getLocalFile();
      bool fileExists = await file.exists();
      Map<String, bool>? result;

      if (fileExists) {
        final data = await readJson();
        if (mounted) {
          // Actualisation du stockage + vérification du code d'autorisation
          result = await sendCodeToServer(
            context,
            data['UserInfo']['CodeApp'],
            false,
            tofetch: 'user',
          );
        }

        if (result != null && result['Internet'] == false) {
          if (mounted) {
            Navigator.pushReplacementNamed(context, '/no_internet');
          }
          return;
        }

        // Traitement des informations
        if (result != null && result['Logged'] == true) {
          // Code valide, utilisateur connecté => Redirection vers la page principale
          if (mounted) {
            Navigator.pushReplacementNamed(context, '/home');
          }
          return;
        } else {
          // Code NON valide, utilisateur NON connecté => Redirection vers la page de connexion
          if (mounted) {
            Navigator.pushReplacementNamed(context, '/login');
          }
          return;
        }
      } else {
        if (mounted) {
          Navigator.pushReplacementNamed(context, '/login');
        }
        return;
      }
    } catch (e) {
      // print('Error during login check: $e');
      if (mounted) {
        showErrorNotification(context, 'Erreur interne');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}
