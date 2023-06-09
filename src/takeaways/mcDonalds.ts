import { PlaceOrderStage, TakeawayCategory, TakeawayName, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const MC_DONALDS: {
  name: TakeawayName;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "McDonald's",
  category: "Burger",
  url: "https://www.mcdonalds.co.uk",
  placeOrderStages: [],
};
