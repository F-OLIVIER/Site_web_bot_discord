// Fichier annexe
import { adressdb } from "./config.js";

// Module nodejs et npm
import sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";

export async function genereTokenApp(AuthorID) {
    const db = new sqlite3.Database(adressdb);
    const uuid = uuidv4();
  
    return new Promise((resolve, reject) => {
      const insertQuery = `UPDATE Users SET uuidApp = ?, uuidAppUse = 0 WHERE DiscordID = ?;`;
  
      db.run(insertQuery, [uuid, AuthorID], function (err) {
        if (err) {
          console.error("Error genereTokenApp :\n", err.message);
          db.close();
          reject(""); 
        } else {
          db.close(); 
          resolve(uuid);
        }
      });
    });
  }
