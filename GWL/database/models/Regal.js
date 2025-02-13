import { Model } from "@nozbe/watermelondb";
import { field, children, date } from "@nozbe/watermelondb/decorators";

class Regal extends Model {
  static table = "regale";

  // Static associations
  static associations = {
    artikel: { type: "has_many", foreignKey: "regal_id" }, // foreign key for has_many
    logs: { type: "has_many", foreignKey: "regal_id" }, // foreign key for has_many
  };

  @field("fach_name") fachName;
  @field("regal_name") regalName;

  // Timestamps
  @date("created_at") createdAt;
  @date("updated_at") updatedAt;

  // Relations
  @children("artikel") artikel;
  @children("logs") logs;
}

export default Regal;
