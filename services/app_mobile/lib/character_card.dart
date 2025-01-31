// import
import 'dart:convert';
import 'package:flutter/material.dart';

// Fichiers annexes
import 'package:la_nuit_blanche/common_custom_app.dart';
import 'package:la_nuit_blanche/fetch_server.dart';
import 'package:la_nuit_blanche/notification.dart';

class FichePersonnagePage extends StatefulWidget {
  const FichePersonnagePage({super.key});

  @override
  FichePersonnagePageState createState() => FichePersonnagePageState();
}

class FichePersonnagePageState extends State<FichePersonnagePage> {
  TextEditingController? levelController;
  TextEditingController? influenceController;
  List<String> classList = [];
  String? actualClass;
  String? selectedClass;
  int? userLevel;
  int? userInfluence;
  String codeApp = '';

  @override
  void initState() {
    super.initState();
    _initializeCharacterData();
  }

  Future<void> _initializeCharacterData() async {
    try {
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
        await logout(context);
        return;
      }

      setState(() {
        // Initialisation des niveaux et influence
        userLevel = _parseInt(userData['UserInfo']?['Lvl']);
        userInfluence = _parseInt(userData['UserInfo']?['Influence']);

        // Traitement des classes
        classList = _processClassList(userData['Gestion']?['ListClass']);
        // print('classList : $classList');

        // Classe actuelle
        actualClass = _processSelectedClass(userData);
        classList.remove(actualClass);
        // print('actualClass : $actualClass');
        selectedClass = 'Changer de classe';

        // Initialisation des contrôleurs de texte
        levelController = TextEditingController(
          text: '',
        );
        influenceController = TextEditingController(
          text: '',
        );

        codeApp = userData['UserInfo']?['CodeApp'];
      });
    } catch (e) {
      // print("Erreur lors de la récupération des données : $e");
    }
  }

// Fonction utilitaire pour parser les entiers
  int _parseInt(dynamic value) {
    return int.tryParse(value?.toString() ?? '') ?? 0;
  }

// Fonction pour traiter et nettoyer la liste des classes
  List<String> _processClassList(dynamic listClassData) {
    if (listClassData is List<dynamic>) {
      // Ajouter "Choisissez" en premier dans la liste
      var processedList = <String>['Changer de classe'];

      // Ajouter les autres classes
      processedList.addAll(listClassData.map((dynamic item) {
        if (item is String) {
          // Nettoyer et décoder les caractères spéciaux si nécessaire
          return utf8.decode(item.runes.toList());
        }
        return item.toString(); // Assurer que chaque élément est une chaîne
      }).toList());

      // Retirer les doublons
      return processedList.toSet().toList();
    }
    return [];
  }

// Fonction pour récupérer et traiter la classe actuelle
  String _processSelectedClass(Map<String, dynamic> userData) {
    if (userData['UserInfo']?['GameCharacter'] != null) {
      return utf8.decode(
        (userData['UserInfo']?['GameCharacter'].toString().runes.toList() ??
            []),
      );
    }
    return 'Non défini';
  }

  // Fonction de mise à jour de tous les champs
  void _updateAll() async {
    // Récupération des valeurs
    int? level = int.tryParse(levelController?.text ?? '');
    int? influence = int.tryParse(influenceController?.text ?? '');

    // Pour le serveur
    Map<String, dynamic> dataToSend = {
      'CodeApp': codeApp,
    };

    // Vérifier si tous les champs sont vides ou invalides
    if ((level == null) && (influence == null) && (selectedClass == null)) {
      // Si tous les champs sont vides ou invalides, ne faire aucune mise à jour
      showErrorNotification(context, 'Aucun champs modifier !');
      return;
    }
    if ((level != null && (level <= 0 || level > 10000))) {
      // Si tous les champs sont vides ou invalides, ne faire aucune mise à jour
      showErrorNotification(context, 'Level incorrect');
      return;
    }
    if ((influence != null && (influence < 700 || influence > 1000))) {
      // Si tous les champs sont vides ou invalides, ne faire aucune mise à jour
      showErrorNotification(context, 'Influence incorrect');
      return;
    }

    // Si des valeurs sont valides, on les met à jour.
    if (level != null) {
      userLevel = level;
      dataToSend['Lvl'] = level.toString();
    }

    if (influence != null) {
      userInfluence = influence;
      dataToSend['Influence'] = influence.toString();
    }

    if (selectedClass != null && selectedClass != 'Changer de classe') {
      dataToSend['GameCharacter'] = selectedClass.toString();
    }

    // Envoi des modification à faire au serveur
    bool? sendok;
    if (dataToSend.isNotEmpty) {
      sendok = await sendDataToServer(
        adresstosend: 'updatecharactercard',
        data: dataToSend,
      );
    }

    // Affichage de la notification
    if (mounted) {
      if (sendok == true) {
        showSuccessNotification(context, "Changement validés avec succées !");
        Navigator.pushNamed(context, '/fichepersonnage');
      } else {
        showErrorNotification(
            context, "Erreur interne, contactez un administrateur");
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: customAppBar(context, title: "Fiche personnage"),
      drawer: customAppDrawer(context),
      backgroundColor: Color.fromARGB(255, 115, 147, 214),
      body: classList == []
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: ListView(
                children: [
                  // Section Classe
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Classe actuel : ${actualClass ?? 'Non défini'}',
                            style: TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 10),
                          DropdownButton<String>(
                            value: selectedClass,
                            onChanged: (String? newClass) {
                              setState(() {
                                selectedClass = newClass!;
                              });
                            },
                            items: classList
                                .map<DropdownMenuItem<String>>((className) {
                              return DropdownMenuItem<String>(
                                value: className,
                                child: Text(className),
                              );
                            }).toList(),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 10),

                  // Section Level de héros
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Level actuel : $userLevel',
                            style: TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 10),
                          TextField(
                            controller: levelController,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              labelText: 'Changer de level',
                              hintText: 'Entrez votre nouveau level',
                              border: OutlineInputBorder(),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(5),
                                borderSide: const BorderSide(
                                    color: Colors.black, width: 2),
                              ),
                              contentPadding: EdgeInsets.symmetric(
                                  vertical: 10, horizontal: 15),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 10),

                  // Section Influence
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Influence actuelle : $userInfluence',
                            style: TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 10),
                          TextField(
                            controller: influenceController,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              labelText: 'Changer d\'influence',
                              hintText: 'Entrez votre nouvelle influence',
                              border: OutlineInputBorder(),
                              contentPadding: EdgeInsets.symmetric(
                                  vertical: 10, horizontal: 15),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Bouton pour mettre à jour tous les champs
                  ElevatedButton(
                    onPressed: _updateAll,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      padding: EdgeInsets.zero,
                    ),
                    child: Ink(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.blue.shade400,
                            Colors.blue.shade900,
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: Container(
                        alignment: Alignment.center,
                        constraints: const BoxConstraints(
                          minWidth: 150,
                          minHeight: 50,
                        ),
                        child: const Text(
                          'Valider les changements',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
