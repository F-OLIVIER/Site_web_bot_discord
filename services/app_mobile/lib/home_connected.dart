// Import module
import 'package:flutter/material.dart';
import 'dart:async';

// Fichier annexe
import 'package:la_nuit_blanche/common_custom_app.dart';
import 'package:la_nuit_blanche/fetch_server.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  String? codeApp;
  int? etatInscripted;

  @override
  void initState() {
    super.initState();
    _initializeData();
  }

  Future<void> _initializeData() async {
    try {
      // Récupération des données
      final userData = await fetchData(tofetch: 'user');
      // print('---------------------------------');
      // print('userData : $userData');
      // print('---------------------------------');

      if (userData['Internet'] != null && userData['Internet'] == false) {
        if (mounted) {
          Navigator.pushReplacementNamed(context, '/no_internet');
        }
        return;
      }

      if (userData['Gestion']['Logged'] == false && mounted) {
        logout(context);
      }

      setState(() {
        etatInscripted = userData['UserInfo']?['EtatInscription'];
        codeApp = userData['UserInfo']['CodeApp'];
      });
    } catch (e) {
      // print("Erreur lors de la récupération des données : $e");
    }
  }

  Future<String?> showCustomDialog(BuildContext context) async {
    return await showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          contentPadding: EdgeInsets.symmetric(horizontal: 4, vertical: 30),
          title: Center(
            child: Text(
              "Choisir votre statut",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          content: const Text(
            "Voulez-vous vous inscrire comme présent ou absent ?",
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16),
          ),
          actionsAlignment: MainAxisAlignment.center,
          actions: [
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () => Navigator.pop(context, "present"),
              icon: const Icon(
                Icons.check_circle,
                size: 14,
                color: Colors.white,
              ),
              label: const Text("Présent"),
            ),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.redAccent,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () => Navigator.pop(context, "absent"),
              icon: const Icon(
                Icons.cancel,
                size: 14,
                color: Colors.white,
              ),
              label: const Text("Absent"),
            ),
          ],
        );
      },
    );
  }

  // Fonction pour gérer le clic sur le gros bouton
  void _handleBigButtonClick(BuildContext context) async {
    int newetat = 0;

    if (etatInscripted == 0 || etatInscripted == -1) {
      // popup pour choisir entre présent ou absent
      String? choix = await showCustomDialog(context);

      if (choix == "present") {
        newetat = 1;
        // print("Inscrit présent !");
      } else if (choix == "absent") {
        newetat = 3;
        // print("Inscrit absent !");
      }
    } else if (etatInscripted == 1) {
      newetat = 3;
      // print("Changé à absent !");
    } else if (etatInscripted == 3) {
      newetat = 1;
      // print("Changé à présent !");
    }

    if (newetat != etatInscripted) {
      Map<String, dynamic> dataToSend = {
        'EtatInscription': newetat,
        'CodeApp': codeApp,
      };
      await sendDataToServer(
        adresstosend: 'updateinscription',
        data: dataToSend,
      );

      setState(() {
        etatInscripted = newetat;
      });
    }
  }

  // Fonction pour obtenir la couleur en fonction de l'etat d'inscription
  Map<String, dynamic> _getButtonAppearance() {
    if (etatInscripted == 0 || etatInscripted == -1) {
      return {
        "color": Colors.orange,
        "text": "Non inscrit",
      };
    } else if (etatInscripted == 1) {
      return {
        "color": Colors.green,
        "text": "Inscrit présent",
      };
    } else if (etatInscripted == 3) {
      return {
        "color": Colors.red,
        "text": "Inscrit absent",
      };
    }
    return {
      "color": Colors.grey,
      "text": "Erreur",
    };
  }

  @override
  Widget build(BuildContext context) {
    final buttonAppearance = _getButtonAppearance();

    return Scaffold(
      appBar: customAppBar(context, title: "La Nuit Blanche"),
      drawer: customAppDrawer(context),
      backgroundColor: Color.fromARGB(255, 115, 147, 214),
      body: Center(
        child: LayoutBuilder(
          builder: (context, constraints) {
            // Calculer 60 % de la largeur de l'écran
            double buttonSize = constraints.maxWidth * 0.6;

            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "Etat de votre inscription",
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 1.2,
                    shadows: [
                      Shadow(
                        offset: Offset(1.0, 1.0),
                        blurRadius: 4.0,
                        color: Colors.black,
                      ),
                    ],
                  ),
                ),
                Text(
                  "(cliquer dessus pour modifier)",
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.white,
                    letterSpacing: 1.2,
                    shadows: [
                      Shadow(
                        offset: Offset(1.0, 1.0),
                        blurRadius: 4.0,
                        color: Colors.black,
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 40),
                Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: buttonAppearance["color"],
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withAlpha(150),
                        offset: Offset(0, 8),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: () => _handleBigButtonClick(context),
                    style: ElevatedButton.styleFrom(
                      shape: const CircleBorder(),
                      backgroundColor: buttonAppearance["color"],
                      padding: EdgeInsets.zero,
                      elevation: 0,
                    ),
                    child: SizedBox(
                      width: buttonSize,
                      height: buttonSize,
                      child: Center(
                        child: Text(
                          buttonAppearance["text"],
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            shadows: [
                              Shadow(
                                offset: Offset(2.0, 2.0),
                                blurRadius: 5.0,
                                color: Color.fromARGB(100, 0, 0, 0),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
