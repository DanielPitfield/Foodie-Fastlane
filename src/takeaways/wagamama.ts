import { PlaceOrderStage, TakeawayCategory, TakeawayName, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const WAGAMAMA: {
  name: TakeawayName;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Wagamama",
  category: "Sushi",
  url: "https://www.wagamama.com",
  placeOrderStages: [],
};
