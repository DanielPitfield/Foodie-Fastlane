import { TakeawayName } from "./AllTakeaways";
import { Logger } from "./Other";

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
const DEFAULT_FIVE_GUYS_ORDER: TakeawayOrder = {
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
const DEFAULT_DOMINOS_ORDER: TakeawayOrder = {
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

export const ALL_DEFAULT_ORDERS: Partial<Record<TakeawayName, TakeawayOrder | null>> = {
  "7Bone": null,
  "Burger King": null,
  "Costa": null,
  "Domino's Pizza": DEFAULT_DOMINOS_ORDER,
  "Fireaway": null,
  "Five Guys": DEFAULT_FIVE_GUYS_ORDER,
  "Greggs": null,
  "KFC": null,
  "Leon": null,
  "McDonald's": null,
  "Papa John's": null,
  "Pizza Express": null,
  "Pizza Hut": null,
  "Pret a Manger": null,
  "Subway": null,
  "TGI Fridays": null,
  "Wagamama": null,
  "Yo! Sushi": null,
};
