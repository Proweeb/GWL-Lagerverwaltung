export const logTypes = {
  artikelEntnehmen: "Entnehmen",
  artikelEinlagern: "Einlagern",
  artikelNachfüllen: "Nachfüllen",
  LagerplatzHinzufügen: "Lagerplatz hinzugefügt",
  StartInventur: "Inventur gestartet",
  EndeInventur: "Inventurliste gesendet",
  StartImportDB: "Import gestartet",
  ImportDB: "Lagerliste  importiert",
  ExportDB: "Lagerliste  exportiert",
  ExportLog: "Backup Trackingliste gesendet",
  BackupDB: "Backup Lagerliste gesendet",
  artikelGeloescht: "Gelöscht",
  ExportTrackingliste: "Trackingliste exportiert",
};

export const ErrorMessages = {
  ARTICLE_NOT_FOUND: "Artikel existiert nicht",
  REGAL_NOT_FOUND: "Regal existiert nicht",
  ARTIKELBESITZER_NOT_FOUND: "ArtikelBesitzer exisitert nicht",
  LOG_NOT_FOUND: "Log existiert nicht",
  ARTICLE_EXISTS: "Artikel exisitert bereits",
  REGAL_EXISTS: "Regal exisitert bereits",
  ARTIKELBESITZER_EXISTS: "ArtikelBesitzer existiert bereits",
};

export const ToastMessages = {
  WARNING: "Warnung",
  ERROR: "Error",
  ERFOLG: "Erfolg",
  ARTICLE_IN_REGAL: "Artikel befindet sich schon im Regal",
  REGAL_NOT_FOUND: "Regal existert nicht",
  ARTICLE_EINGELAGERT: "Artikel wurde eingelagert:",
  ARTICLE_NOT_FOUND: "Artikel existiert nicht",
  ARTICLE_EXISTS: "Artikel existiert bereits",
  ARTICLE_NOT_IN_REGAL: "Artikel ist nicht im Regal",
  FEHLER_BEIM_FINDEN: "Fehler beim Finden",
  ARTICLE_EMPTY: "Artikel ist leer",
  ARTICLE_ALMOST_EMPTY: "Artikel ist bald leer",
  ARTICLE_UPDATED: "Artikel wurde aktualisiert",
  ARTICLE_UPDATED_ERROR: "Fehler beim Aktualisieren",
  REGALFORMAT_FALSCH: "RegalID hat das falsche Format",
  REGAL_ALREADY_EXISTS: "Regal existiert bereits",
  ARTICLE_REGAL_GESPEICHERT: "Artikel und Regal wurden gespeichert",
  DEFAULT: "Ein unerwarterter Fehler ist aufgetaucht",
  ARTICLE_DELETED: "Artikel wurde gelöscht",
  EMPTY_FIELDS: "Füllen Sie alle Felder aus, bevor Sie speichern.",
  REGAL_CREATE: "Regal wurde erstellt",
  NO_DATA: "Daten konnte nicht geladen werden",
  EXPORT_ERROR: "Fehler beim Export",
  DATEIFEHLER: "Fehler bei der Dateiauswahl",
  NO_DATEI: "Keine Datei gefunden",
  VERARBEITUNGSFEHLER: "Datei konnte nicht verarbeitet werden",
  NO_DATA_FOR_IMPORT: "Keine Datei zum importieren",
  DATA_SUCCESS: "Daten wurden importiert",
  NO_LAGERPLAN: "Kein Lagerplan gefunden",
  INVENTUR_ABGEBROCHEN: "Inventur wurde abgebrochen",
  INVENTUR_NICHT_ABGEBROCHEN: "Inventur wurde nicht abgebrochen",
  INVENTUR_START: "Inventur gestartet",
  INVENTUR_NICHT_START: "Inventur konnte nicht gestartet werden",
  INVENTUR_ABGESCHLOSSEN: "Inventur wurde abgeschlossen",
  INVENTUR_NICHT_ABGESCHLOSSEN: "Inventur wurde nicht abgeschlossen",
  INVENTURLISTE_NICHT_GESENDET: "Inventurliste wurde nicht gesendet",
  LOGS_EXPORT: "Logs erfolgreich exportiert",
  LOGS_EXPORT_ERROR: "Logs konnten nicht exportiert werden",
  SETTINGS_SAVED: "Einstellungen wurden gespeichert",
  SETTINGS_RESET: "Einstellungen wurden zurückgesetzt",
  SETTINGS_ERROR: "Fehler beim Speichern der Einstellungen",
  SEND_EMAIL_ERROR: "Fehler beim Senden der Email",
  BACKUP_SUCCESS: "Backup erfolgreich erstellt",
  BACKUP_ERROR: "Fehler beim Erstellen des Backups",
  EXPIRED_ITEMS_SENT: "Abgelaufene Artikel wurden gesendet",
};

export const Email = {
  SUBJECT: "Niedriger Lagerbestand",
};

export const EmailBodies = {
  INVENTUR_EXPORT:
    "Hier ist die exportierte Inventur-Datei.\n\nLiebe Grüße\nGWL Lagerverwaltung",
  EXPIRED_ITEMS:
    "Die folgenden Artikel haben ihr Ablaufdatum erreicht und sollten aus dem Lager entfernt werden:\n\n",
  BACKUP_EXPORT:
    "Hier ist die exportierte Backup-Datei.\n\nLiebe Grüße\nGWL Lagerverwaltung",
  LOW_STOCK: "Die folgenden Artikel haben einen niedrigen Lagerbestand:\n\n",
  SINGLE_LOW_STOCK:
    'Der Artikel "{beschreibung}" (GWID: {gwId}) hat einen niedrigen Lagerbestand.\n\n' +
    "Aktueller Bestand: {menge}\n" +
    "Mindestbestand: {mindestMenge}\n\n" +
    "Bitte veranlassen Sie die Nachproduktion.",
  DATABASE_EXPORT: "Anbei finden Sie den Export der aktuellen Datenbank.",
  DATABASE_BACKUP:
    "Anbei finden Sie das Backup der aktuellen Datenbank vor dem Import.",
  DATABASE_BACKUP2: "Anbei finden Sie das Backup der aktuellen Datenbank.",
  TRACKING_LIST:
    "Anbei finden Sie die Trackingliste für den ausgewählten Zeitraum.",
  SIGNATURE: "\n\nLiebe Grüße\nGWL Lagerverwaltung",
  LOGS_BACKUP: "Anbei finden Sie das Backup der aktuellen Trackingliste.",
};
