import { PlaceOrderStage, TakeawayCategory, TakeawayName, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const PAPA_JOHNS: {
  name: TakeawayName;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Papa John's",
  category: "Pizza",
  url: "https://www.papajohns.co.uk",
  placeOrderStages: [],
};
