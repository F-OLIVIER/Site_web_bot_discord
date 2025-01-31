// Import
import 'package:flutter/material.dart';

// Fichiers annexes
import 'package:la_nuit_blanche/home_not_connected.dart';
import 'package:la_nuit_blanche/storage.dart';

Future<void> logout(BuildContext context) async {
  // Nettoyage du stockage
  await clearStorage();
  // Redirection
  if (context.mounted) {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const LoginPage()),
    );
  }
}

AppBar customAppBar(BuildContext context, {String title = "La Nuit Blanche"}) {
  return AppBar(
    title: Text(
      title,
      style: const TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 24,
        letterSpacing: 1.2,
        color: Colors.white,
        shadows: [
          Shadow(
            offset: Offset(2.0, 2.0),
            blurRadius: 5.0,
            color: Color.fromARGB(100, 0, 0, 0),
          ),
        ],
      ),
    ),
    centerTitle: true,
    backgroundColor: Colors.transparent,
    elevation: 4,
    iconTheme: IconThemeData(
      color: Colors.white,
    ),
    flexibleSpace: Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color.fromARGB(230, 63, 85, 116),
            Color.fromARGB(255, 63, 85, 116),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
      ),
    ),
    actions: [
      if (ModalRoute.of(context)?.settings.name != '/no_internet')
        IconButton(
          icon: const Icon(
            Icons.logout,
            color: Colors.white,
          ),
          onPressed: () async => await logout(context),
        ),
    ],
  );
}

Drawer customAppDrawer(BuildContext context) {
  return Drawer(
    child: ListView(
      padding: EdgeInsets.zero,
      children: [
        DrawerHeader(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color.fromARGB(255, 63, 85, 116),
                Color.fromARGB(255, 115, 147, 214),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Text(
            'Menu',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
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
        if (ModalRoute.of(context)?.settings.name != '/home')
          ListTile(
            title: Text(
              'Home',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/home');
            },
          ),
        if (ModalRoute.of(context)?.settings.name != '/fichepersonnage')
          ListTile(
            title: Text(
              'Fiche personnage',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/fichepersonnage');
            },
          ),
        if (ModalRoute.of(context)?.settings.name != '/caserne')
          ListTile(
            title: Text(
              'Caserne',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            onTap: () {
              Navigator.pushReplacementNamed(context, '/caserne');
            },
          ),
        // ListTile(
        //   title: Text(
        //     'Deconnexion',
        //     style: TextStyle(
        //       fontWeight: FontWeight.bold,
        //       color: Colors.black,
        //     ),
        //   ),
        //   onTap: () {
        //     logout(context);
        //   },
        // ),
      ],
    ),
  );
}
