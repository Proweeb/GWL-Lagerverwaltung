import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";

class Log extends Model {
  static table = "logs";

  // Columns in the table
  @field("beschreibung") beschreibung;
  @field("datum") datum;
  @field("menge") menge;
  @field("regal_id") regal_id;
  @field("gwid") gwid;

  @relation("regale", "regal_id") regal;
  @relation("artikel", "gwid") artikel;
}

export default Log;
