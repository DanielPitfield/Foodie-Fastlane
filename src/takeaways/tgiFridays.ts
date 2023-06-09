import { PlaceOrderStage, TakeawayCategory, TakeawayName, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const TGI_FRIDAYS: {
  name: TakeawayName;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "TGI Fridays",
  category: "Burger",
  url: "https://www.tgifridays.co.uk",
  placeOrderStages: [],
};
