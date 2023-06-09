import { PlaceOrderStage, TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const COSTA: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Costa",
  category: "Sandwich",
  url: "https://www.costa.co.uk",
  placeOrderStages: [],
};
