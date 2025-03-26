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
  const artikelOwners = await database
    .get("artikel_besitzer")
    .query(Q.where("gw_id", artikel.id))
    .fetch();
  console.log(artikelOwners);
  return artikelOwners;
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
      await database.batch(
        ...artikelOwner.map((artikel) => artikel.prepareDestroyPermanently())
      );
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
  if (
    updatedArtikelBesitzer.menge !== null &&
    updatedArtikelBesitzer.menge !== undefined
  ) {
    await ArtikelService.updateInventurArtikel(artikelId.gwId, {
      menge: Number(updatedArtikelBesitzer.menge),
    });
  }
  return await database.write(async () => {
    let text;
    if (updatedArtikelBesitzer.menge < 0) {
      text = "Entnehmen";
    } else {
      text = "Nachfüllen";
    }
    await database.get("logs").create((log) => {
      log.beschreibung = text;
      log.menge = Number(updatedArtikelBesitzer.menge);
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
        art.menge = updatedArtikelBesitzer.menge;
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

async function updateArtikelBesitzerMengeByGwIdAndRegalId(
  updatedArtikelBesitzer,
  regalId,
  gwId
) {
  return await database.write(async () => {
    const artikelId = await ArtikelService.getArtikelById(gwId);
    console.log("_*_*___*_*__*_*");
    console.log(artikelId);
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
    if (updatedArtikelBesitzer.menge < 0) {
      text = "Entnehmen";
    } else {
      text = "Nachfüllen";
    }
    await database.get("logs").create((log) => {
      log.beschreibung = text;
      log.menge = Number(updatedArtikelBesitzer.menge);
      log.gesamtMenge =
        Number(artikelBesitzer[0].menge) + Number(updatedArtikelBesitzer.menge);
      log.artikel.set(artikelId);
      log.createdAt = Date.now();
    });

    if (
      updatedArtikelBesitzer.menge !== null &&
      updatedArtikelBesitzer.menge !== undefined
    ) {
      await ArtikelService.updateArtikel(artikelId.gwId, {
        menge: Number(artikelId.menge + updatedArtikelBesitzer.menge),
      });
    }

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
  updateArtikelBesitzerMengeByGwIdAndRegalId,
};

export default ArtikelBesitzerService;
