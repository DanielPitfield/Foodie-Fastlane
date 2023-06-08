import { TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const GREGGS: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: {
    name: string;
    urls: string[];
    placeOrder: (order: TakeawayOrder, logger: (message: string) => void) => Promise<void>;
  }[];
} = {
  name: "Greggs",
  category: "Sandwich",
  url: "https://www.greggs.co.uk",
  placeOrderStages: [],
};
