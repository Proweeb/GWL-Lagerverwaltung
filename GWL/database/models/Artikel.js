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

  @date("ablaufdatum") ablaufdatum;
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

  get isExpired() {
    if (!this.ablaufdatum) return "Valid";
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to start of the day
    const expiryDate = new Date(this.ablaufdatum);
    const timeDiff = expiryDate.getTime() - today.getTime(); // Difference in milliseconds
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
    if (daysRemaining <= 0) return "Abgelaufen"; // Past expiration date
    if (daysRemaining <= 7) return "Kritisch"; // Less than or equal to 7 days
    if (daysRemaining <= 14) return "Warnung"; // Less than or equal to 14 days

    return "Valid"; // More than 14 days remaining
  }
}

export default Artikel;
