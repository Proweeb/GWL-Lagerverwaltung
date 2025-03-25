import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx/xlsx.mjs";
import ArtikelBesitzerService from "../../../database/datamapper/ArtikelBesitzerHelper";
import RegalService from "../../../database/datamapper/RegalHelper";
import ArtikelService from "../../../database/datamapper/ArtikelHelper";
import { styles } from "../../../components/styles";
import Toast from "react-native-toast-message";

XLSX.set_fs(FileSystem);

const ExportScreen = () => {
  const [fileName, setFileName] = useState("");

  const getDefaultFileName = () => {
    const now = new Date();
    return `export_${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}.xlsx`;
  };

  // const exportData = async () => {
  //   try {
  //     // Use Expo's Asset to get the URI of the template file
  //     const asset = Asset.fromModule(templateFile);
  //     const { localUri } = await asset.downloadAsync(); // Use downloadAsync to get localUri

  //     if (!localUri) {
  //       throw new Error("Template file could not be loaded.");
  //     }

  //     // Log the localUri for debugging purposes
  //     console.log("Template local URI:", localUri);

  //     // Read the template file as base64
  //     const fileContent = await FileSystem.readAsStringAsync(localUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     const workbook = XLSX.read(fileContent, { type: "base64" });

  //     // Retrieve data from the database
  //     const regale = await RegalService.getAllRegal();
  //     const artikel = await ArtikelService.getAllArtikel();

  //     if (!regale.length && !artikel.length) {
  //       Alert.alert("Fehler", "Keine Daten zum Exportieren vorhanden.");
  //       return;
  //     }

  //     // Format data for the "Regale" sheet
  //     const regalSheetData = regale.map((r) => ({
  //       "Regal ID": r.regalId,
  //       "Regal Name": r.regalName,
  //       "Fach Name": r.fachName,
  //       "Erstellt am": new Date(r.createdAt).toLocaleDateString(),
  //     }));

  //     // // Get the Regal sheet and find the last row to append data
  //     // const regalSheet = workbook.Sheets["Regale"];
  //     // const regalRange = XLSX.utils.decode_range(regalSheet["!ref"]);
  //     // const lastRow = regalRange.e.r + 1; // Get the last row index

  //     // Append the Regal data to the sheet without deleting the existing table
  //     // regalSheetData.forEach((r, index) => {
  //     //   const rowIndex = lastRow + index; // Start appending from the last row
  //     //   for (const [key, value] of Object.entries(r)) {
  //     //     const cell = { v: value };
  //     //     regalSheet[
  //     //       XLSX.utils.encode_cell({
  //     //         r: rowIndex,
  //     //         c: Object.keys(r).indexOf(key),
  //     //       })
  //     //     ] = cell;
  //     //   }
  //     // });

  //     // // Format data for the "Artikel" sheet with hyperlinks to "Regale"
  //     // const artikelSheetData = artikel.map((a, index) => ({
  //     //   GWID: a.gwId,
  //     //   "Firmen ID": a.firmenId,
  //     //   Beschreibung: a.beschreibung,
  //     //   Menge: a.menge,
  //     //   Mindestmenge: a.mindestMenge,
  //     //   Kunde: a.kunde,
  //     //   "Regal ID": {
  //     //     t: "s",
  //     //     v: a.regalId,
  //     //     l: { Target: `#Regale!A${index + 2}`, Tooltip: "Zum Regal" },
  //     //   },
  //     //   Ablaufdatum: a.ablaufdatum
  //     //     ? new Date(a.ablaufdatum).toLocaleDateString()
  //     //     : "",
  //     // }));

  //     // // Get the Artikel sheet and find the last row to append data
  //     // const artikelSheet = workbook.Sheets["Artikel"];
  //     // const artikelRange = XLSX.utils.decode_range(artikelSheet["!ref"]);
  //     // const lastArtikelRow = artikelRange.e.r + 1; // Get the last row index

  //     // // Append the Artikel data to the sheet without deleting the existing table
  //     // artikelSheetData.forEach((a, index) => {
  //     //   const rowIndex = lastArtikelRow + index; // Start appending from the last row
  //     //   for (const [key, value] of Object.entries(a)) {
  //     //     const cell = { v: value };
  //     //     artikelSheet[
  //     //       XLSX.utils.encode_cell({
  //     //         r: rowIndex,
  //     //         c: Object.keys(a).indexOf(key),
  //     //       })
  //     //     ] = cell;
  //     //   }
  //     // });

  //     // Define export file name
  //     const exportFileName = fileName
  //       ? `${fileName}.xlsx`
  //       : `export_${new Date().toISOString().slice(0, 10)}.xlsx`;
  //     const fileUri = FileSystem.documentDirectory + exportFileName;

  //     // Convert workbook to base64 and save
  //     const excelBuffer = XLSX.write(workbook, {
  //       bookType: "xlsx",
  //       type: "base64",
  //     });

  //     await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     // Share the file
  //     await Sharing.shareAsync(localUri);
  //     Alert.alert(
  //       "Erfolg",
  //       "Datei wurde erfolgreich exportiert und gespeichert!"
  //     );
  //   } catch (error) {
  //     console.error("Fehler beim Export:", error);
  //     Alert.alert("Fehler", "Export fehlgeschlagen.");
  //   }
  // };
  // const exportData = async () => {
  //   try {
  //     // Use Expo's Asset to get the URI of the template file
  //     const asset = Asset.fromModule(templateFile);
  //     const { localUri } = await asset.downloadAsync(); // Use downloadAsync to get localUri

  //     if (!localUri) {
  //       throw new Error("Template file could not be loaded.");
  //     }

  //     // Log the localUri for debugging purposes
  //     console.log("Template local URI:", localUri);

  //     // Read the template file as base64
  //     const fileContent = await FileSystem.readAsStringAsync(localUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     const workbook = XLSX.read(fileContent, { type: "base64" });

  //     // Retrieve data from the database
  //     const regale = await RegalService.getAllRegal();
  //     const artikel = await ArtikelService.getAllArtikel();

  //     if (!regale.length && !artikel.length) {
  //       Alert.alert("Fehler", "Keine Daten zum Exportieren vorhanden.");
  //       return;
  //     }

  //     // Format data for the "Regale" sheet
  //     const regalSheetData = regale.map((r) => ({
  //       "Regal ID": r.regalId,
  //       "Regal Name": r.regalName,
  //       "Fach Name": r.fachName,
  //       "Erstellt am": new Date(r.createdAt).toLocaleDateString(),
  //     }));

  //     // Get the Regal sheet and find the last row to append data
  //     const regalSheet = workbook.Sheets["Regale"];
  //     const regalRange = XLSX.utils.decode_range(regalSheet["!ref"]);
  //     const lastRow = regalRange.e.r + 1; // Get the last row index

  //     // Append the Regal data to the sheet without deleting the existing table
  //     regalSheetData.forEach((r, index) => {
  //       const rowIndex = lastRow + index; // Start appending from the last row
  //       for (const [key, value] of Object.entries(r)) {
  //         const cell = { v: value };
  //         regalSheet[
  //           XLSX.utils.encode_cell({
  //             r: rowIndex,
  //             c: Object.keys(r).indexOf(key),
  //           })
  //         ] = cell;
  //       }
  //     });

  //     // Format data for the "Artikel" sheet with hyperlinks to "Regale"
  //     const artikelSheetData = artikel.map((a, index) => ({
  //       GWID: a.gwId,
  //       "Firmen ID": a.firmenId,
  //       Beschreibung: a.beschreibung,
  //       Menge: a.menge,
  //       Mindestmenge: a.mindestMenge,
  //       Kunde: a.kunde,
  //       "Regal ID": {
  //         t: "s",
  //         v: a.regalId,
  //         l: { Target: `#Regale!A${index + 2}`, Tooltip: "Zum Regal" },
  //       },
  //       Ablaufdatum: a.ablaufdatum
  //         ? new Date(a.ablaufdatum).toLocaleDateString()
  //         : "",
  //     }));

  //     // Get the Artikel sheet and find the last row to append data
  //     const artikelSheet = workbook.Sheets["Artikel"];
  //     const artikelRange = XLSX.utils.decode_range(artikelSheet["!ref"]);
  //     const lastArtikelRow = artikelRange.e.r + 1; // Get the last row index

  //     // Append the Artikel data to the sheet without deleting the existing table
  //     artikelSheetData.forEach((a, index) => {
  //       const rowIndex = lastArtikelRow + index; // Start appending from the last row
  //       for (const [key, value] of Object.entries(a)) {
  //         const cell = { v: value };
  //         artikelSheet[
  //           XLSX.utils.encode_cell({
  //             r: rowIndex,
  //             c: Object.keys(a).indexOf(key),
  //           })
  //         ] = cell;
  //       }
  //     });

  //     // Optionally, rename the file or overwrite it
  //     const exportFileName = fileName
  //       ? `${fileName}.xlsx`
  //       : `export_${new Date().toISOString().slice(0, 10)}.xlsx`;

  //     // You can use the original `localUri` path or save to a new file.
  //     // For renaming, simply provide a new file path.
  //     const fileUri = FileSystem.documentDirectory + exportFileName;

  //     // Convert workbook to base64 and save it
  //     const excelBuffer = XLSX.write(workbook, {
  //       bookType: "xlsx",
  //       type: "base64",
  //     });

  //     // Save the file (overwrite or rename)
  //     await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     // Optionally, if you want to overwrite the original file, use:
  //     // await FileSystem.writeAsStringAsync(localUri, excelBuffer, {
  //     //   encoding: FileSystem.EncodingType.Base64,
  //     // });

  //     // Share the file
  //     await Sharing.shareAsync(fileUri);
  //     Alert.alert(
  //       "Erfolg",
  //       "Datei wurde erfolgreich exportiert und gespeichert!"
  //     );
  //   } catch (error) {
  //     console.error("Fehler beim Export:", error);
  //     Alert.alert("Fehler", "Export fehlgeschlagen.");
  //   }
  // };
  // const exportData = async () => {
  //   try {
  //     // Fetch the Regal and Artikel data from WatermelonDB
  //     const regale = await RegalService.getAllRegal();
  //     const artikel = await ArtikelService.getAllArtikel();

  //     if (!regale.length && !artikel.length) {
  //       Alert.alert("Fehler", "Keine Daten zum Exportieren vorhanden.");
  //       return;
  //     }

  //     // Format data for the "Regale" sheet
  //     const regalSheetData = regale.map((r) => ({
  //       "Regal ID": r.regalId, // Changed from `regalId` to `id`
  //       "Regal Name": r.regalName,
  //       "Fach Name": r.fachName,
  //       "Erstellt am": new Date(r.createdAt),
  //     }));

  //     // Create the Regal sheet
  //     const regalSheet = XLSX.utils.json_to_sheet(regalSheetData);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, regalSheet, "Regale");

  //     // Fetch Regal data for each Artikel (this is the async part)
  //     const artikelSheetData = await Promise.all(
  //       artikel.map(async (a) => {
  //         // const regal = await a.regal.fetch(); // Fetch Regal for each Artikel
  //         return {
  //           GWID: a.gwId,
  //           "Firmen ID": a.firmenId,
  //           Beschreibung: a.beschreibung,
  //           Menge: a.menge,
  //           Mindestmenge: a.mindestMenge,
  //           Kunde: a.kunde,
  //           "Regal ID": "5", // Link to Regal (use `id` from Regal)
  //           Ablaufdatum: a.ablaufdatum
  //             ? new Date(a.ablaufdatum).toLocaleDateString()
  //             : "",
  //         };
  //       })
  //     );

  //     // Create the Artikel sheet
  //     const artikelSheet = XLSX.utils.json_to_sheet(artikelSheetData);
  //     XLSX.utils.book_append_sheet(workbook, artikelSheet, "Artikel");

  //     // Define export file name
  //     const exportFileName = fileName
  //       ? fileName + ".xlsx"
  //       : `export_${new Date().toISOString().slice(0, 10)}.xlsx`;

  //     const fileUri = FileSystem.documentDirectory + exportFileName;

  //     // Convert workbook to base64 and save
  //     const excelBuffer = XLSX.write(workbook, {
  //       bookType: "xlsx",
  //       type: "base64",
  //     });

  //     await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     // Share the file
  //     await Sharing.shareAsync(fileUri);

  //     Toast.show({
  //       type: "success",
  //       text1: "Export",
  //       text2: "Erfolgreich Exportiert ",
  //     });
  //   } catch (error) {
  //     console.error("Fehler beim Export:", error);

  //     Toast.show({
  //       type: "error",
  //       text1: "Export",
  //       text2: "Fehler beim Exportieren ",
  //     });
  //   }
  // };
  const exportData = async () => {
    try {
      // Fetch all data
      const regale = await RegalService.getAllRegal();
      const artikel = await ArtikelService.getAllArtikel();
      const artikelBesitzer =
        await ArtikelBesitzerService.getAllArtikelOwners();

      if (!regale.length && !artikel.length && !artikelBesitzer.length) {
        Alert.alert("Fehler", "Keine Daten zum Exportieren vorhanden.");
        return;
      }

      // Format "Regale" sheet data
      const regalSheetData = regale.map((r) => ({
        "Regal ID": r.regalId,
        "Regal Name": r.regalName,
        "Fach Name": r.fachName,
        "Erstellt am": new Date(r.createdAt).toLocaleDateString(),
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
          ? new Date(a.ablaufdatum).toLocaleDateString()
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
            "Zuletzt aktualisiert": new Date(ab.updatedAt).toLocaleDateString(),
          };
        })
      );
      const lagerplanSheet = XLSX.utils.json_to_sheet(lagerplanSheetData);

      // Create workbook and append sheets
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, regalSheet, "Regale");
      XLSX.utils.book_append_sheet(workbook, artikelSheet, "Artikel");
      XLSX.utils.book_append_sheet(workbook, lagerplanSheet, "Lagerplan");

      // Define export file name
      const exportFileName = `export_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      const fileUri = FileSystem.documentDirectory + exportFileName;

      // Convert workbook to base64 and save
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "base64",
      });
      await FileSystem.writeAsStringAsync(fileUri, excelBuffer, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share the file
      const result = await Sharing.shareAsync(fileUri);
      console.log(result);
      if (result) {
        Toast.show({
          type: "success",
          text1: "Export",
          text2: "Erfolgreich Exportiert",
        });
      }
    } catch (error) {
      console.error("Fehler beim Export:", error);
      Toast.show({
        type: "error",
        text1: "Export",
        text2: "Fehler beim Exportieren",
      });
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Excel Datei Exportieren</Text>
      <View style={styles.card}>
        <View style={styles.fileBox}>
          <TextInput
            placeholder={getDefaultFileName()}
            style={{ textAlign: "center" }}
            value={fileName}
            onChangeText={setFileName}
          />
        </View>
        <TouchableOpacity
          style={[styles.buttonBlue, { backgroundColor: styles.lightRed }]}
          onPress={exportData}
        >
          <Text style={[styles.buttonTextLightBlue, { color: "red" }]}>
            Exportieren
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExportScreen;
