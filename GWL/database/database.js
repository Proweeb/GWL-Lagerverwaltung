// database.js
import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

// Import your schema and models
import { lagerSchema } from "./schema";
import Regal from "./models/Regal";
import Artikel from "./models/Artikel";
//import Log from "./models/Log";
import ArtikelBesitzer from "./models/ArtikelBesitzer.js";

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema: lagerSchema,
  dbName: "GWL", // Specify the database name
  jsi: false, // Set to true if using JSI (for iOS)
  onSetUpError: (error) => {
    console.error("ERROR SETTING UP DATABASE:", error); // Log any setup error
  },
});

// Then, create a Watermelon database instance:
export const database = new Database({
  adapter,
  modelClasses: [
    Artikel, // Your model classes here
    Regal,
    //Log,
    ArtikelBesitzer,
  ],
});
