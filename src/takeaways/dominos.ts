import { PlaceOrderStage, TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const DOMINOS: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Domino's Pizza",
  category: "Pizza",
  url: "https://www.dominos.co.uk",
  placeOrderStages: [],
};
