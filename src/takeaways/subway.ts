import { PlaceOrderStage, TakeawayCategory, TakeawayName, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const SUBWAY: {
  name: TakeawayName;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Subway",
  category: "Sandwich",
  url: "https://www.subway.com/en-GB",
  placeOrderStages: [],
};
