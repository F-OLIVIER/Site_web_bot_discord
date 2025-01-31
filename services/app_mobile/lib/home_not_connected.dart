// Import module
import 'package:flutter/material.dart';

// Fichier annexe
import 'package:la_nuit_blanche/login.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _codeController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    // Obtenir la largeur de l'écran
    double screenWidth = MediaQuery.of(context).size.width;
    double containerWidth = screenWidth * 0.9; // 80% de la largeur de l'écran

    return Scaffold(
      // En-tête
      appBar: AppBar(
        title: const Text(
          'Maison La Nuit Blanche',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
            shadows: [
              Shadow(
                offset: Offset(2.0, 2.0),
                blurRadius: 4.0,
                color: Color.fromARGB(128, 0, 0, 0),
              ),
            ],
          ),
        ),
        centerTitle: true,
        backgroundColor: Color.fromARGB(255, 63, 85, 116),
      ),
      backgroundColor: Color.fromARGB(255, 115, 147, 214),
      body: SingleChildScrollView(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const SizedBox(height: 2),
              Image.asset(
                'assets/images/logo_LNB.webp',
                width: containerWidth,
                height: 100,
              ),
              const SizedBox(height: 3),

              // Boîte 1 : instruction + lien de récupération du code de connexion
              Card(
                margin:
                    const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                elevation: 8,
                color: Color.fromARGB(255, 254, 244, 195),
                child: Padding(
                  padding: const EdgeInsets.all(10.0),
                  child: Column(
                    children: [
                      const Text(
                        'Un code de connexion est nécessaire.\n\nVous pouvez le récupérer sur le Discord de la maison La Nuit Blanche avec la commande "/app_mobile".',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          shadows: [
                            Shadow(
                              offset: Offset(2.0, 2.0),
                              blurRadius: 4.0,
                              color: Colors.white,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 1),

              // Boîte 2 : Saisie du code
              Card(
                margin:
                    const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                elevation: 8,
                color: Color.fromARGB(255, 254, 244, 195),
                child: Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: Column(
                    children: [
                      TextField(
                        controller: _codeController,
                        decoration: InputDecoration(
                          labelText: 'Code de connexion',
                          labelStyle: TextStyle(
                            color: Colors.black,
                            fontSize: 16,
                            shadows: [
                              Shadow(
                                offset: Offset(2.0, 2.0),
                                blurRadius: 3.0,
                                color: Colors.white,
                              ),
                            ],
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15),
                          ),
                          prefixIcon: Icon(Icons.lock),
                          filled: true,
                          fillColor: Colors.grey[100],
                        ),
                        keyboardType: TextInputType.text,
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () async {
                          final code = _codeController.text;
                          // print('Code de connexion: $code');
                          // envoie du code au serveur
                          await sendCodeToServer(
                            context,
                            code,
                            tofetch: 'login',
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color.fromARGB(255, 63, 85, 116),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          padding: const EdgeInsets.symmetric(
                              vertical: 15, horizontal: 30),
                          elevation: 5,
                        ),
                        child: const Text(
                          'Soumettre le code',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            shadows: [
                              Shadow(
                                offset: Offset(2.0, 2.0),
                                blurRadius: 4.0,
                                color: Colors.black,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
