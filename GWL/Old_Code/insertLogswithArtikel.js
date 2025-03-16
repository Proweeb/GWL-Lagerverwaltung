import { database } from "../database/database";
import ArtikelBesitzerHelper from "../database/datamapper/ArtikelBesitzerHelper";
import ArtikelService from "../database/datamapper/ArtikelHelper";

export async function testInsertAndFetch() {
  await database.write(async () => {
    // Delete all existing records from "artikel" and "logs"
    const allArtikel = await database.get("artikel").query().fetch();
    const allLogs = await database.get("logs").query().fetch();
    const allRegale = await database.get("regale").query().fetch();
    const allArtikelBesitzer = await database
      .get("artikel_besitzer")
      .query()
      .fetch();

    await database.batch(
      ...allArtikel.map((artikel) => artikel.prepareDestroyPermanently()),
      ...allLogs.map((log) => log.prepareDestroyPermanently()),
      ...allRegale.map((regal) => regal.prepareDestroyPermanently()),
      ...allArtikelBesitzer.map((artikelbesitzer) =>
        artikelbesitzer.prepareDestroyPermanently()
      )
    );

    const regal = await database.get("regale").create((regal) => {
      regal.fachName = "10";
      regal.regalName = "A5";
      regal.regalId = "134";
    });
    const regal2 = await database.get("regale").create((regal) => {
      regal.fachName = "10";
      regal.regalName = "A5";
      regal.regalId = "135";
    });
    // Create 3 artikel records
    const artikelPromises = [];
    for (let i = 0; i < 30; i++) {
      artikelPromises.push(
        await database.get("artikel").create((artikel) => {
          artikel.gwId = `${i + 1}`;
          artikel.firmenId = `firmen456_${i + 1}`;
          artikel.beschreibung = `Kiwi ${i + 1}`;
          artikel.menge = 5;
          artikel.mindestMenge = 10;
          artikel.kunde = "Test Kunde";
          artikel.ablaufdatum = Date.now() + 0 * 24 * 60 * 60 * 1000;
        })
      );
    }

    const artikels = await Promise.all(artikelPromises);

    // Create a single regal record

    // Create 3 log records using a loop
    const logPromises1 = [];
    for (let i = 0; i < 3; i++) {
      logPromises1.push(
        database.get("logs").create((log) => {
          log.beschreibung = `Entnehmen`;
          log.datum = new Date().toISOString();
          log.menge = -5;
          log.gesamtMenge = 20;
          log.artikel.set(artikels[i]); // Link to corresponding artikel
          log.regal.set(regal);
        })
      );
    }

    await Promise.all(logPromises1); // Wait for all the log records to be created

    // Add 2 more logs after a timeout (simulate delay)
    const logPromises2 = [];
    await new Promise((resolve) => setTimeout(resolve, 1010)); // Wait for 1 second

    for (let i = 0; i < 2; i++) {
      logPromises2.push(
        database.get("logs").create((log) => {
          log.beschreibung = `Einlagern`;
          log.datum = new Date().toISOString();
          log.menge = 2;
          log.gesamtMenge = 22;
          log.artikel.set(artikels[i]); // Use same 2 artikels for logs
          log.regal.set(regal);
        })
      );
    }

    await Promise.all(logPromises2); // Wait for the 2 new logs to be created

    // Optionally, fetch all logs and log the related artikel for each log
    const allCreatedLogs = await database.get("logs").query().fetch();
    for (const log of allCreatedLogs) {
      const relatedArtikel = await log.artikel.fetch();
      console.log(
        `Log description: ${log.beschreibung}, Artikel description: ${relatedArtikel.beschreibung}`
      );
    }
  });
  for (let i = 30; i < 60; i++) {
    await ArtikelService.createArtikel(
      {
        gwId: `${i + 1}`,
        firmenId: `firmen456_${i + 1}`,
        beschreibung: `Kiwi ${i + 1}`,
        menge: 5,
        mindestMenge: 10,
        kunde: "Test Kunde",
        ablaufdatum: Date.now() + 0 * 24 * 60 * 60 * 1000,
      },
      "134"
    );
  }
}
