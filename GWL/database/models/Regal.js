import { Model } from "@nozbe/watermelondb";
import { children, field, relation } from "@nozbe/watermelondb/decorators";

class Regal extends Model {
  static table = "regale";

  // Columns in the table
  @field("regal_id") id;
  @field("fach_name") fachname;
  @field("regal_name") regalname;

  // Define the relation to Artikel
  @children("artikel") artikel;
  @children("logs") log;
}

export default Regal;
