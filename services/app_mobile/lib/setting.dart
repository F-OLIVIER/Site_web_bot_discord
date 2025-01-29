// Import
import 'package:flutter/material.dart';

// Fichiers annexes
import 'package:la_nuit_blanche/common_custom_app.dart';

class Setting extends StatefulWidget {
  const Setting({super.key});

  @override
  State<Setting> createState() => _SettingPage();
}

class _SettingPage extends State<Setting> {
  bool isNotificationEnabled = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: customAppBar(context, title: "Paramètres"),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Notifications d'inscription GvG",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Activer les notifications",
                  style: TextStyle(
                    fontSize: 16,
                  ),
                ),
                Switch(
                  value: isNotificationEnabled,
                  onChanged: (bool value) {
                    setState(() {
                      isNotificationEnabled = value;
                    });
                  },
                  activeColor: Colors.blue,
                  inactiveThumbColor: Colors.grey,
                ),
              ],
            ),
            // const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
