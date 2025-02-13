import { database } from "./database";

// Insert Artikel entries
export const insertArtikel = async () => {
  await database.write(async () => {
    const artikel1 = await database.get("artikel").create((artikel) => {
      artikel.gw_id = "1"; // Corrected to gw_id, not gwid
      artikel.firmenId = "A001";
      artikel.beschreibung = "Kiwi";
      artikel.menge = 5;
      artikel.mindestmenge = 2;
      artikel.kunde = "Customer1";
      artikel.regal_id = "R001"; // Corrected from regal_id to regal.id
      artikel.ablaufdatum = 1789651200;
      artikel.created_at = Date.now(); // Add timestamp if needed
      artikel.updated_at = Date.now(); // Add timestamp if needed
    });

    const artikel2 = await database.get("artikel").create((artikel) => {
      artikel.gw_id = "2"; // Corrected to gw_id, not gwid
      artikel.firmenId = "A002";
      artikel.beschreibung = "Baby Oil";
      artikel.menge = 1;
      artikel.mindestmenge = 2;
      artikel.kunde = "Customer2";
      artikel.regal_id = "R002"; // Corrected from regal_id to regal.id
      artikel.ablaufdatum = 1789651200;
      artikel.created_at = Date.now(); // Add timestamp if needed
      artikel.updated_at = Date.now(); // Add timestamp if needed
    });

    const artikel3 = await database.get("artikel").create((artikel) => {
      artikel.gw_id = "3"; // Corrected to gw_id, not gwid
      artikel.firmenId = "A003";
      artikel.beschreibung = "TV";
      artikel.menge = -403;
      artikel.mindestmenge = 2;
      artikel.kunde = "Customer3";
      artikel.regal_id = "R003"; // Corrected from regal_id to regal.id
      artikel.ablaufdatum = 1789651200;
      artikel.created_at = Date.now(); // Add timestamp if needed
      artikel.updated_at = Date.now(); // Add timestamp if needed
    });
  });
};

// Insert Log entries
export const insertLogs = async () => {
  await database.write(async () => {
    const log1 = await database.get("logs").create((log) => {
      log.beschreibung = "Stock added";
      log.datum = "2025-02-10 14:00:00";
      log.regal_id = "R001"; // Corrected from regal_id to regal.id
      log.gw_id = "1"; // Corrected to gw_id
      log.menge = 5;
      log.created_at = Date.now(); // Add timestamp if needed
      log.updated_at = Date.now(); // Add timestamp if needed
    });

    const log2 = await database.get("logs").create((log) => {
      log.beschreibung = "Restocked";
      log.datum = "2025-02-09 13:30:00";
      log.regal_id = "R002"; // Corrected from regal_id to regal.id
      log.gw_id = "2"; // Corrected to gw_id
      log.menge = 1;
      log.created_at = Date.now(); // Add timestamp if needed
      log.updated_at = Date.now(); // Add timestamp if needed
    });

    const log3 = await database.get("logs").create((log) => {
      log.beschreibung = "Item removed";
      log.datum = "2025-02-08 12:15:00";
      log.regal_id = "R003"; // Corrected from regal_id to regal.id
      log.gw_id = "3"; // Corrected to gw_id
      log.menge = -403;
      log.created_at = Date.now(); // Add timestamp if needed
      log.updated_at = Date.now(); // Add timestamp if needed
    });
  });
};
