import { Takeaway } from "../AllTakeaways";
import { TakeawayOrder } from "../DefaultOrders";
import { waitUntilElementExists } from "../../utils";
import { Logger } from "../Other";

export const PIZZA_HUT: Takeaway = {
  name: "Pizza Hut",
  category: "Pizza",
  url: new URL("https://www.pizzahut.co.uk"),
  showProgress: true,
  placeOrderStages: [
    {
      name: "Find Store",
      urls: ["https://www.pizzahut.co.uk/"],
      placeOrder: async (order: TakeawayOrder) => {
        const search = await waitUntilElementExists<HTMLInputElement>("input[name='postcode']");
        search.value = order.address.postCode;

        const searchButton = await waitUntilElementExists<HTMLButtonElement>("button[data-synth='button--delivery']");
        searchButton.click();
      },
    },
    {
      name: "Enable Deals",
      urls: ["https://www.pizzahut.co.uk/order/deals/"],
      placeOrder: async () => {
        const autoDealsButton = await waitUntilElementExists<HTMLButtonElement>("button[data-synth='button--accept']");
        autoDealsButton.click();
      },
    },
    {
      name: "Select Food",
      urls: ["https://www.pizzahut.co.uk/order/pizzas/"],
      placeOrder: async (order: TakeawayOrder) => {
        if (order.type === "collection") {
          const collectionButton = await waitUntilElementExists<HTMLButtonElement>("button[data-synth='switch-collection-btn']");
          collectionButton.click();
        }

        // TODO
      },
    },
  ],
};
