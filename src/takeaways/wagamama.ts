import { TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const WAGAMAMA: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: {
    name: string;
    urls: string[];
    placeOrder: (order: TakeawayOrder, logger: (message: string) => void) => Promise<void>;
  }[];
} = {
  name: "Wagamama",
  category: "Sushi",
  url: "https://www.wagamama.com",
  placeOrderStages: [],
};
