import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const lagerSchema = appSchema({
  version: 2, // Incremented version due to schema changes
  tables: [
    tableSchema({
      name: "regale",
      columns: [
        { name: "regal_id", type: "string", isIndexed: true },
        { name: "fach_name", type: "string", isIndexed: true },
        { name: "regal_name", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "artikel",
      columns: [
        { name: "gw_id", type: "string", isIndexed: true }, // Correct gw_id for artikel
        { name: "firmen_id", type: "string" },
        { name: "beschreibung", type: "string" },
        { name: "menge", type: "number" },
        { name: "mindestmenge", type: "number" },
        { name: "kunde", type: "string" },
        { name: "regal_id", type: "string", isIndexed: true }, // Foreign key to regale
        { name: "ablaufdatum", type: "number" },
        { name: "high", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "logs",
      columns: [
        { name: "beschreibung", type: "string", isIndexed: true },
        { name: "datum", type: "string" },
        { name: "regal_id", type: "string", isIndexed: true }, // Foreign key to regale
        { name: "gw_id", type: "string", isIndexed: true }, // Foreign key to artikel
        { name: "menge", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
