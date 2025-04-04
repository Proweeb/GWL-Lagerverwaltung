import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { database } from "../database";
import Log from "../models/Log";
import ArtikelService from "./ArtikelHelper";
import RegalService from "./RegalHelper";
import { Q } from "@nozbe/watermelondb";
import { ErrorMessages } from "../../components/enum";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";

class LogService {
  static STORAGE_KEY = "@logs";
  static listeners = new Set();

  static subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  static notifyListeners(logs) {
    this.listeners.forEach((callback) => callback(logs));
  }

  static async createLog(logData, gwId, regalId) {

    try {
      let artikel = null;
      let regal = null;

      if (gwId !== null) {
        artikel = await ArtikelService.getArtikelById(gwId);
      }
      if (regalId !== null) {
        regal = await RegalService.getRegalById(regalId);
      }

      // Generate a more unique ID using timestamp and random bytes
      const timestamp = Date.now();
      const randomBytes = new Uint8Array(4);
      crypto.getRandomValues(randomBytes);
      const hash = Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const uniqueId = `${timestamp}-${hash}`;

      const newLog = {
        id: uniqueId,
        artikelName: artikel ? artikel.beschreibung : null,
        beschreibung: logData.beschreibung,
        menge: logData.menge,
        gesamtMenge: logData.gesamtMenge,
        artikelId: artikel ? artikel.id : null,
        regalId: regal ? regal.regalId : null,
        gwId: artikel ? artikel.gwId : null,
        createdAt: logData.createdAt || new Date(),
        isBackup: false,
      };

      const logs = await this.getAllLogs();
      logs.unshift(newLog);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
      this.notifyListeners(logs);
      return newLog;
    } catch (error) {
      console.error("Error creating log:", error);
      throw error;
    }
  }

  static async getAllLogs() {
    try {
      const logs = await AsyncStorage.getItem(this.STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error("Error getting logs:", error);
      return [];
    }
  }

  static async getLogByArtikelId(artikel_id) {
    try {
      const logs = await this.getAllLogs();
      return logs.filter((log) => log.artikelId === artikel_id);
    } catch (error) {
      console.error("Error getting logs by artikel id:", error);
      return [];
    }
  }

  static async getLogByRegalId(regal_id) {
    try {
      const logs = await this.getAllLogs();
      return logs.filter((log) => log.regalId === regal_id);
    } catch (error) {
      console.error("Error getting logs by regal id:", error);
      return [];
    }
  }

  static async getLogByRegalIdAndArtikelId(regal_id, artikel_id) {
    try {
      const logs = await this.getAllLogs();
      const regalLogs = logs.filter((log) => log.regalId === regal_id);
      const artikelLogs = logs.filter((log) => log.artikelId === artikel_id);
      return { regalLogs, artikelLogs };
    } catch (error) {
      console.error("Error getting logs by regal and artikel id:", error);
      return { regalLogs: [], artikelLogs: [] };
    }
  }

  static async deleteLogByArtikelId(artikel_id) {
    try {
      const logs = await this.getAllLogs();
      const filteredLogs = logs.filter((log) => log.artikelId !== artikel_id);
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(filteredLogs)
      );
      this.notifyListeners(filteredLogs);
    } catch (error) {
      console.error("Error deleting logs by artikel id:", error);
      throw new Error(ErrorMessages.LOG_NOT_FOUND);
    }
  }

  static async deleteLogByRegalId(regal_id) {
    try {
      const logs = await this.getAllLogs();
      const filteredLogs = logs.filter((log) => log.regalId !== regal_id);
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(filteredLogs)
      );
      this.notifyListeners(filteredLogs);
    } catch (error) {
      console.error("Error deleting logs by regal id:", error);
      throw error;
    }
  }

  static async deleteLogByRegalIdAndArtikelId(regal_id, artikel_id) {
    try {
      const logs = await this.getAllLogs();
      const filteredLogs = logs.filter(
        (log) => !(log.regalId === regal_id && log.artikelId === artikel_id)
      );
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(filteredLogs)
      );
      this.notifyListeners(filteredLogs);
    } catch (error) {
      console.error("Error deleting logs by regal and artikel id:", error);
      throw error;
    }
  }

  static async BackupLogByArtikelId(artikelId) {
    try {
      const logs = await this.getAllLogs();
      const updatedLogs = logs.map((log) => {
        if (log.artikelId === artikelId && !log.isBackup) {
          return {
            ...log,
            isBackup: true,
            regalId: log.regalId,
            gwId: log.gwId,
          };
        }
        return log;
      });
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedLogs));
      this.notifyListeners(updatedLogs);
    } catch (error) {
      console.error("Error backing up logs:", error);
      throw error;
    }
  }
}

async function createLog(logData, gwId, regalId) {
  // Generate a more unique ID by combining timestamp with random characters
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const uniqueId = `${timestamp}-${random}`;

  const log = {
    id: uniqueId,
    beschreibung: logData.beschreibung,
    menge: logData.menge,
    gesamtMenge: logData.gesamtMenge,
    regalId: logData.regalId,
    createdAt: logData.createdAt,
    gwId: gwId,
  };

  // Save to AsyncStorage
  const logs = await AsyncStorage.getItem("logs");
  const parsedLogs = logs ? JSON.parse(logs) : [];
  parsedLogs.push(log);
  await AsyncStorage.setItem("logs", JSON.stringify(parsedLogs));

  // Notify listeners
  listeners.forEach((listener) => listener(log));

  return log;
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
    if (logs.length === 0) {
      throw new Error(ErrorMessages.LOG_NOT_FOUND);
    }
    for (let i = 0; i < logs.length; i++) {
      await logs[i].destroyPermanently();
    }
  });
}

async function BackupLogByArtikelId(artikelId) {
  const artikel = await ArtikelService.getArtikelById(artikelId);

  await database.write(async () => {
    const logs = await database.get("logs").query().fetch();

    const updates = await Promise.all(
      logs.map(async (log) => {
        try {
          if (log.isBackup) {
            return null;
          }
          // Fetch regal and artikel for the log
          const regal = log.regal ? await log.regal.fetch() : null;
          const artikel = log.artikel ? await log.artikel.fetch() : null;

          if (!artikel || artikel.gwId !== artikelId) {
            return null;
          }

          return log.prepareUpdate((logRecord) => {
            logRecord.isBackup = true;
            logRecord.regalId = regal ? regal.regalId : null;
            logRecord.gwId = artikel.gwId;
          });
        } catch (error) {
          console.error(`Error processing log ${log.id}:`, error);
          return null;
        }
      })
    );

    const validUpdates = updates.filter(Boolean);

    await database.batch(...validUpdates);
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

export default LogService;
