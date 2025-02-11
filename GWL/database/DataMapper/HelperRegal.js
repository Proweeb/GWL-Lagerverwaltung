import { database } from "../database";
import Regal from "../models/Regal";

// Create a new Regal
export async function createRegal(regalData) {
  await database.write(async () => {
    const newRegal = await database.get("regale").create((regal) => {
      regal.id = regalData.id;
      regal.regalname = regalData.regalname;
      regal.fachname = regalData.fachname;
    });

    console.log("✅ Neuer Regal gespeichert:", newRegal);
  });
}

// Read a Regal by ID
export async function getRegalById(id) {
  const regal = await database.get("regale").find(id);
  console.log("📋 Regal gefunden:", regal);
  return regal;
}

// Read all Regale
export async function getAllRegale() {
  const regale = await database.get("regale").query().fetch();
  console.log("📋 Alle Regale:", regale);
  return regale;
}

// Update a Regal by ID
export async function updateRegal(id, regalData) {
  await database.write(async () => {
    const regal = await database.get("regale").find(id);
    await regal.update((regal) => {
      regal.regalname = regalData.regalname || regal.regalname;
    });

    console.log("✅ Regal aktualisiert:", regal);
  });
}

// Delete a Regal by ID
export async function deleteRegal(id) {
  await database.write(async () => {
    const regal = await database.get("regale").find(id);
    await regal.destroyPermanently();

    console.log("✅ Regal gelöscht:", regal);
  });
}
