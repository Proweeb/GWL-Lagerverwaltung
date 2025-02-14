import { database } from "../database";
import Artikel from "../models/Artikel";

async function createArtikel(artikelData) {
    return await database.write(async () => {
      return database.get("artikel").create((artikel) => {
        Object.assign(artikel, artikelData);
      });
    });
  }
  
  async function getAllArtikel() {
    return await database.get("artikel").query().fetch();
  }
  
  async function getArtikelById(id) {
    return await database.get("artikel").find(id);
  }

  async function updateArtikel(id, updatedData) {
    return await database.write(async () => {
      const artikel = await database.get("artikel").find(id);
      await artikel.update((art) => {
        Object.assign(art, updatedData);
      });
    });
  }
  

  async function deleteArtikel(id) {
    return await database.write(async () => {
      const artikel = await database.get("artikel").find(id);
      await artikel.destroyPermanently();
    });
  }
  
