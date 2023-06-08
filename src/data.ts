import { waitUntilElementExists } from "./utils";

export type TakeawayCategory = typeof takeawayCategories[number];
export type TakeawayURL = typeof TAKEAWAY_URLS[number];

export type TakeawayOrder =
  | {
      type: "delivery";
      address: TakeawayOrderAddress;
      time: "ASAP" | Date;
    }
  | {
      type: "collection";
      time: "ASAP" | Date;
    };

export type TakeawayOrderAddress = {
  street1: string;
  street2: string;
  postCode: string;
  townCity: string;
};

export const NAME = "Foodie Fastlane";

export const ALL_TAKEAWAYS: {
  name: string;
  category: TakeawayCategory;
  url: string;
  placeOrder: (order: TakeawayOrder) => Promise<void>;
}[] = [
  {
    name: "McDonald's",
    category: "Burger",
    url: "https://www.mcdonalds.co.uk",
    placeOrder: async () => {},
  },
  { name: "KFC", category: "Burger", url: "https://www.kfc.co.uk", placeOrder: async () => {} },
  {
    name: "Burger King",
    category: "Burger",
    url: "https://www.burgerking.co.uk",
    placeOrder: async () => {},
  },
  {
    name: "Five Guys",
    category: "Burger",
    url: "https://order.fiveguys.co.uk",
    placeOrder: async (order: TakeawayOrder) => {
      const storeId = 171; // TODO: Determine store from order.address
      const MENU_URL = "https://order.fiveguys.co.uk/menu";

      // If already at the menu page
      if (window.location.href === MENU_URL) {
        return;
      }

      // Otherwise, go to the 'time slot selection' page
      window.location.href = `https://order.fiveguys.co.uk/TimeSlotSelection?storeId=${storeId}&orderType=ClickAndCollect`;

      // If the order is not wanted as-soon-as-possible
      if (order.time !== "ASAP") {
        // Round the time to the nearest 5-minute slot
        order.time.setMinutes(Math.ceil(order.time.getMinutes() / 5) * 5);

        const timeString = `${order.time.getHours().toString().padStart(2, "0")}${order.time
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        const timeSlotOption = await waitUntilElementExists<HTMLOptionElement>(
          `select#daywiseslot option[value$='${timeString}']`
        );

        if (!timeSlotOption) {
          throw new Error(`No time slot found for ${order.time}`);
        }

        // Select the 'time slot' option
        timeSlotOption.selected = true;
      }

      const placeOrderButton = await waitUntilElementExists<HTMLButtonElement>(".use_location_btn .btn");

      if (!placeOrderButton) {
        throw new Error("Could not find the 'Place Order' button");
      }

      placeOrderButton.click();
    },
  },
  {
    name: "TGI Fridays",
    category: "Burger",
    url: "https://www.tgifridays.co.uk",
    placeOrder: async () => {},
  },
  { name: "Leon", category: "Burger", url: "https://www.leon.co", placeOrder: async () => {} },
  { name: "7Bone", category: "Burger", url: "https://7bone.co.uk/", placeOrder: async () => {} },
  { name: "Subway", category: "Sandwich", url: "https://www.subway.com/en-GB", placeOrder: async () => {} },
  { name: "Greggs", category: "Sandwich", url: "https://www.greggs.co.uk", placeOrder: async () => {} },
  {
    name: "Costa Coffee",
    category: "Sandwich",
    url: "https://www.costa.co.uk",
    placeOrder: async () => {},
  },
  {
    name: "Pret a Manger",
    category: "Sandwich",
    url: "https://www.pret.co.uk",
    placeOrder: async () => {},
  },
  { name: "Wagamama", category: "Sushi", url: "https://www.wagamama.com", placeOrder: async () => {} },
  { name: "Yo! Sushi", category: "Sushi", url: "https://www.yosushi.com", placeOrder: async () => {} },
  {
    name: "Domino's Pizza",
    category: "Pizza",
    url: "https://www.dominos.co.uk",
    placeOrder: async () => {},
  },
  { name: "Pizza Hut", category: "Pizza", url: "https://www.pizzahut.co.uk", placeOrder: async () => {} },
  {
    name: "Papa John's",
    category: "Pizza",
    url: "https://www.papajohns.co.uk",
    placeOrder: async () => {},
  },
  {
    name: "PizzaExpress",
    category: "Pizza",
    url: "https://www.pizzaexpress.com",
    placeOrder: async () => {},
  },
  { name: "Fireaway", category: "Pizza", url: "https://fireaway.co.uk/", placeOrder: async () => {} },
];

// Every takeaway option is enabled by default
export const DEFAULT_TAKEAWAYS = ALL_TAKEAWAYS.map(({ name }) => {
  return { name, isEnabled: true };
});

export const takeawayCategories = ["Pizza", "Burger", "Sandwich", "Coffee", "Sushi"] as const;
export const TAKEAWAY_URLS = ALL_TAKEAWAYS.map((takeaway) => takeaway.url);
