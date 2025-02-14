import { database } from "../database";
import Regal from "../models/Regal";
  
  async function createRegal(regalData) {
    return await database.write(async () => {
      return database.get("regale").create((regal) => {
        Object.assign(regal, regalData);
      });
    });
  }
  
  async function updateRegal(id, updatedData) {
    return await database.write(async () => {
      const regal = await database.get("regale").find(id);
      await regal.update((reg) => {
        Object.assign(reg, updatedData);
      });
    });
  }
  async function deleteRegal(id) {
    return await database.write(async () => {
      const regal = await database.get("regale").find(id);
      await regal.destroyPermanently();
    });
  }