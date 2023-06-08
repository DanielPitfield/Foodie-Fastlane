import { SEVEN_BONE } from "./takeaways/7Bone";
import { BURGER_KING } from "./takeaways/burgerKing";
import { COSTA } from "./takeaways/costa";
import { DOMINOS } from "./takeaways/dominos";
import { FIREAWAY } from "./takeaways/fireaway";
import { FIVE_GUYS } from "./takeaways/fiveGuys";
import { GREGGS } from "./takeaways/greggs";
import { KFC } from "./takeaways/kfc";
import { LEON } from "./takeaways/leon";
import { MC_DONALDS } from "./takeaways/mcDonalds";
import { PAPA_JOHNS } from "./takeaways/papaJohns";
import { PIZZA_EXPRESS } from "./takeaways/pizzaExpress";
import { PIZZA_HUT } from "./takeaways/pizzaHut";
import { PRET_A_MANGER } from "./takeaways/pretAManger";
import { SUBWAY } from "./takeaways/subway";
import { TGI_FRIDAYS } from "./takeaways/tgiFridays";
import { WAGAMAMA } from "./takeaways/wagamama";
import { YO_SUSHI } from "./takeaways/yoSushi";

export type TakeawayCategory = typeof takeawayCategories[number];
export type TakeawayURL = typeof TAKEAWAY_URLS[number];

export type TakeawayOrder = {
  type: "delivery" | "collection";
  address: TakeawayOrderAddress;
  time: "ASAP" | Date;
  food: TakeawayOrderFood[];
};

export type TakeawayOrderAddress = {
  street1: string;
  street2: string;
  postCode: string;
  townCity: string;
};

export type TakeawayOrderFood = {
  name: string;
  quantity: number;
  status?: "adding-to-cart" | "added-to-cart";
  options?: TakeawayOrderFood[];
}

export const NAME = "Foodie Fastlane";

export const ALL_TAKEAWAYS: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: {
    name: string;
    urls: string[];
    placeOrder: (order: TakeawayOrder, logger: (message: string) => void) => Promise<void>;
  }[];
}[] = [
  MC_DONALDS,
  KFC,
  BURGER_KING,
  FIVE_GUYS,
  TGI_FRIDAYS,
  LEON,
  SEVEN_BONE,
  SUBWAY,
  GREGGS,
  COSTA,
  PRET_A_MANGER,
  WAGAMAMA,
  YO_SUSHI,
  DOMINOS,
  PIZZA_HUT,
  PAPA_JOHNS,
  PIZZA_EXPRESS,
  FIREAWAY,
];

// Every takeaway option is enabled by default
export const DEFAULT_TAKEAWAYS = ALL_TAKEAWAYS.map(({ name }) => {
  return { name, isEnabled: true };
});

export const takeawayCategories = ["Pizza", "Burger", "Sandwich", "Coffee", "Sushi"] as const;
export const TAKEAWAY_URLS = ALL_TAKEAWAYS.map((takeaway) => takeaway.url);
