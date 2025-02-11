import { Model } from "@nozbe/watermelondb";
import { children, field, relation } from "@nozbe/watermelondb/decorators";

class Artikel extends Model {
  static table = "artikel";

  // Columns in the table
  @field("gwid") gwid;
  @field("firmenId") firmenId;
  @field("beschreibung") beschreibung;
  @field("menge") menge;
  @field("mindestmenge") mindestmenge;
  @field("kunde") kunde;
  @field("regal_id") regal_id;
  @field("ablaufdatum") ablaufdatum; // Store as timestamp (milliseconds)

  // Define the relation to Regal
  @relation("regale", "regal_id") regal;
  @children("logs") log;
}

export default Artikel;
