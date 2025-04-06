import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { composeEmailWithDefault } from './emailUtils';
import { EmailBodies } from '../../enum';
import LogService from '../../../database/datamapper/LogHelper';
import RegalService from '../../../database/datamapper/RegalHelper';
import ArtikelService from '../../../database/datamapper/ArtikelHelper';
import ArtikelBesitzerService from '../../../database/datamapper/ArtikelBesitzerHelper';
const createLogsBackupFile = async () => {
  try {
    const logsQuery = await LogService.getAllLogs();
    
    if (!logsQuery.length) {
      throw new Error("Keine Logs zum Exportieren vorhanden.");
    }

    const logsData = logsQuery.map((log) => ({
      Beschreibung: log.beschreibung,
      "Gesamt Menge": log.gesamtMenge,
      "Regal ID": log.regalId || "",
      GWID: log.gwId || "",
      Menge: log.menge,
      "Erstellt am": new Date(log.createdAt).toLocaleDateString(),
    }));

    // Create worksheet
    const logsSheet = XLSX.utils.json_to_sheet(logsData);

    // Create workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, logsSheet, "Trackingliste");

    // Define export file name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportFileName = `logs_backup_${timestamp}.xlsx`;
    const fileUri = FileSystem.documentDirectory + exportFileName;

    // Convert workbook to base64 and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "base64",
    });
    await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return fileUri;
  } catch (error) {
    console.error("Fehler beim Erstellen des Logs-Backups:", error);
    throw error;
  }
};

const createDatabaseBackupFile = async () => {
  try {
    const regale = await RegalService.getAllRegal();
    const artikel = await ArtikelService.getAllArtikel();
    const artikelBesitzer = await ArtikelBesitzerService.getAllArtikelOwners();

    if (!regale.length && !artikel.length && !artikelBesitzer.length) {
      throw new Error("Keine Daten zum Exportieren vorhanden.");
    }

    // Format "Regale" sheet data
    const regalSheetData = regale.map((r) => ({
      "Regal ID": r.regalId,
      "Regal Name": r.regalName,
      "Fach Name": r.fachName,
      "Erstellt am": new Date(r.createdAt).toLocaleDateString("de-DE"),
    }));
    const regalSheet = XLSX.utils.json_to_sheet(regalSheetData);

    // Format "Artikel" sheet data
    const artikelSheetData = artikel.map((a) => ({
      GWID: a.gwId,
      "Firmen ID": a.firmenId,
      Beschreibung: a.beschreibung,
      Gesamtmenge: a.menge,
      Mindestmenge: a.mindestMenge,
      Kunde: a.kunde,
      Ablaufdatum: a.ablaufdatum
        ? new Date(a.ablaufdatum).toLocaleDateString("de-DE")
        : "",
    }));
    const artikelSheet = XLSX.utils.json_to_sheet(artikelSheetData);

    // Format "Lagerplan" sheet data
    const lagerplanSheetData = await Promise.all(
      artikelBesitzer.map(async (ab) => {
        const artikel = await ab.artikel.fetch();
        const regal = await ab.regal.fetch();
        return {
          Beschreibung: artikel.beschreibung,
          GWID: artikel.gwId,
          "Regal ID": regal.regalId,
          "Regal Name": regal.regalName,
          Menge: ab.menge,
          "Zuletzt aktualisiert": new Date(ab.updatedAt).toLocaleDateString("de-DE"),
        };
      })
    );
    const lagerplanSheet = XLSX.utils.json_to_sheet(lagerplanSheetData);

    // Create workbook and append sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, regalSheet, "Regale");
    XLSX.utils.book_append_sheet(workbook, artikelSheet, "Artikel");
    XLSX.utils.book_append_sheet(workbook, lagerplanSheet, "Lagerplan");

    // Define backup file name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `db_backup_${timestamp}.xlsx`;
    const fileUri = FileSystem.documentDirectory + backupFileName;

    // Convert workbook to base64 and save
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "base64",
    });
    
    await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return fileUri;
  } catch (error) {
    console.error("Fehler beim Erstellen des Datenbank-Backups:", error);
    throw error;
  }
};

export const performBackup = async (types) => {
  try {
    const attachments = [];
    let subject = 'Backup ';
    let body = '';

    for (const type of types) {
      let fileUri;
      if (type === 'logs') {
        // Create log entry for logs backup
        await LogService.createLog(
          { beschreibung: logTypes.ExportLog },
          null,
          null
        );
        fileUri = await createLogsBackupFile();
        subject += 'Logs ';
        body += EmailBodies.LOGS_BACKUP;
      } else {
        // Create log entry for database backup
        await LogService.createLog(
          { beschreibung: logTypes.BackupDB },
          null,
          null
        );
        fileUri = await createDatabaseBackupFile();
        subject += 'Datenbank ';
        body += EmailBodies.DATABASE_BACKUP;
      }
      attachments.push(fileUri);
    }

    subject += new Date().toLocaleDateString('de-DE');
    body += EmailBodies.SIGNATURE;

    await composeEmailWithDefault({
      subject,
      body,
      attachments
    });

    return true;
  } catch (error) {
    console.error(`Error performing backup:`, error);
    throw error;
  }
};

export const checkBackupNeeded = async (reminderSetting, lastBackupDate) => {
  if (reminderSetting === "Nie") {
    return false;
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to start of day

  const lastBackup = lastBackupDate ? new Date(lastBackupDate) : now;
  lastBackup.setHours(0, 0, 0, 0); // Set to start of day

  // Calculate difference in milliseconds
  const diffTime = Math.abs(now - lastBackup);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  switch (reminderSetting) {
    case "Täglich":
      return diffDays >= 1;
    case "Alle 2 Wochen":
      return diffDays >= 14;
    case "Alle 3 Wochen":
      return diffDays >= 21;
    case "Monatlich":
      return diffDays >= 30;
    case "Alle 3 Monate":
      return diffDays >= 90;
    default:
      return false;
  }
}; 