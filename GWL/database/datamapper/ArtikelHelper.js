import { database } from "../database";
import { Q } from "@nozbe/watermelondb";
import RegalService from "./RegalHelper";

async function createArtikel(artikelData) {
  const regal = await RegalService.getRegalById(artikelData.regalId);
  return database.write(async () => {
    const artikel = await database.get("artikel").create((artikel) => {
      artikel.gwId = artikelData.gwId;
      artikel.firmenId = artikelData.firmenId;
      artikel.beschreibung = artikelData.beschreibung;
      artikel.menge = artikelData.menge;
      artikel.mindestMenge = artikelData.mindestMenge;
      artikel.kunde = artikelData.kunde;
      artikel.ablaufdatum = artikelData.ablaufdatum;

      // NEU 19.02
      if (regal) {
        artikel.regal.set(regal);
      }
    });
    await database.get("logs").create((log) => {
      log.beschreibung = "Einlagern";
      log.menge = Number(artikelData.menge);
      log.gesamtMenge = Number(artikelData.menge);
      log.artikel.set(artikel);
      log.regal.set(regal);
      log.createdAt = Date.now();
    });
  });
}
async function getAllArtikel() {
  return await database.get("artikel").query().fetch();
}

async function getArtikelById(gwid) {
  const artikel = await database
    .get("artikel")
    .query(
      Q.where("gw_id", gwid) // Ensure "gwId" matches your schema
    )
    .fetch();

  return artikel.length > 0 ? artikel[0] : null; // Return first item or null if not found
}
async function updateArtikel(gwid, updatedData, changeValue) {
  return await database.write(async () => {
    const artikel = await database
      .get("artikel")
      .query(Q.where("gw_id", gwid)) // Ensure "gwId" matches your schema
      .fetch();
    if (!artikel.length) {
      console.error("Artikel not found for gwId:", gwid);
      return;
    }
    let text;
    if (changeValue === -1) {
      text = "Entnehmen";
    } else {
      text = "Nachfüllen";
    }
    await database.get("logs").create((log) => {
      log.beschreibung = text;
      log.menge = Number(updatedData.menge);
      log.gesamtMenge = Number(updatedData.menge);
      log.artikel.set(artikel[0]);
      log.createdAt = Date.now();
    });

    await artikel[0].update((art) => {
      if (updatedData.gwId !== null && updatedData.gwId !== undefined) {
        art.gwId = updatedData.gwId;
      }
      if (updatedData.firmenId !== null && updatedData.firmenId !== undefined) {
        art.firmenId = updatedData.firmenId;
      }
      if (
        updatedData.beschreibung !== null &&
        updatedData.beschreibung !== undefined
      ) {
        art.beschreibung = updatedData.beschreibung;
      }
      if (updatedData.menge !== null && updatedData.menge !== undefined) {
        art.menge = updatedData.menge;
      }
      if (
        updatedData.mindestMenge !== null &&
        updatedData.mindestMenge !== undefined
      ) {
        art.mindestMenge = updatedData.mindestMenge;
      }
      if (updatedData.kunde !== null && updatedData.kunde !== undefined) {
        art.kunde = updatedData.kunde;
      }
      if (
        updatedData.ablaufdatum !== null &&
        updatedData.ablaufdatum !== undefined
      ) {
        art.ablaufdatum = updatedData.ablaufdatum;
      }

      // Ensure regalId is only updated if it is valid
      if (updatedData.regalId !== null && updatedData.regalId !== undefined) {
        art.regal.set(updatedData.regalId);
      }
    });
  });
}

async function deleteArtikel(gwid) {
  return await database.write(async () => {
    const artikel = await database
      .get("artikel")
      .query(
        Q.where("gw_id", gwid) // Ensure "gwId" matches your schema
      )
      .fetch();

    await artikel[0].destroyPermanently();
  });
}

async function getArtikelByRegalId(regal_id) {
  const regal = await RegalService.getRegalById(regal_id);
  return await regal.artikel.fetch();
}
async function deleteAllData() {
  return await database.write(async () => {
    const batchOperations = [];

    const allArtikel = await database.get("artikel").query().fetch();
    allArtikel.forEach((artikel) =>
      batchOperations.push(artikel.prepareDestroyPermanently())
    );

    // const allLogs = await database.get("logs").query().fetch();
    // allLogs.forEach((log) =>
    //   batchOperations.push(log.prepareDestroyPermanently())
    // );

    const allRegale = await database.get("regale").query().fetch();
    allRegale.forEach((regal) =>
      batchOperations.push(regal.prepareDestroyPermanently())
    );

    if (batchOperations.length > 0) {
      await database.batch(...batchOperations);
    }
  });
}

const ArtikelService = {
  createArtikel,
  getAllArtikel,
  getArtikelById,
  updateArtikel,
  deleteArtikel,
  deleteAllData,
  getArtikelByRegalId,
};

export default ArtikelService;
