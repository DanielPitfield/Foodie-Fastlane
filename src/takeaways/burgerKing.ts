import { PlaceOrderStage, TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const BURGER_KING: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Burger King",
  category: "Burger",
  url: "https://www.burgerking.co.uk",
  placeOrderStages: [],
};
