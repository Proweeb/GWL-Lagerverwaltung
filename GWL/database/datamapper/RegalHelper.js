import { database } from "../database";
import { Q } from "@nozbe/watermelondb";
import Regal from "../models/Regal";
  
  async function createRegal(regalData) {
    return database.write(async () => {
      return await database.get("regale").create((regal) => {
        regal.regalId = regalData.regalId;
        regal.fachName = regalData.fachName;
        regal.regalName = regalData.regalName;
      });
    });
  }
  async function getAllRegal() {
    return await database.get("regale").query().fetch();
  }
  async function getRegalById(regalid) {
        const regal = await database.get("regale").query(
          Q.where("regal_id", regalid) 
        ).fetch();
        return regal.length > 0 ? regal[0] : null; 
  }

  
  async function updateRegal(regalid, updatedData) {
        return await database.write(async () => {
          const regal = await database.get("regale").query(
            Q.where("regal_id", regalid) 
          ).fetch();

          await regal[0].update((reg) => {
            reg.regalId = updatedData.regalId;
            reg.fachName = updatedData.fachName;
            reg.regalName = updatedData.regalName;
          });
        });
  }
  async function deleteRegal(regalid) {
    return await database.write(async () => {
      const regal = await database.get("regale").query(
        Q.where("regal_id", regalid) 
      ).fetch();
      await regal[0].destroyPermanently();
    });
  }

  
  const RegalService = {
    createRegal,
    deleteRegal,
    updateRegal,
    getAllRegal,
    getRegalById,
  };
  
  export default RegalService;