import { database } from "../database";
import { Q } from "@nozbe/watermelondb";
import ArtikelService from "./ArtikelHelper";
import RegalService from "./RegalHelper";
import LogService from "./LogHelper";
import { ErrorMessages, logTypes } from "../../components/enum";

async function createArtikelOwner(artikelOwnerData, artikelId, regalId) {
  let artikel = null;
  let regal = null;

  if (artikelId !== null) {
    artikel = await ArtikelService.getArtikelById(artikelId);

    await ArtikelService.updateArtikel(artikelId, {
      menge: Number(artikelOwnerData.menge),
    });
  }

  if (regalId !== null) {
    regal = await RegalService.getRegalById(regalId);
  }

  let text;
  if (artikelOwnerData.menge < 0) {
    text = logTypes.artikelEntnehmen;
  } else {
    text = logTypes.artikelNachfüllen;
  }

  return await database.write(async () => {
    const owner = database.get("artikel_besitzer").create((artikelOwner) => {
      artikelOwner.menge = artikelOwnerData.menge;
      artikelOwner.artikel.set(artikel);
      artikelOwner.regal.set(regal);

      if (artikelOwnerData.createdAt) {
        artikelOwner.createdAt = artikelOwnerData.createdAt;
      }
    });
    await LogService.createLog(
      {
        beschreibung: text,
        menge: Number(artikelOwnerData.menge),
        gesamtMenge: Number(artikel.menge),
        regalId: regal.regalId,
        createdAt: new Date(),
      },
      artikel.gwId,
      regal.regalId
    );
    return owner;
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
  const artikel = await ArtikelService.getArtikelById(gwId);

  return database.write(async () => {
    const artikelOwner = await database
      .get("artikel_besitzer")
      .query(Q.where("gw_id", artikel.id))
      .fetch();

    if (artikelOwner.length > 0) {
      await database.batch(
        ...artikelOwner.map((artikel) => artikel.prepareDestroyPermanently())
      );
    }
  });
}

async function deleteArtikelOwnerByArtikelIdAndRegalId(gwId, regalId) {
  const artikel = await ArtikelService.getArtikelById(gwId);

  const regal = await RegalService.getRegalById(regalId);

  await database.write(async () => {
    const artikelOwner = await database
      .get("artikel_besitzer")
      .query(
        Q.where("gw_id", artikel.id), // First condition: gw_id
        Q.where("regal_id", regal.id)
      )
      .fetch();

    if (artikelOwner.length < 1) {
      throw new Error(ErrorMessages.ARTIKELBESITZER_NOT_FOUND);
    }

    if (artikelOwner[0].menge > 0) {
      await LogService.createLog(
        {
          beschreibung: logTypes.artikelEntnehmen,
          menge: Number(artikelOwner[0].menge) * -1,
          gesamtMenge: Number(artikel.menge),
          regalId: regal.regalId,
          createdAt: new Date(),
        },
        artikel.gwId,
        regal.regalId
      );
    }
    await artikel.update((artikel) => {
      artikel.menge -= artikelOwner[0].menge;
    });
    if (artikelOwner.length > 0) {
      await LogService.createLog(
        {
          beschreibung: logTypes.artikelEntnehmen,
          menge: Number(artikelOwner[0].menge) * -1,
          gesamtMenge: Number(artikel.menge),
          regalId: regal.regalId,
          createdAt: new Date(),
        },
        artikel.gwId,
        regal.regalId
      );
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

async function inventurUpdateArtikelBesitzerByGwIdAndRegalId(
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
  if (artikelBesitzer.length < 1) {
    throw new Error(ErrorMessages.ARTIKELBESITZER_NOT_FOUND);
  }
  if (
    updatedArtikelBesitzer.menge !== null &&
    updatedArtikelBesitzer.menge !== undefined
  )
    return await database.write(async () => {
      let text;
      if (updatedArtikelBesitzer.menge < 0) {
        text = logTypes.artikelEntnehmen;
      } else {
        text = logTypes.artikelNachfüllen;
      }
      await LogService.createLog(
        {
          beschreibung: text,
          menge: Number(updatedArtikelBesitzer.menge),
          gesamtMenge:
            Number(artikelBesitzer[0].menge) +
            Number(updatedArtikelBesitzer.menge),
        },
        artikelId.gwId,
        newRegalId.regalId
      );

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
  const artikelId = await ArtikelService.getArtikelById(gwId);

  const newRegalId = await RegalService.getRegalById(regalId);

  const artikelBesitzer = await database
    .get("artikel_besitzer")
    .query(Q.where("gw_id", artikelId.id), Q.where("regal_id", newRegalId.id)) // Ensure "gwId" matches your schema
    .fetch();
  if (artikelBesitzer.length < 1) {
    throw new Error(ErrorMessages.ARTIKELBESITZER_NOT_FOUND);
  }
  if (
    updatedArtikelBesitzer.menge !== null &&
    updatedArtikelBesitzer.menge !== undefined
  ) {
    await ArtikelService.updateArtikel(artikelId.gwId, {
      menge: Number(updatedArtikelBesitzer.menge),
    });
  }
  return await database.write(async () => {
    let text;
    if (updatedArtikelBesitzer.menge < 0) {
      text = logTypes.artikelEntnehmen;
    } else {
      text = logTypes.artikelNachfüllen;
    }
    await LogService.createLog(
      {
        beschreibung: text,
        menge: Number(updatedArtikelBesitzer.menge),
        gesamtMenge: Number(artikelId.menge),
        regalId: newRegalId.regalId,
        createdAt: new Date(),
      },
      artikelId.gwId,
      newRegalId.regalId
    );

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
        art.menge += Number(updatedArtikelBesitzer.menge);
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
  let artikel = null;
  let regal = null;

  regal = await RegalService.getRegalById(regalId);
  artikel = await ArtikelService.getArtikelById(artikelId);

  const ArtikelBesitzer = await database
    .get("artikel_besitzer")
    .query(Q.where("gw_id", artikel.id), Q.where("regal_id", regal.id))
    .fetch();

  if (ArtikelBesitzer.length < 1) {
    throw new Error(ErrorMessages.ARTIKELBESITZER_NOT_FOUND);
  }
  return ArtikelBesitzer;
}

const ArtikelBesitzerService = {
  createArtikelOwner,
  getAllArtikelOwners,
  getArtikelOwnerByGwId,
  deleteArtikelOwnerByArtikelId,
  deleteArtikelOwnerByArtikelIdAndRegalId,
  deleteArtikelOwner,
  getArtikelOwnersByRegalId,
  getArtikelOwnersByGwIdAndRegalId,
  inventurUpdateArtikelBesitzerByGwIdAndRegalId,
  updateArtikelBesitzerMengeByGwIdAndRegalId,
};

export default ArtikelBesitzerService;
