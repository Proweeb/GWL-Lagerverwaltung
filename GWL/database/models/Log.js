import { Model } from "@nozbe/watermelondb";

import { field, relation, date } from "@nozbe/watermelondb/decorators";

class Log extends Model {
  static table = "logs";

  static associations = {
    regale: { type: "belongs_to", key: "regal_id" },
    artikel: { type: "belongs_to", key: "gw_id" },
  };

  @field("beschreibung") beschreibung;
  @field("datum") datum;
  @field("menge") menge;

  @date("created_at") createdAt;
  @date("updated_at") updatedAt;

  @relation("regale", "regal_id") regal;
  @relation("artikel", "gw_id") artikel;
}

export default Log;
