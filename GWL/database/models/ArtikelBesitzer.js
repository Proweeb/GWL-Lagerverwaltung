import { Model } from "@nozbe/watermelondb";

import { field, relation, date } from "@nozbe/watermelondb/decorators";

class ArtikelBesitzer extends Model {
  static table = "artikel_besitzer";

  static associations = {
    regale: { type: "belongs_to", key: "regal_id" },
    artikel: { type: "belongs_to", key: "gw_id" },
  };

  @field("menge") menge;

  @date("created_at") createdAt;
  @date("updated_at") updatedAt;

  @relation("regale", "regal_id") regal;
  @relation("artikel", "gw_id") artikel;
}

export default ArtikelBesitzer;
