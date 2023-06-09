import { PlaceOrderStage, TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const SEVEN_BONE: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "7Bone",
  category: "Burger",
  url: "https://7bone.co.uk/",
  placeOrderStages: [],
};
