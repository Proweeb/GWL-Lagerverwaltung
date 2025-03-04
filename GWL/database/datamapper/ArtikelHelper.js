import { database } from "../database";
import { Q } from "@nozbe/watermelondb";
import RegalService from "./RegalHelper";

async function createArtikel(artikelData) {
  return database.write(async () => {
    const regal = await RegalService.getRegalById(artikelData.regalId);
    return await database.get("artikel").create((artikel) => {
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
async function updateArtikel(gwid, updatedData) {
  return await database.write(async () => {
    const artikel = await database
      .get("artikel")
      .query(
        Q.where("gw_id", gwid) // Ensure "gwId" matches your schema
      )
      .fetch();

    await artikel[0].update((art) => {
      art.gwId = updatedData.gwId;
      art.firmenId = updatedData.firmenId;
      art.beschreibung = updatedData.beschreibung;
      art.menge = updatedData.menge;
      art.mindestMenge = updatedData.mindestMenge;
      art.kunde = updatedData.kunde;
      art.ablaufdatum = updatedData.ablaufdatum;

      //NEU 19.02
      if (updatedData.regalId) {
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
