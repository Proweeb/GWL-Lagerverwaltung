import { database } from "../database";
import { Q } from "@nozbe/watermelondb";
import RegalService from "./RegalHelper";

async function createArtikel(artikelData, regalId) {
  const regal = await RegalService.getRegalById(regalId);
  return database.write(async () => {
    const artikel = await database.get("artikel").create((artikel) => {
      artikel.gwId = artikelData.gwId;
      artikel.firmenId = artikelData.firmenId;
      artikel.beschreibung = artikelData.beschreibung;
      artikel.menge = artikelData.menge;
      artikel.mindestMenge = artikelData.mindestMenge;
      artikel.kunde = artikelData.kunde;
      artikel.ablaufdatum = artikelData.ablaufdatum;
    });
    await database.get("logs").create((log) => {
      log.beschreibung = "Einlagern";
      log.menge = Number(artikelData.menge);
      log.gesamtMenge = Number(artikelData.menge);
      log.artikel.set(artikel);
      log.regal.set(regal);
      log.createdAt = Date.now();
    });
    await database.get("artikel_besitzer").create((artikelBesitzer) => {
      artikelBesitzer.menge = Number(artikelData.menge);
      artikelBesitzer.regal.set(regal);
      artikelBesitzer.artikel.set(artikel);
      artikelBesitzer.createdAt = Date.now();
    });
    return artikel;
  });
}


async function createArtikelImport(artikelData) {
  
  return database.write(async () => {
    const artikel = await database.get("artikel").create((artikel) => {
      artikel.gwId = artikelData.gwId;
      artikel.firmenId = artikelData.firmenId;
      artikel.beschreibung = artikelData.beschreibung;
      artikel.menge = artikelData.menge;
      artikel.mindestMenge = artikelData.mindestMenge;
      artikel.kunde = artikelData.kunde;
      artikel.ablaufdatum = artikelData.ablaufdatum;
    });
    return artikel;
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

async function getArtikelsById(gwid) {
  const artikel = await database
    .get("artikel")
    .query(
      Q.where("gw_id", gwid) // Ensure "gwId" matches your schema
    )
    .fetch();
  return artikel.length > 0 ? artikel : null; // Return first item or null if not found
}

async function updateArtikel(gwid, updatedData) {
  return await database.write(async () => {
    const artikel = await database
      .get("artikel")
      .query(Q.where("gw_id", gwid)) // Ensure "gwId" matches your schema
      .fetch();
    if (!artikel.length) {
      console.error("Artikel not found for gwId:", gwid);
      return;
    }

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
        art.menge += updatedData.menge;
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
    });
    return artikel[0];
  });
}

async function updateInventurArtikel(gwid, updatedData) {
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
    if (updatedData.menge < 0) {
      text = "Entnehmen";
    } else {
      text = "Nachfüllen";
    }
    await database.get("logs").create((log) => {
      log.beschreibung = text;
      log.menge = Number(updatedData.menge);
      log.gesamtMenge = Number(artikel[0].menge) + Number(updatedData.menge);
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
    });
    return artikel[0];
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

    if (artikel.length > 0) {
      await database.batch(
        ...artikel.map((artikel) => artikel.prepareDestroyPermanently())
      );
    }
  });
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

async function updateArtikelById(id, updatedData) {
  return await database.write(async () => {
    const artikel = await database
      .get("artikel")
      .query(Q.where("id", id)) // Ensure "gwId" matches your schema
      .fetch();
    if (!artikel.length) {
      console.error("Artikel not found for id:", id);
      return;
    }
    let text;
    if (updatedData.menge < 0) {
      text = "Entnehmen";
    } else {
      text = "Nachfüllen";
    }
    await database.get("logs").create((log) => {
      log.beschreibung = text;
      log.menge = Number(updatedData.menge);
      log.gesamtMenge = Number(artikel[0].menge) + Number(updatedData.menge);
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
        art.menge += updatedData.menge;
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
    });
    return artikel[0];
  });
}
const ArtikelService = {
  createArtikel,
  getAllArtikel,
  getArtikelById,
  updateArtikel,
  deleteArtikel,
  deleteAllData,
  updateArtikelById,
  getArtikelsById,
  updateInventurArtikel,
};

export default ArtikelService;
