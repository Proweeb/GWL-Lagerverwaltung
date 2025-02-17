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

  @date("created_at") createdAt;
  @date("updated_at") updatedAt;

  @relation("regale", "regal_id") regal;
  @children("logs") logs;

  get status() {
    const menge = parseFloat(this.menge); // Ensure menge is treated as a number
    const mindestMenge = parseFloat(this.mindestMenge); // Ensure mindestMenge is treated as a number

    if (isNaN(menge) || isNaN(mindestMenge)) {
      return "unknown"; // Fallback for invalid values
    }

    if (menge === 0) return "out"; // Explicit check for zero
    if (menge <= mindestMenge) return "low"; // Check if menge is less than or equal to mindestMenge
    return "ok"; // Default case
  }
}

export default Artikel;
