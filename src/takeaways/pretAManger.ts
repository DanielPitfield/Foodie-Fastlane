import { PlaceOrderStage, TakeawayCategory, TakeawayName, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const PRET_A_MANGER: {
  name: TakeawayName;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Pret a Manger",
  category: "Sandwich",
  url: "https://www.pret.co.uk",
  placeOrderStages: [],
};
