import { database } from "../database";
import { Q } from "@nozbe/watermelondb";
import Regal from "../models/Regal";
import { logTypes, ErrorMessages } from "../../components/enum";

async function createRegal(regalData) {
  return database.write(async () => {
    const existingRegal = await database
      .get("regale")
      .query(Q.where("regalId", regalData.regalId))
      .fetch();

    if (existingRegal.length > 0) {
      throw new Error(ErrorMessages.REGAL_EXISTS);
    }
    const regal = await database.get("regale").create((regal) => {
      regal.regalId = regalData.regalId;
      regal.fachName = regalData.fachName;
      regal.regalName = regalData.regalName;
    });
    await database.get("logs").create((log) => {
      log.beschreibung = logTypes.LagerplatzHinzufügen;
      log.regal.set(regal);
      log.createdAt = Date.now();
    });
    return regal;
  });
}

async function getAllRegal() {
  return await database.get("regale").query().fetch();
}

async function getRegalById(regalid) {
  const regal = await database
    .get("regale")
    .query(Q.where("regal_id", regalid))
    .fetch();

  if (regal.length < 1) {
    throw new Error(ErrorMessages.REGAL_NOT_FOUND);
  }
  return regal[0];
}

async function updateRegal(regalid, updatedData) {
  return await database.write(async () => {
    const regal = await database
      .get("regale")
      .query(Q.where("regal_id", regalid))
      .fetch();

    if (!regal.length) {
      throw new Error(ErrorMessages.REGAL_NOT_FOUND);
    }

    await regal[0].update((reg) => {
      if (updatedData.regalId !== undefined) {
        reg.regalId = updatedData.regalId;
      }
      if (updatedData.fachName !== undefined) {
        reg.fachName = updatedData.fachName;
      }
      if (updatedData.regalName !== undefined) {
        reg.regalName = updatedData.regalName;
      }
    });
    return regal[0];
  });
}

async function deleteRegal(regalid) {
  return await database.write(async () => {
    const regal = await database
      .get("regale")
      .query(Q.where("regal_id", regalid))
      .fetch();

    if (regal.length < 1) {
      throw new Error(ErrorMessages.REGAL_NOT_FOUND);
    }

    await regal[0].destroyPermanently();
  });
}

const RegalService = {
  createRegal,
  deleteRegal,
  updateRegal,
  getAllRegal,
  getRegalById,
};

export default RegalService;
