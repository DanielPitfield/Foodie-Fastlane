import { Takeaway } from "../AllTakeaways";
import { TakeawayOrder } from "../DefaultOrders";
import { waitUntilElementExists } from "../../utils";

export const PIZZA_HUT: Takeaway = {
  name: "Pizza Hut",
  category: "Pizza",
  url: new URL("https://www.pizzahut.co.uk"),
  placeOrderStages: [
    {
      name: "Find Store",
      urls: ["https://www.pizzahut.co.uk/"],
      placeOrder: async (order: TakeawayOrder) => {
        const PostcodeInput = await waitUntilElementExists<HTMLInputElement>("input[name='postcode']");

        if (!PostcodeInput) {
          throw new Error("Could not find the postcode input");
        }

        PostcodeInput.value = order.address.postCode;

        const searchButton = await waitUntilElementExists<HTMLButtonElement>("button[data-synth='button--delivery']");

        if (!searchButton) {
          throw new Error("Could not find the 'Order Now' button to search by postcode");
        }

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
