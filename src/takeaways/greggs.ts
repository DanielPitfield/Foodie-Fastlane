import { PlaceOrderStage, TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const GREGGS: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Greggs",
  category: "Sandwich",
  url: "https://www.greggs.co.uk",
  placeOrderStages: [],
};
