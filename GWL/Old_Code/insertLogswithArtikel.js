import { database } from "../database/database";
import ArtikelBesitzerService from "../database/datamapper/ArtikelBesitzerHelper";
import ArtikelService from "../database/datamapper/ArtikelHelper";

export async function testInsertAndFetch() {
  await database.write(async () => {
    // Delete all existing records from tables
    const tables = ["artikel", "logs", "regale", "artikel_besitzer"];
    const allRecords = await Promise.all(
      tables.map((table) => database.get(table).query().fetch())
    );

    await database.batch(
      ...allRecords.flat().map((record) => record.prepareDestroyPermanently())
    );

    // Create Regale (shelves)
    const regaleNames = ["A00", "B00", "C00"];
    for (const regalName of regaleNames) {
      for (let index = 0; index < 9; index++) {
        await database.get("regale").create((regal) => {
          regal.fachName = "00" + index;
          regal.regalName = regalName;
          regal.regalId = regal.regalName + "." + regal.fachName;
        });
      }
    }
  });

  // Sample item names for diversity
  const artikelNamen = [
    "Kiwi",
    "Apfel",
    "Banane",
    "Orange",
    "Gurke",
    "Tomate",
    "Kartoffel",
    "Paprika",
    "Möhre",
    "Zitrone",
  ];

  const regale = ["A00", "B00", "C00"];

  for (let i = 1; i <= 50; i++) {
    const artikelName = artikelNamen[i % artikelNamen.length]; // Rotate names
    const uniqueName = `${artikelName}-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`; // Unique name by adding a timestamp and random number

    const menge = Math.floor(Math.random() * 20) + 1; // Menge between 1 and 20
    const mindestMenge = Math.floor(Math.random() * 5) + 5; // MindestMenge 5-10

    // Assign to a random Regal
    const regal = `${regale[i % regale.length]}.00${Math.floor(
      Math.random() * 9
    )}`;

    const artikel = await ArtikelService.createArtikel(
      {
        gwId: `${i}`,
        firmenId: `firmen456_${i}`,
        beschreibung: uniqueName, // Use unique name for each artikel
        menge,
        mindestMenge,
        kunde: "Test Kunde",
        ablaufdatum:
          Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000, // Random expiry date
      },
      regal
    );

    // Distribute this article to 2-3 different shelves
    const numShelves = Math.floor(Math.random() * 2) + 2; // 2-3 shelves
    for (let j = 0; j < numShelves; j++) {
      const regalBesitzer = `${regale[j % regale.length]}.00${Math.floor(
        Math.random() * 9
      )}`;
      await ArtikelBesitzerService.createArtikelOwner(
        {
          menge: Math.floor(menge / numShelves),
        },
        String(i),
        regalBesitzer
      );
    }
  }
}

// import { database } from "../database/database";
// import ArtikelBesitzerService from "../database/datamapper/ArtikelBesitzerHelper";
// import ArtikelBesitzerHelper from "../database/datamapper/ArtikelBesitzerHelper";
// import ArtikelService from "../database/datamapper/ArtikelHelper";

// export async function testInsertAndFetch() {
//   await database.write(async () => {
//     // Delete all existing records from "artikel" and "logs"
//     const allArtikel = await database.get("artikel").query().fetch();
//     const allLogs = await database.get("logs").query().fetch();
//     const allRegale = await database.get("regale").query().fetch();
//     const allArtikelBesitzer = await database
//       .get("artikel_besitzer")
//       .query()
//       .fetch();

//     await database.batch(
//       ...allArtikel.map((artikel) => artikel.prepareDestroyPermanently()),
//       ...allLogs.map((log) => log.prepareDestroyPermanently()),
//       ...allRegale.map((regal) => regal.prepareDestroyPermanently()),
//       ...allArtikelBesitzer.map((artikelbesitzer) =>
//         artikelbesitzer.prepareDestroyPermanently()
//       )
//     );

//     for (let index = 0; index < 9; index++) {
//       const regal = await database.get("regale").create((regal) => {
//         regal.fachName = "00" + index;
//         regal.regalName = "B00";
//         regal.regalId = regal.regalName + "." + regal.fachName;
//       });
//     }
//     for (let index = 0; index < 9; index++) {
//       const regal = await database.get("regale").create((regal) => {
//         regal.fachName = "00" + index;
//         regal.regalName = "A00";
//         regal.regalId = regal.regalName + "." + regal.fachName;
//       });
//     }
//     // // Create 3 artikel records
//     // const artikelPromises = [];
//     // for (let i = 0; i < 30; i++) {
//     //   artikelPromises.push(
//     //     await database.get("artikel").create((artikel) => {
//     //       artikel.gwId = `${i + 1}`;
//     //       artikel.firmenId = `firmen456_${i + 1}`;
//     //       artikel.beschreibung = `Kiwi ${i + 1}`;
//     //       artikel.menge = 0;
//     //       artikel.mindestMenge = 10;
//     //       artikel.kunde = "Test Kunde";
//     //       artikel.ablaufdatum = Date.now() + 0 * 24 * 60 * 60 * 1000;
//     //     })
//     //   );
//     // }

//     // const artikels = await Promise.all(artikelPromises);

//     // // Create a single regal record

//     // // Create 3 log records using a loop
//     // const logPromises1 = [];
//     // for (let i = 0; i < 3; i++) {
//     //   logPromises1.push(
//     //     database.get("logs").create((log) => {
//     //       log.beschreibung = `Entnehmen`;
//     //       log.datum = new Date().toISOString();
//     //       log.menge = -5;
//     //       log.gesamtMenge = 20;
//     //       log.artikel.set(artikels[i]); // Link to corresponding artikel
//     //       log.regal.set(regal);
//     //     })
//     //   );
//     // }

//     // await Promise.all(logPromises1); // Wait for all the log records to be created

//     // // Add 2 more logs after a timeout (simulate delay)
//     // const logPromises2 = [];
//     // await new Promise((resolve) => setTimeout(resolve, 1010)); // Wait for 1 second

//     // for (let i = 0; i < 2; i++) {
//     //   logPromises2.push(
//     //     database.get("logs").create((log) => {
//     //       log.beschreibung = `Einlagern`;
//     //       log.datum = new Date().toISOString();
//     //       log.menge = 2;
//     //       log.gesamtMenge = 22;
//     //       log.artikel.set(artikels[i]); // Use same 2 artikels for logs
//     //       log.regal.set(regal);
//     //     })
//     //   );
//     // }

//     // await Promise.all(logPromises2); // Wait for the 2 new logs to be created

//     // // Optionally, fetch all logs and log the related artikel for each log
//     // const allCreatedLogs = await database.get("logs").query().fetch();
//     // for (const log of allCreatedLogs) {
//     //   const relatedArtikel = await log.artikel.fetch();
//     //   console.log(
//     //     `Log description: ${log.beschreibung}, Artikel description: ${relatedArtikel.beschreibung}`
//     //   );
//     // }
//   });
//   for (let i = 30; i < 50; i++) {
//     await ArtikelService.createArtikel(
//       {
//         gwId: `${i + 1}`,
//         firmenId: `firmen456_${i + 1}`,
//         beschreibung: `Kiwi ${i + 1}`,
//         menge: 5,
//         mindestMenge: 10,
//         kunde: "Test Kunde",
//         ablaufdatum: Date.now() + 0 * 24 * 60 * 60 * 1000,
//       },
//       "A00.000"
//     );

//     for (let j = 1; j < 9; j++) {
//       // if (j % 2 == 0) {
//       await ArtikelBesitzerService.createArtikelOwner(
//         {
//           menge: 5,
//         },
//         String(i + 1),
//         "B00.00" + j
//       );
//       // } else {
//       //   await ArtikelBesitzerService.createArtikelOwner(
//       //     {
//       //       menge: 5,
//       //     },
//       //     String(i + 1),
//       //     "A00.00" + j
//       //   );
//       // }
//     }
//   }
// }
