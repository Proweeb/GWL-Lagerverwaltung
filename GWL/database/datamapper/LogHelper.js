import { database } from "../database";
import Log from "../models/Log";

async function createLog(logData, artikelId, regalId) {
    return await database.write(async () => {
      return database.get("logs").create((log) => {
        log.beschreibung = logData.beschreibung;
        log.datum = new Date().toISOString();
        log.menge = logData.menge;
        log.artikel.set(artikelId);
        log.regal.set(regalId);
      });
    });
  }

  async function getAllLogs() {
    return await database.get("logs").query().fetch();
  }
  
  async function updateLog(id, updatedData) {
    return await database.write(async () => {
      const log = await database.get("logs").find(id);
      await log.update((logRecord) => {
        Object.assign(logRecord, updatedData);
      });
    });
  }
  async function deleteLog(id) {
    return await database.write(async () => {
      const log = await database.get("logs").find(id);
      await log.destroyPermanently();
    });
  }