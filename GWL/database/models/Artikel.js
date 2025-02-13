import { Model } from "@nozbe/watermelondb";
import {
  field,
  relation,
  date,
  children,
} from "@nozbe/watermelondb/decorators";

class Artikel extends Model {
  static table = "artikel";

  // Static associations
  static associations = {
    regale: { type: "belongs_to", key: "regal_id" }, // correct the key
    logs: { type: "has_many", foreignKey: "gw_id" },
  };

  @field("firmen_id") firmenId;
  @field("beschreibung") beschreibung;
  @field("menge") menge;
  @field("mindestmenge") mindestMenge;
  @field("kunde") kunde;
  @field("ablaufdatum") ablaufdatum;

  // Timestamps
  @date("created_at") createdAt;
  @date("updated_at") updatedAt;

  // Relations
  @relation("regale", "regal_id") regal; // foreign key relation with Regal model
  @children("logs") logs;
}

export default Artikel;
