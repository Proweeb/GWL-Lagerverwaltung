import { database } from "./database";
export const insertArtikel = async () => {
  await database.write(async () => {
    await database.get("artikel").create((artikel) => {
      artikel.gwid = 1;
      artikel.firmenId = "A001";
      artikel.beschreibung = "Kiwi";
      artikel.menge = 5;
      artikel.mindestmenge = 2;
      artikel.kunde = "Customer1";
      artikel.regal_id = "R001";
      artikel.ablaufdatum = 1789651200;
      artikel.high = 10;
      artikel.status = "available";
    });

    await database.get("artikel").create((artikel) => {
      artikel.gwid = 2;
      artikel.firmenId = "A002";
      artikel.beschreibung = "Baby Oil";
      artikel.menge = 1;
      artikel.mindestmenge = 2;
      artikel.kunde = "Customer2";
      artikel.regal_id = "R002";
      artikel.ablaufdatum = 1789651200;
      artikel.high = 5;
      artikel.status = "available";
    });

    await database.get("artikel").create((artikel) => {
      artikel.gwid = 3;
      artikel.firmenId = "A003";
      artikel.beschreibung = "TV";
      artikel.menge = -403;
      artikel.mindestmenge = 2;
      artikel.kunde = "Customer3";
      artikel.regal_id = "R003";
      artikel.ablaufdatum = 1789651200;
      artikel.high = 5;
      artikel.status = "out of stock";
    });
  });
};

export const insertLogs = async () => {
  await database.write(async () => {
    await database.get("logs").create((log) => {
      log.beschreibung = "Stock added";
      log.datum = "2025-02-10 14:00:00";
      log.regal_id = "R001";
      log.gwid = 1; // ✅ Ensure it matches an existing artikel ID
      log.menge = 5;
    });

    await database.get("logs").create((log) => {
      log.beschreibung = "Restocked";
      log.datum = "2025-02-09 13:30:00";
      log.regal_id = "R002";
      log.gwid = 2; // ✅ Ensure correct linking
      log.menge = 1;
    });

    await database.get("logs").create((log) => {
      log.beschreibung = "Item removed";
      log.datum = "2025-02-08 12:15:00";
      log.regal_id = "R003";
      log.gwid = 3; // ✅ Match with existing artikel
      log.menge = -403;
    });
  });
};
