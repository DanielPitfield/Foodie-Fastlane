import { TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const TGI_FRIDAYS: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: {
    name: string;
    urls: string[];
    placeOrder: (order: TakeawayOrder, logger: (message: string) => void) => Promise<void>;
  }[];
} = {
  name: "TGI Fridays",
  category: "Burger",
  url: "https://www.tgifridays.co.uk",
  placeOrderStages: [],
};
