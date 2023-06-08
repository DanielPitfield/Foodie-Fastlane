import { TakeawayCategory, TakeawayOrder } from "../data";
import { waitUntilElementExists } from "../utils";

export const LEON: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: {
    name: string;
    urls: string[];
    placeOrder: (order: TakeawayOrder, logger: (message: string) => void) => Promise<void>;
  }[];
} = {
  name: "Leon",
  category: "Burger",
  url: "https://www.leon.co",
  placeOrderStages: [],
};
