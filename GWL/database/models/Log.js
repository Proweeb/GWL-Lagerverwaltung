import { Model } from "@nozbe/watermelondb";
import { field, relation, date } from "@nozbe/watermelondb/decorators";

class Log extends Model {
  static table = "logs";

  // Static associations
  static associations = {
    regale: { type: "belongs_to", key: "regal_id" },
    artikel: { type: "belongs_to", key: "gw_id" }, // foreign key to Artikel
  };

  @field("beschreibung") beschreibung;
  @field("datum") datum;
  @field("menge") menge;

  // Timestamps
  @date("created_at") createdAt;
  @date("updated_at") updatedAt;

  // Relations
  @relation("regale", "regal_id") regal;
  @relation("artikel", "gw_id") artikel; // foreign key relation with Artikel model
}

export default Log;
