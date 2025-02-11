import { database } from "../database";
import Artikel from "../models/Artikel";

// Create a new Artikel
export async function createArtikel(artikelData) {
  await database.write(async () => {
    const newArtikel = await database.get("artikel").create((artikel) => {
      artikel.regalId = artikelData.regalId;
      artikel.artikelGwid = artikelData.artikelGwid;
      artikel.artikelFirmenId = artikelData.artikelFirmenId;
      artikel.beschreibung = artikelData.beschreibung;
      artikel.kunde = artikelData.kunde;
      artikel.ablaufdatum = artikelData.ablaufdatum;
      artikel.menge = artikelData.menge;
      artikel.mindestmenge = artikelData.mindestmenge;
    });

    console.log("✅ Neuer Artikel gespeichert:", newArtikel.artikelGwid);
  });
}

// Read an Artikel by ID
export async function getArtikelById(id) {
  const artikel = await database.get("artikel").find(id);
  console.log("📋 Artikel gefunden:", artikel);
  return artikel;
}

// Read all Artikel
export async function getAllArtikel() {
  const artikel = await database.get("artikel").query().fetch();
  console.log("📋 Alle Artikel:", artikel);
  return artikel;
}

// Update an Artikel by ID
export async function updateArtikel(id, artikelData) {
  await database.write(async () => {
    await artikel.update((artikel) => {
      artikel.regalId = artikelData.regalId || artikel.regalId;
      artikel.artikelGwid = artikelData.artikelGwid || artikel.artikelGwid;
      artikel.artikelFirmenId = artikelData.artikelFirmenId || artikel.artikelFirmenId;
      artikel.beschreibung = artikelData.beschreibung || artikel.beschreibung;
      artikel.kunde = artikelData.kunde || artikel.kunde;
      artikel.ablaufdatum = artikelData.ablaufdatum || artikel.ablaufdatum;
      artikel.menge = artikelData.menge || artikel.menge;
      artikel.mindestmenge = artikelData.mindestmenge || artikel.mindestmenge;
    });

    console.log("✅ Artikel aktualisiert:", artikel);
  });
}

// Delete an Artikel by ID
export async function deleteArtikel(id) {
  await database.write(async () => {
    const artikel = await database.get("artikel").find(id);
    await artikel.destroyPermanently();

    console.log("✅ Artikel gelöscht:", artikel);
  });
}
