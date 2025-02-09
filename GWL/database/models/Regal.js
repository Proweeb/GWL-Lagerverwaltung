import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";

class Regal extends Model {
  static table = "regale";

  // Columns in the table
  @field("regal_id") id;
  @field("name") name;

  // Define the relation to Artikel
  @relation("artikel", "regal_id") artikel;
}

export default Regal;
