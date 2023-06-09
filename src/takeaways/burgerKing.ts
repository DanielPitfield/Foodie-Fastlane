import { PlaceOrderStage, TakeawayCategory, TakeawayName, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const BURGER_KING: {
  name: TakeawayName;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Burger King",
  category: "Burger",
  url: "https://www.burgerking.co.uk",
  placeOrderStages: [],
};
