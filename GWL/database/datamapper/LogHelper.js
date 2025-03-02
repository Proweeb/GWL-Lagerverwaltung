import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { database } from "../database";
import Log from "../models/Log";
import ArtikelService from "./ArtikelHelper";
import RegalService from "./RegalHelper";
import { Q } from "@nozbe/watermelondb";

async function createLog(logData, artikelId, regalId) {
  let artikel = null;
  let regal = null;
  if (artikelId !== null) {
    artikel = await ArtikelService.getArtikelById(artikelId);
  }
  if (regalId !== null) {
    regal = await RegalService.getRegalById(regalId);
  }
  return await database.write(async () => {
    return database.get("logs").create((log) => {
      log.beschreibung = logData.beschreibung;
      log.menge = logData.mengea;
      log.gesamtMenge = logData.gesamtMenge;
      log.artikel.set(artikel);
      log.regal.set(regal);
      if (logData.createdAt) {
        log.createdAt = logData.createdAt;
      }
    });
  });
}

async function getAllLogs() {
  return await database.get("logs").query().fetch();
}

async function getLogByArtikelId(artikel_id) {
  const artikel = await ArtikelService.getArtikelById(artikel_id);
  return await artikel.logs.fetch();
}

async function getLogByRegalId(regal_id) {
  const regal = await RegalService.getRegalById(regal_id);
  return await regal.logs.fetch();
}

async function getLogByRegalIdAndArtikelId(regal_id, artikel_id) {
  const regal = await RegalService.getRegalById(regal_id);
  const artikel = await ArtikelService.getArtikelById(artikel_id);

  const regalLogs = await regal.logs.fetch();
  const artikelLogs = await artikel.logs.fetch();

  return { regalLogs, artikelLogs };
}

async function deleteLogByArtikelId(artikel_id) {
  const artikel = await ArtikelService.getArtikelById(artikel_id);
  return await database.write(async () => {
    const logs = await artikel.logs.fetch();
    for (let i = 0; i < logs.length; i++) {
      await logs[i].destroyPermanently();
    }
  });
}

async function deleteLogByRegalId(regal_id) {
  const regal = await RegalService.getRegalById(regal_id);
  return await database.write(async () => {
    const logs = await regal.logs.fetch();
    for (let i = 0; i < logs.length; i++) {
      await logs[i].destroyPermanently();
    }
  });
}

async function deleteLogByRegalIdAndArtikelId(regal_id, artikel_id) {
  console.log("hier");
  const regal = await RegalService.getRegalById(regal_id);
  const artikel = await ArtikelService.getArtikelById(artikel_id);
  return await database.write(async () => {
    const artikelLogs = await artikel.logs.fetch();
    const logs = await regal.logs.fetch();
    for (let i = 0; i < logs.length; i++) {
      if (artikelLogs[i] === logs[i]) {
        await logs[i].destroyPermanently();
      }
    }
  });
}
const LogService = {
  createLog,
  getAllLogs,
  getLogByArtikelId,
  getLogByRegalId,
  getLogByRegalIdAndArtikelId,
  deleteLogByArtikelId,
  deleteLogByRegalId,
  deleteLogByRegalIdAndArtikelId,
};

export default LogService;
