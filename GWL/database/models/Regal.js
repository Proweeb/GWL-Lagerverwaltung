import { Model } from "@nozbe/watermelondb";

import { children, field, date } from "@nozbe/watermelondb/decorators";

class Regal extends Model {
  static table = "regale";

  static associations = {
    artikel_besitzer: { type: "has_many", foreignKey: "regal_id" },
    logs: { type: "has_many", foreignKey: "regal_id" },
  };
  @field("regal_id") regalId;
  @field("fach_name") fachName;
  @field("regal_name") regalName;

  @date("created_at") createdAt;
  @date("updated_at") updatedAt;

  @children("artikel_besitzer") artikelBesitzer;
  @children("logs") logs;
}

export default Regal;
