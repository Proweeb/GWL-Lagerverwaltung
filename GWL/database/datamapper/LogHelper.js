import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { database } from "../database";
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
        // Direct database query instead of using ArtikelService
        const artikelResults = await database
          .get("artikel")
          .query(Q.where("gw_id", gwId))
          .fetch();

        if (artikelResults.length === 0) {
          throw new Error(ErrorMessages.ARTICLE_NOT_FOUND);
        }
        artikel = artikelResults[0];
      }

      if (regalId !== null) {
        // Direct database query instead of using RegalService
        const regalResults = await database
          .get("regale")
          .query(Q.where("regal_id", regalId))
          .fetch();

        if (regalResults.length === 0) {
          throw new Error(ErrorMessages.REGAL_NOT_FOUND);
        }
        regal = regalResults[0];
      }

      // Generate a more unique ID using timestamp and random bytes
      const timestamp = Date.now();
      const randomBytes = crypto.getRandomValues(new Uint8Array(4));
      const hash = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
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
        status: artikel ? artikel.status : null,
        createdAt: logData.createdAt || new Date()
      };

      const logs = await this.getAllLogs();
      logs.unshift(newLog);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
      this.notifyListeners(logs);
      return newLog;
    } catch (error) {
      console.error('Error creating log:', error);
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
      return logs.filter((log) => log.gwId === artikel_id);
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
      const artikelLogs = logs.filter((log) => log.gwId === artikel_id);
      return { regalLogs, artikelLogs };
    } catch (error) {
      console.error("Error getting logs by regal and artikel id:", error);
      return { regalLogs: [], artikelLogs: [] };
    }
  }

  static async deleteAllLogs() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
      this.notifyListeners([]);
      return true;
    } catch (error) {
      console.error("Error deleting all logs:", error);
      throw error;
    }
  }

  static async deleteLogByArtikelId(artikel_id) {
    try {
      const logs = await this.getAllLogs();
      const filteredLogs = logs.filter((log) => log.gwId !== artikel_id);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredLogs));
      this.notifyListeners(filteredLogs);
      return true;
    } catch (error) {
      console.error("Error deleting logs by artikel id:", error);
      throw new Error(ErrorMessages.LOG_NOT_FOUND);
    }
  }

  static async deleteLogByRegalId(regal_id) {
    try {
      const logs = await this.getAllLogs();
      const filteredLogs = logs.filter((log) => log.regalId !== regal_id);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredLogs));
      this.notifyListeners(filteredLogs);
      return true;
    } catch (error) {
      console.error("Error deleting logs by regal id:", error);
      throw error;
    }
  }

  static async deleteLogByRegalIdAndArtikelId(regal_id, artikel_id) {
    try {
      const logs = await this.getAllLogs();
      const filteredLogs = logs.filter(
        (log) => !(log.regalId === regal_id && log.gwId === artikel_id)
      );
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredLogs));
      this.notifyListeners(filteredLogs);
      return true;
    } catch (error) {
      console.error("Error deleting logs by regal and artikel id:", error);
      throw error;
    }
  }

}

export default LogService;
