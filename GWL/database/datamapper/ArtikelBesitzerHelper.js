import { database } from "../database";
import { Q } from "@nozbe/watermelondb";
import ArtikelService from "./ArtikelHelper";
import RegalService from "./RegalHelper";

async function createArtikelOwner(artikelOwnerData, artikelId, regalId) {
  let artikel = null;
  let regal = null;

  if (artikelId !== null) {
    artikel = await ArtikelService.getArtikelById(artikelId);
  }

  if (regalId !== null) {
    regal = await RegalService.getRegalById(regalId);
  }

  return await database.write(async () => {
    return database.get("artikel_besitzer").create((artikelOwner) => {
      artikelOwner.menge = artikelOwnerData.menge;
      artikelOwner.artikel.set(artikel);
      artikelOwner.regal.set(regal);

      if (artikelOwnerData.createdAt) {
        artikelOwner.createdAt = artikelOwnerData.createdAt;
      }
    });
  });
}

async function getAllArtikelOwners() {
  return await database.get("artikel_besitzer").query().fetch();
}

async function getArtikelOwnerByGwId(gwId) {
  const artikel = await ArtikelService.getArtikelById(gwId);
  return await artikel.artikelBesitzer.fetch();
}

async function deleteArtikelOwner(gwId, regalId) {
  return database.write(async () => {
    const artikel = await ArtikelService.getArtikelById(gwId);
    const regal = await RegalService.getRegalById(regalId);
    const artikelOwner = await database
      .get("artikel_besitzer")
      .query(Q.where("gw_id", artikel.id), Q.where("regal_id", regal.id))
      .fetch();

    if (artikelOwner.length) {
      await artikelOwner[0].destroyPermanently();
    }
  });
}

async function deleteArtikelOwnerByArtikelId(gwId) {
  return database.write(async () => {
    const artikel = await ArtikelService.getArtikelById(gwId);

    const artikelOwner = await database
      .get("artikel_besitzer")
      .query(Q.where("gw_id", artikel.id))
      .fetch();

    if (artikelOwner.length) {
      await artikelOwner[0].destroyPermanently();
    }
  });
}

async function getArtikelOwnersByRegalId(regalId) {
  const regal = await RegalService.getRegalById(regalId);
  return await regal.artikelBesitzer.fetch();
}

async function updateArtikelBesitzerByGwIdAndRegalId(
  updatedArtikelBesitzer,
  regalId,
  gwId
) {
  return await database.write(async () => {
    const artikelId = await ArtikelService.getArtikelById(gwId);
    const newRegalId = await RegalService.getRegalById(regalId);
    const artikelBesitzer = await database
      .get("artikel_besitzer")
      .query(Q.where("gw_id", artikelId.id), Q.where("regal_id", newRegalId.id)) // Ensure "gwId" matches your schema
      .fetch();
    if (!artikelBesitzer.length) {
      console.error("ArtikelBesitzer not found for gwId:", gwId);
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
      log.gesamtMenge =
        Number(artikelBesitzer[0].menge) + Number(updatedArtikelBesitzer.menge);
      log.artikel.set(artikelId);
      log.createdAt = Date.now();
    });

    await artikelBesitzer[0].update((art) => {
      if (
        updatedArtikelBesitzer.gwId !== null &&
        updatedArtikelBesitzer.gwId !== undefined
      ) {
        art.artikel.set(gwId);
      }
      if (
        updatedArtikelBesitzer.menge !== null &&
        updatedArtikelBesitzer.menge !== undefined
      ) {
        art.menge += updatedArtikelBesitzer.menge;
      }
      if (
        updatedArtikelBesitzer.regalId !== null &&
        updatedArtikelBesitzer.regalId !== undefined
      ) {
        art.regal.set(regalId);
      }
    });
    return artikelBesitzer[0];
  });
}

async function getArtikelOwnersByGwIdAndRegalId(artikelId, regalId) {
  const artikel = await ArtikelService.getArtikelById(artikelId);
  const regal = await RegalService.getRegalById(regalId);
  return await database
    .get("artikel_besitzer")
    .query(Q.where("gw_id", artikel.id), Q.where("regal_id", regal.id))
    .fetch();
}

const ArtikelBesitzerService = {
  createArtikelOwner,
  getAllArtikelOwners,
  getArtikelOwnerByGwId,
  deleteArtikelOwnerByArtikelId,
  deleteArtikelOwner,
  getArtikelOwnersByRegalId,
  getArtikelOwnersByGwIdAndRegalId,
  updateArtikelBesitzerByGwIdAndRegalId,
};

export default ArtikelBesitzerService;
