import { TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const YO_SUSHI: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: {
    name: string;
    urls: string[];
    placeOrder: (order: TakeawayOrder, logger: (message: string) => void) => Promise<void>;
  }[];
} = {
  name: "Yo! Sushi",
  category: "Sushi",
  url: "https://www.yosushi.com",
  placeOrderStages: [],
};
