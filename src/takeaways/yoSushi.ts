import { PlaceOrderStage, TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const YO_SUSHI: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Yo! Sushi",
  category: "Sushi",
  url: "https://www.yosushi.com",
  placeOrderStages: [],
};
