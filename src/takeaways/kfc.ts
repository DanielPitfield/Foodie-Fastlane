import { PlaceOrderStage, TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const KFC: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "KFC",
  category: "Burger",
  url: "https://www.kfc.co.uk",
  placeOrderStages: [],
};
