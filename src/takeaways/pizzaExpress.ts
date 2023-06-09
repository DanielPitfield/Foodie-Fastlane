import { PlaceOrderStage, TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const PIZZA_EXPRESS: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "PizzaExpress",
  category: "Pizza",
  url: "https://www.pizzaexpress.com",
  placeOrderStages: [],
};
