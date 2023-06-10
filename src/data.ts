import { Logger } from "./script";
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

export type Takeaway = {
  name: TakeawayName;
  category: TakeawayCategory;
  url: URL;
  placeOrderStages: PlaceOrderStage[];
  saveOrder?: () => Promise<void>;
}

export type TakeawayName = typeof takeawayNames[number];
export type TakeawayCategory = typeof takeawayCategories[number];

export type PlaceOrderStage = {
  name: string;
  urls: string[];
  placeOrder: (order: TakeawayOrder, logger: Logger) => Promise<void>;
};

export type TakeawayOrder = {
  type: "delivery" | "collection";
  address: TakeawayOrderAddress;
  time: "ASAP" | Date;
  food: TakeawayOrderFood[];
  isComplete?: true;
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
  options?: TakeawayOrderFoodOption[];
};

export type TakeawayOrderFoodOption = {
  category: "size" | "topping";
  name: string;
  quantity: number;
  status?: "adding-to-cart" | "in-cart";
};

export const NAME = "Foodie Fastlane";

export const ALL_TAKEAWAYS: Takeaway[] = [
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

// Generic test order with no food
export const DEFAULT_ORDER: TakeawayOrder = {
  type: "collection",
  address: {
    street1: "",
    street2: "",
    postCode: "BH12 4NY", // Poole FiveGuys
    townCity: "",
  },
  time: "ASAP",
  food: [],
};

// A test order of 4 burgers and 3 cajun fries
export const DEFAULT_FIVE_GUYS_ORDER: TakeawayOrder = {
  ...DEFAULT_ORDER,
  food: [
    // M
    {
      name: "Bacon Cheeseburger",
      quantity: 1,
      options: [
        { category: "topping", name: "Mayo", quantity: 1 },
        { category: "topping", name: "Relish", quantity: 1 },
        { category: "topping", name: "Fresh Onions", quantity: 1 },
        { category: "topping", name: "Grilled Onions", quantity: 1 },
        { category: "topping", name: "Mustard", quantity: 1 },
        { category: "topping", name: "Green Peppers", quantity: 1 },
        { category: "topping", name: "Jalapeno Peppers", quantity: 1 },
        { category: "topping", name: "Tomato", quantity: 1 },
        { category: "topping", name: "Lettuce Wrap", quantity: 1 },
      ],
    },

    // F
    {
      name: "Bacon Cheeseburger",
      quantity: 1,
      options: [
        { category: "topping", name: "Mayo", quantity: 1 },
        { category: "topping", name: "Fresh Onions", quantity: 1 },
        { category: "topping", name: "Relish", quantity: 1 },
        { category: "topping", name: "Grilled Onions", quantity: 1 },
        { category: "topping", name: "HP Sauce", quantity: 1 },
        { category: "topping", name: "BBQ Sauce", quantity: 1 },
        { category: "topping", name: "Lettuce", quantity: 1 },
      ],
    },

    // B
    {
      name: "Bacon Cheeseburger",
      quantity: 1,
      options: [
        { category: "topping", name: "Mayo", quantity: 1 },
        { category: "topping", name: "Fresh Onions", quantity: 1 },
        { category: "topping", name: "Pickles", quantity: 1 },
        { category: "topping", name: "Grilled Onions", quantity: 1 },
        { category: "topping", name: "Ketchup", quantity: 1 },
        { category: "topping", name: "Relish", quantity: 1 },
        { category: "topping", name: "HP Sauce", quantity: 1 },
        { category: "topping", name: "Jalapeno Peppers", quantity: 1 },
        { category: "topping", name: "BBQ Sauce", quantity: 1 },
        { category: "topping", name: "Hot Sauce", quantity: 1 },
        { category: "topping", name: "Tomato", quantity: 1 },
        { category: "topping", name: "Mustard", quantity: 1 },
        { category: "topping", name: "Lettuce Wrap", quantity: 1 },
      ],
    },

    // D
    {
      name: "Bacon Cheeseburger",
      quantity: 1,
      options: [
        { category: "topping", name: "Mayo", quantity: 1 },
        { category: "topping", name: "Fresh Onions", quantity: 1 },
        { category: "topping", name: "Pickles", quantity: 1 },
        { category: "topping", name: "Grilled Onions", quantity: 1 },
        { category: "topping", name: "Ketchup", quantity: 1 },
        { category: "topping", name: "Jalapeno Peppers", quantity: 1 },
        { category: "topping", name: "HP Sauce", quantity: 1 },
        { category: "topping", name: "Hot Sauce", quantity: 1 },
        { category: "topping", name: "Relish", quantity: 1 },
        { category: "topping", name: "Mustard", quantity: 1 },
        { category: "topping", name: "Green Peppers", quantity: 1 },
      ],
    },
    {
      name: "Large Cajun Fries",
      quantity: 3,
    },
  ],
};

// A test order
export const DEFAULT_DOMINOS_ORDER: TakeawayOrder = {
  ...DEFAULT_ORDER,
  food: [
    {
      name: "American Hot",
      quantity: 1,
      options: [
        { category: "size", name: 'Large 13.5"', quantity: 1 },
        { category: "topping", name: "Classic Crust", quantity: 1 },
        { category: "topping", name: "Reduced Fat Cheese", quantity: 1 },
        { category: "topping", name: "Ham", quantity: 1 },
      ],
    },
    {
      name: "Ham & Pineapple",
      quantity: 1,
      options: [{ category: "size", name: 'Medium 11.5"', quantity: 1 }],
    },
    {
      name: "Plant-Based Margheri-tastic",
      quantity: 2,
      options: [],
    },
    {
      name: "Loaded Wedges - Cheese",
      quantity: 1,
    },
    {
      name: "Garlic Pizza Bread",
      quantity: 2,
    },
    {
      name: "Plant-Based Garlic & Herb Dip",
      quantity: 3,
    },
    {
      name: "Barbecue",
      quantity: 2,
    },
    {
      name: "Coca-Cola Classic",
      quantity: 1,
      options: [{ category: "size", name: "500ml", quantity: 1 }],
    },
  ],
};

export const takeawayCategories = ["Pizza", "Burger", "Sandwich", "Coffee", "Sushi"] as const;
export const takeawayNames = [
  "7Bone",
  "Burger King",
  "Costa",
  "Domino's Pizza",
  "Fireaway",
  "Five Guys",
  "Greggs",
  "KFC",
  "Leon",
  "McDonald's",
  "Papa John's",
  "Pizza Express",
  "Pizza Hut",
  "Pret a Manger",
  "Subway",
  "TGI Fridays",
  "Wagamama",
  "Yo! Sushi",
] as const;
