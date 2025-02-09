import { database } from "./database";
import Artikel from "./models/Artikel";

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

    console.log("✅ Neuer Artikel gespeichert:", newArtikel);
  });

  // Jetzt alle Artikel abrufen & loggen
  const allArticles = await database
    .get("artikel")
    .query(Artikel.where("artikelGwid", artikelData.artikelGwid))
    .fetch();
  console.log("📋 Alle Artikel in der Datenbank:", allArticles);
}
