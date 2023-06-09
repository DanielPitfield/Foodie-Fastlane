import { PlaceOrderStage, TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const PIZZA_HUT: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Pizza Hut",
  category: "Pizza",
  url: "https://www.pizzahut.co.uk",
  placeOrderStages: [],
};
