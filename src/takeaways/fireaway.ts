import { PlaceOrderStage, TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const FIREAWAY: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Fireaway",
  category: "Pizza",
  url: "https://fireaway.co.uk/",
  placeOrderStages: [],
};
