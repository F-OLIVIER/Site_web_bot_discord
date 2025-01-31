// Import
import 'dart:convert';
import 'package:flutter/material.dart';

// Fichers annexes
import 'package:la_nuit_blanche/common_custom_app.dart';
import 'package:la_nuit_blanche/fetch_server.dart';
import 'package:la_nuit_blanche/notification.dart';
import 'package:la_nuit_blanche/storage.dart';

class Caserne extends StatefulWidget {
  const Caserne({super.key});

  @override
  Casernepage createState() => Casernepage();
}

class Casernepage extends State<Caserne> {
  Map<String, List<dynamic>> unitsByType = {};
  List<Map<String, dynamic>> allUnits = [];
  ValueNotifier<bool> isButtonVisible = ValueNotifier<bool>(false);
  List<Tab> tabs = [];

  void addUnitLevel(
      List<Map<String, dynamic>> allUnits, Map<String, dynamic> unit) {
    // Affichage du boutton
    if (isButtonVisible.value == false) {
      isButtonVisible.value = true;
    }

    // Vérifier si l'Unit_id existe déjà dans allUnits
    bool exists = allUnits
        .any((existingUnit) => existingUnit['Unit_id'] == unit['Unit_id']);

    if (!exists) {
      // Si l'Unit_id n'existe pas encore, l'ajouter avec son niveau (Unit_lvl)
      allUnits.add({
        'Unit_id': unit['Unit_id'].toString(),
        'Unit_lvl': unit['Unit_lvl'].toString(),
      });
    } else {
      // Si l'Unit_id existe, mettre à jour Unit_lvl avec la nouvelle valeur
      for (var existingUnit in allUnits) {
        if (existingUnit['Unit_id'] == unit['Unit_id']) {
          existingUnit['Unit_lvl'] = unit['Unit_lvl'] ?? 0;
          break;
        }
      }
    }
  }

  void addUnitMaitrise(
      List<Map<String, dynamic>> allUnits, Map<String, dynamic> unit) {
    // Affichage du boutton
    if (isButtonVisible.value == false) {
      isButtonVisible.value = true;
    }

    // Vérifier si l'Unit_id existe déjà dans allUnits
    bool exists = allUnits
        .any((existingUnit) => existingUnit['Unit_id'] == unit['Unit_id']);

    if (!exists) {
      // Si l'Unit_id n'existe pas encore, l'ajouter avec sa maîtrise (UserMaitrise)
      allUnits.add({
        'Unit_id': unit['Unit_id'].toString(),
        'UserMaitrise': unit['UserMaitrise'].toString(),
      });
    } else {
      // Si l'Unit_id existe, mettre à jour UserMaitrise avec la nouvelle valeur
      for (var existingUnit in allUnits) {
        if (existingUnit['Unit_id'] == unit['Unit_id']) {
          existingUnit['UserMaitrise'] = unit['UserMaitrise'] ?? 0;
          break;
        }
      }
    }
  }

  Future<void> sendinfoserver(BuildContext context) async {
    // Vérifier si allUnits est null ou vide
    if (allUnits.isEmpty) {
      // Aucun changement à valider
      showErrorNotification(context, "Aucun changement à valider !!!");
      return;
    }

    final stockeddata = await readJson();

    // Préparer les données à envoyer
    Map<String, dynamic> dataToSend = {
      'iduser': stockeddata['UserInfo']['CodeApp'],
      'listNewAppUnitCaserne': allUnits,
    };

    // Envoyer les données au serveur
    sendDataToServer(
      adresstosend: 'updatecaserne',
      data: dataToSend,
    ).then((success) {
      if (success) {
        // Afficher une notification de succès
        if (context.mounted) {
          showSuccessNotification(context, "Changements validés avec succès !");
        }

        if (context.mounted) {
          Navigator.pushNamed(context, '/caserne');
        }
      } else {
        // Afficher une notification d'échec
        if (context.mounted) {
          showErrorNotification(
              context, "Erreur interne, contactez un administrateur");
        }
      }
    }).catchError((e) {
      if (context.mounted) {
        showErrorNotification(
            context, "Une erreur est survenue, veuillez réessayer.");
      }
    });
  }

  @override
  void initState() async {
    super.initState();
    await _loadData();
  }

  Future<void> _loadData() async {
    try {
      var data = await fetchData(tofetch: 'caserne');

      // print('\n------------------------------------------\nData receive :\n$data\n------------------------------------------\n');

      if (data['Internet'] != null && data['Internet'] == false) {
        if (mounted) {
          Navigator.pushReplacementNamed(context, '/no_internet');
        }
        return;
      }

      if (data['Gestion']['Logged'] == false && mounted) {
        await logout(context);
        return;
      }

      if (data['ListUnit'] != null) {
        List units = data['ListUnit'] ?? [];

        // Tri des unités par type et tier
        units.sort((a, b) {
          int typeComparison = a['Unit_type'].compareTo(b['Unit_type']);
          if (typeComparison != 0) {
            return typeComparison;
          }
          return b['Unit_tier'].compareTo(a['Unit_tier']);
        });

        // Regroupement des unités par type
        Map<String, List> tempUnitsByType = {};
        for (var unit in units) {
          String unitType = unit['Unit_type'];
          if (!tempUnitsByType.containsKey(unitType)) {
            tempUnitsByType[unitType] = [];
          }
          tempUnitsByType[unitType]?.add(unit);
        }

        setState(() {
          unitsByType = tempUnitsByType;
          tabs = unitsByType.keys.map((type) => Tab(text: type)).toList();
        });
      }
    } catch (error) {
      // print('Erreur lors du chargement des données: $error');
    }
  }

  @override
  void dispose() {
    isButtonVisible.dispose(); // Libération de la mémoire
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: customAppBar(context, title: "Caserne"),
      drawer: customAppDrawer(context),
      backgroundColor: Color.fromARGB(255, 63, 85, 116),
      body: Center(
        child: (tabs.isEmpty)
            ? CircularProgressIndicator()
            : DefaultTabController(
                length: tabs.length,
                child: Column(
                  children: [
                    // Affichage conditionnel du bouton de validation
                    ValueListenableBuilder<bool>(
                      valueListenable: isButtonVisible,
                      builder: (context, value, child) {
                        return value
                            ? Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 0,
                                      horizontal: 20,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(30),
                                    ),
                                    elevation: 0,
                                    backgroundColor: Colors.transparent,
                                    shadowColor: Colors.transparent,
                                  ),
                                  onPressed: () async =>
                                      await sendinfoserver(context),
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
                              )
                            : SizedBox.shrink();
                      },
                    ),
                    // Onglets
                    TabBar(
                      tabs: tabs,
                      indicator: BoxDecoration(
                        color: Color.fromARGB(255, 254, 244, 195),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      indicatorPadding: EdgeInsets.symmetric(
                          horizontal: -10.0, vertical: 0.0),
                      labelColor: Colors.black,
                      unselectedLabelColor: Colors.white,
                    ),
                    Expanded(
                      child: TabBarView(
                        children: tabs.map((tab) {
                          String type = tab.text ?? '';
                          List unitsForType = unitsByType[type] ?? [];
                          return ListView.builder(
                            itemCount: unitsForType.length,
                            itemBuilder: (context, index) {
                              var unit = unitsForType[index];

                              // Conversion des champs en int
                              int unitMaitrise =
                                  int.tryParse(unit['Unit_maitrise'] ?? '0') ??
                                      0;
                              int userMaitrise =
                                  int.tryParse(unit['UserMaitrise'] ?? '0') ??
                                      0;
                              int unitLvl =
                                  int.tryParse(unit['Unit_lvl'] ?? '0') ?? 0;
                              int unitLvlMax =
                                  int.tryParse(unit['Unit_lvlMax'] ?? '1') ?? 1;
                              String imagePath = unit['Unit_img'] ?? '';
                              String imageUrl =
                                  'http://lnb.sytes.net:8080${imagePath.startsWith('./') ? imagePath.replaceFirst('.', '') : imagePath}';
                              String unitName =
                                  '${utf8.decode(unit['Unit_name'].runes.toList())} (${unit['Unit_tier']})';

                              return Card(
                                elevation: 4,
                                margin: EdgeInsets.all(16),
                                child: Padding(
                                  padding: EdgeInsets.all(12),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      // Nom de l'unité
                                      Center(
                                        child: Text(
                                          unitName,
                                          style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                      SizedBox(height: 10),

                                      // Image et sélection de niveau
                                      Row(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          // Image de l'unité
                                          Container(
                                            width: 80,
                                            height: 120,
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                              image: DecorationImage(
                                                image: NetworkImage(imageUrl),
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          ),
                                          SizedBox(width: 10),

                                          // Sélection du niveau et de la maîtrise
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                // Dropdown pour le niveau
                                                DropdownButtonFormField<int>(
                                                  decoration: InputDecoration(
                                                    labelText: '',
                                                    border:
                                                        OutlineInputBorder(),
                                                    filled: true,
                                                    fillColor: allUnits.any(
                                                      (existingUnit) =>
                                                          existingUnit[
                                                                  'Unit_id'] ==
                                                              unit['Unit_id'] &&
                                                          existingUnit[
                                                                  'Unit_lvl'] !=
                                                              null,
                                                    )
                                                        // Valeur changer
                                                        ? Colors.blue.shade100
                                                        : (unitLvl == 0)
                                                            // Non débloquer
                                                            ? Colors.red
                                                            : (unitLvl ==
                                                                    unitLvlMax)
                                                                // lvl max
                                                                ? Colors.green
                                                                // en cour
                                                                : Colors.orange,
                                                  ),
                                                  value: allUnits.any((existingUnit) =>
                                                          existingUnit['Unit_id'] ==
                                                              unit['Unit_id'] &&
                                                          (existingUnit['Unit_lvl'] !=
                                                              null))
                                                      ? int.tryParse(allUnits.firstWhere(
                                                                  (existingUnit) =>
                                                                      existingUnit['Unit_id'] == unit['Unit_id'] &&
                                                                      existingUnit['Unit_lvl'] !=
                                                                          null)[
                                                              'Unit_lvl']) ??
                                                          (unitLvl == 0
                                                              ? null
                                                              : unitLvl)
                                                      : (unitLvl == 0
                                                          ? null
                                                          : unitLvl),
                                                  hint: (unitLvl == 0)
                                                      ? Text('Non débloqué',
                                                          style: TextStyle(
                                                              color:
                                                                  Colors.black))
                                                      : (unitLvl == unitLvlMax)
                                                          ? Text('Level max',
                                                              style: TextStyle(
                                                                  color: Colors
                                                                      .black))
                                                          : null,
                                                  items: [
                                                    DropdownMenuItem<int>(
                                                      value: 0,
                                                      child: Text(
                                                        'Non débloqué',
                                                        style: TextStyle(
                                                            color:
                                                                Colors.black),
                                                      ),
                                                    ),
                                                    ...List.generate(
                                                      unitLvlMax,
                                                      (index) {
                                                        int level = index + 1;
                                                        return DropdownMenuItem<
                                                            int>(
                                                          value: level,
                                                          child: Text(
                                                            level == unitLvlMax
                                                                ? 'Level max'
                                                                : 'Level $level',
                                                            style: TextStyle(
                                                                color: Colors
                                                                    .black),
                                                          ),
                                                        );
                                                      },
                                                    ),
                                                  ],
                                                  onChanged: (value) {
                                                    if (value != null) {
                                                      addUnitLevel(allUnits, {
                                                        'Unit_id':
                                                            unit['Unit_id'],
                                                        'Unit_lvl':
                                                            value.toString(),
                                                      });
                                                    }
                                                  },
                                                ),
                                                SizedBox(height: 10),

                                                // Affichage du Dropdown pour UserMaitrise
                                                if (unitMaitrise == 1)
                                                  DropdownButtonFormField<int>(
                                                    decoration: InputDecoration(
                                                      labelText: '',
                                                      border:
                                                          OutlineInputBorder(),
                                                      filled: true,
                                                      fillColor: allUnits.any(
                                                        (existingUnit) =>
                                                            existingUnit[
                                                                    'Unit_id'] ==
                                                                unit[
                                                                    'Unit_id'] &&
                                                            existingUnit[
                                                                    'UserMaitrise'] !=
                                                                null,
                                                      )
                                                          // Valeur changer
                                                          ? Colors.blue.shade100
                                                          : (unitLvl == 0)
                                                              // Non débloquer
                                                              ? Colors.red
                                                              : (unitLvl ==
                                                                      unitLvlMax)
                                                                  // lvl max
                                                                  ? Colors.green
                                                                  // en cour
                                                                  : Colors
                                                                      .orange,
                                                    ),
                                                    value: allUnits.any((existingUnit) =>
                                                            existingUnit['Unit_id'] ==
                                                                unit[
                                                                    'Unit_id'] &&
                                                            existingUnit['UserMaitrise'] !=
                                                                null)
                                                        ? int.tryParse(allUnits.firstWhere((existingUnit) =>
                                                                existingUnit['Unit_id'] ==
                                                                    unit[
                                                                        'Unit_id'] &&
                                                                existingUnit[
                                                                        'UserMaitrise'] !=
                                                                    null)['UserMaitrise']) ??
                                                            userMaitrise
                                                        : userMaitrise,
                                                    items: [
                                                      DropdownMenuItem<int>(
                                                        value: 0,
                                                        child: Text(
                                                            'Non maitrisé'),
                                                      ),
                                                      DropdownMenuItem<int>(
                                                        value: 1,
                                                        child: Text(
                                                            'Maitrise en cours'),
                                                      ),
                                                      DropdownMenuItem<int>(
                                                        value: 2,
                                                        child: Text(
                                                            'Maitrise complète'),
                                                      ),
                                                    ],
                                                    onChanged: (value) {
                                                      if (value != null) {
                                                        addUnitMaitrise(
                                                            allUnits, {
                                                          'Unit_id':
                                                              unit['Unit_id'],
                                                          'UserMaitrise':
                                                              value.toString()
                                                        });
                                                      }
                                                    },
                                                  ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}
