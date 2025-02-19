import { database } from "../database";
import { Q } from "@nozbe/watermelondb";
import RegalService from "./RegalHelper";

async function createArtikel(artikelData) {
  return database.write(async () => {
    return await database.get("artikel").create((artikel) => {
      artikel.gwId = artikelData.gwId;
      artikel.firmenId = artikelData.firmenId;
      artikel.beschreibung = artikelData.beschreibung;
      artikel.menge = artikelData.menge;
      artikel.mindestMenge = artikelData.mindestMenge;
      artikel.kunde = artikelData.kunde;
      artikel.ablaufdatum = artikelData.ablaufdatum;

      //NEU 19.02
      if (artikelData.regalId) {
        artikel.regal.set(artikelData.regalId);
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

// async function assignArtikelToRegal(artikelId, regalId) {
//   return await database.write(async () => {
//     const artikel = await database
//       .get("artikel")
//       .query(
//         Q.where("gw_id", artikelId) // Artikel mit gw_id suchen
//       )
//       .fetch();

//     if (artikel.length === 0) {
//       throw new Error("Artikel nicht gefunden");
//     }

//     await artikel[0].update((art) => {
//       art.regal.set(regalId); // Beziehung zum Regal setzen
//     });
//   });
// }

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
async function deleteAllData() {
  return await database.write(async () => {
    const allArtikel = await database.get("artikel").query().fetch();
    const allLogs = await database.get("logs").query().fetch();
    const allRegale = await database.get("regale").query().fetch();
    await database.batch(
      ...allArtikel.map((artikel) => artikel.prepareDestroyPermanently()),
      ...allLogs.map((log) => log.prepareDestroyPermanently()),
      ...allRegale.map((regal) => regal.prepareDestroyPermanently())
    );
  });
}

const ArtikelService = {
  createArtikel,
  getAllArtikel,
  getArtikelById,
  updateArtikel,
  deleteArtikel,
  deleteAllData,
};

export default ArtikelService;
