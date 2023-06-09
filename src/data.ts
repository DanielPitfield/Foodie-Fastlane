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

export type PlaceOrderStage = {
  name: string;
  urls: string[];
  placeOrder: (order: TakeawayOrder, logger: (message: string) => void) => Promise<void>;
}

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
  status?: "adding-to-cart" | "in-cart";
  options?: TakeawayOrderFood[];
}

export const NAME = "Foodie Fastlane";

export const ALL_TAKEAWAYS: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
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

// A test order of 4 burgers and 3 cajun fries
export const DEFAULT_FIVE_GUYS_ORDER: TakeawayOrder = {
  type: "collection",
  address: {
    street1: "Beach",
    street2: "",
    postCode: "BH5 1BN",
    townCity: "Boscombe",
  },
  time: "ASAP",
  food: [
    {
      name: "Bacon Cheeseburger",
      quantity: 1,
      options: [
        { name: "Fresh Onions", quantity: 1 },
        { name: "Pickles", quantity: 1 },
        { name: "Tomato", quantity: 1 },
        { name: "Grilled Onions", quantity: 1 },
        { name: "Ketchup", quantity: 1 },
        { name: "Hot Sauce", quantity: 1 },
      ],
    },
    {
      name: "Bacon Cheeseburger",
      quantity: 1,
      options: [
        { name: "Mayo", quantity: 1 },
        { name: "Fresh Onions", quantity: 1 },
        { name: "Lettuce", quantity: 1 },
        { name: "Grilled Onions", quantity: 1 },
        { name: "BBQ Sauce", quantity: 1 },
        { name: "Lettuce Wrap", quantity: 1 },
      ],
    },
    {
      name: "Cheeseburger",
      quantity: 1,
      options: [
        { name: "Fresh Onions", quantity: 1 },
        { name: "Grilled Onions", quantity: 1 },
        { name: "Ketchup", quantity: 1 },
        { name: "BBQ Sauce", quantity: 1 },
      ],
    },
    {
      name: "Bacon Cheeseburger",
      quantity: 1,
      options: [
        { name: "Fresh Onions", quantity: 1 },
        { name: "Grilled Mushrooms", quantity: 1 },
        { name: "Ketchup", quantity: 1 },
        { name: "Green Peppers", quantity: 1 },
        { name: "BBQ Sauce", quantity: 1 },
      ],
    },
    {
      name: "Large Cajun Fries",
      quantity: 3,
    },
  ],
};

export const takeawayCategories = ["Pizza", "Burger", "Sandwich", "Coffee", "Sushi"] as const;
export const TAKEAWAY_URLS = ALL_TAKEAWAYS.map((takeaway) => takeaway.url);
