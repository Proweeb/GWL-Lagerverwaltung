export default Log;

import { database } from "../database";
import Log from "../models/Log";

// Create a new Log entry
export async function createLog(logData) {
  await database.write(async () => {
    const newLog = await database.get("logs").create((log) => {
      log.beschreibung = logData.beschreibung;
      log.datum = logData.datum;
      log.menge = logData.menge;
      log.regal_id = logData.regal_id;
      log.gwid = logData.gwid;
    });

    console.log("✅ Neuer Log gespeichert:", newLog);
  });

  // Fetch and log all Log entries by gwid
  const newlyAdded = await database
    .get("logs")
    .query(Log.where("gwid", logData.gwid))
    .fetch();
  console.log("✅ Neuer Log gespeichert:", newlyAdded);
}

// Read a Log by ID
export async function getLogById(id) {
  const log = await database.get("logs").find(id);
  console.log("📋 Log gefunden:", log);
  return log;
}

// Read all Logs
export async function getAllLogs() {
  const logs = await database.get("logs").query().fetch();
  console.log("📋 Alle Logs:", logs);
  return logs;
}

// Update a Log by ID
export async function updateLog(id, logData) {
  await database.write(async () => {
    const log = await database.get("logs").find(id);
    await log.update((log) => {
      log.beschreibung = logData.beschreibung || log.beschreibung;
      log.datum = logData.datum || log.datum;
      log.menge = logData.menge || log.menge;
      log.regal_id = logData.regal_id || log.regal_id;
      log.gwid = logData.gwid || log.gwid;
    });

    console.log("✅ Log aktualisiert:", log);
  });
}

// Delete a Log by ID
export async function deleteLog(id) {
  await database.write(async () => {
    const log = await database.get("logs").find(id);
    await log.destroyPermanently();

    console.log("✅ Log gelöscht:", log);
  });
}
