import { PlaceOrderStage, TakeawayCategory, TakeawayName, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const PIZZA_EXPRESS: {
  name: TakeawayName;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Pizza Express",
  category: "Pizza",
  url: "https://www.pizzaexpress.com",
  placeOrderStages: [],
};
