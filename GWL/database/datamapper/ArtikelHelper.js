import { database } from "../database";
import { Q } from "@nozbe/watermelondb";
import RegalService from "./RegalHelper";
import { logTypes, ErrorMessages } from "../../components/enum";
import LogService from "./LogHelper";

async function createArtikel(artikelData, regalId) {
  let regal = null;

  regal = await RegalService.getRegalById(regalId);

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

    await database.get("artikel_besitzer").create((artikelBesitzer) => {
      artikelBesitzer.menge = Number(artikelData.menge);
      artikelBesitzer.regal.set(regal);
      artikelBesitzer.artikel.set(artikel);
      artikelBesitzer.createdAt = Date.now();
    });

    await LogService.createLog({
      beschreibung: logTypes.artikelEinlagern,
      menge: Number(artikelData.menge),
      gesamtMenge: Number(artikelData.menge),
      regalId: regal.regalId,
      createdAt: new Date()
    }, artikelData.gwId, regalId);

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
    .query(Q.where("gw_id", gwid))
    .fetch();

  if (artikel.length < 1) {
    throw new Error(ErrorMessages.ARTICLE_NOT_FOUND);
  }
  return artikel[0];
}

async function getArtikelsById(gwid) {
  const artikel = await database
    .get("artikel")
    .query(Q.where("gw_id", gwid))
    .fetch();

  if (artikel.length < 1) {
    throw new Error(ErrorMessages.ARTICLE_NOT_FOUND);
  }
  return artikel;
}

async function updateArtikel(gwid, updatedData) {
  return await database.write(async () => {
    const artikel = await database
      .get("artikel")
      .query(Q.where("gw_id", gwid))
      .fetch();

    if (artikel.length < 1) {
      throw new Error(ErrorMessages.ARTICLE_NOT_FOUND);
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
      .query(Q.where("gw_id", gwid))
      .fetch();

    if (artikel.length < 1) {
      throw new Error(ErrorMessages.ARTICLE_NOT_FOUND);
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
      .query(Q.where("gw_id", gwid))
      .fetch();

    if (artikel.length < 1) {
      throw new Error(ErrorMessages.ARTICLE_NOT_FOUND);
    }
    await LogService.createLog({
      beschreibung: logTypes.artikelGeloescht,
      menge: Number(artikel[0].menge)*-1,
      gesamtMenge:0,
    }, gwid,null);

    await database.batch(
      ...artikel.map((artikel) => artikel.prepareDestroyPermanently())
    );
  });
}

async function updateArtikelById(id, updatedData) {
  return await database.write(async () => {
    const artikel = await database
      .get("artikel")
      .query(Q.where("id", id))
      .fetch();

    if (artikel.length < 1) {
      throw new Error(ErrorMessages.ARTICLE_NOT_FOUND);
    }

    let text;
    if (updatedData.menge < 0) {
      text = logTypes.artikelEntnehmen;
    } else {
      text = logTypes.artikelNachfüllen;
    }

    await LogService.createLog({
      beschreibung: text,
      menge: Number(updatedData.menge),
      gesamtMenge: Number(artikel[0].menge) + Number(updatedData.menge),
      regalId: regal ? regal.regalId : null,
      createdAt: new Date()
    }, artikel[0].gwId,null);

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
  updateArtikelById,
  getArtikelsById,
  updateInventurArtikel,
  createArtikelImport,
};

export default ArtikelService;
