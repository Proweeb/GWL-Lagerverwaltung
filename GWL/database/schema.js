import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const lagerSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "regale",
      columns: [
        { name: "regal_id", type: "string", isIndexed: true },
        { name: "name", type: "string",isIndexed: true},
      ],
    }),
    tableSchema({
      name: "artikel",
      columns: [
        { name: "fach", type: "string" },
        { name: "gwid", type: "number", isIndexed: true },
        { name: "firmenId", type: "string" },
        { name: "beschreibung", type: "string" },
        { name: "menge", type: "number" },
        { name: "mindestmenge", type: "number" },
        { name: "kunde", type: "string" },
        { name: "regal_id", type: "string" },
        { name: "ablaufdatum", type: "number" },
      ],
    }),
    tableSchema({
      name: "logs",
      columns: [
        { name: "beschreibung", type: "string", isIndexed: true  },
        { name: "datum", type: "string", isIndexed: true },
        { name: "regal_id", type: "string" },
        { name: "gwid", type: "string" },
        {name: "menge", type:"number"},
      ],
    }),
  ],
});
