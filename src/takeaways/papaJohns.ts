import { PlaceOrderStage, TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const PAPA_JOHNS: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Papa John's",
  category: "Pizza",
  url: "https://www.papajohns.co.uk",
  placeOrderStages: [],
};
