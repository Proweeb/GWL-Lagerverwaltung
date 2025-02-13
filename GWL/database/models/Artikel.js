import { Model } from "@nozbe/watermelondb";
import {
  children,
  field,
  relation,
  date,
} from "@nozbe/watermelondb/decorators";

class Artikel extends Model {
  static table = "artikel";

  static associations = {
    regale: { type: "belongs_to", key: "regal_id" },
    logs: { type: "has_many", foreignKey: "gw_id" },
  };

  @field("gw_id") gwId;
  @field("firmen_id") firmenId;
  @field("beschreibung") beschreibung;
  @field("menge") menge;
  @field("mindestmenge") mindestMenge;
  @field("kunde") kunde;
  @field("ablaufdatum") ablaufdatum;
  @field("high") high;

  @date("created_at") createdAt;
  @date("updated_at") updatedAt;

  @relation("regale", "regal_id") regal;
  @children("logs") logs;

  get status() {
    if (this.menge <= this.mindestmenge) return "low";
    if (this.menge >= this.high) return "high";
    return "out";
  }
}

export default Artikel;
