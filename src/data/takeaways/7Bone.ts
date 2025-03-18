import { Takeaway } from "../AllTakeaways";
import { waitUntilElementExists } from "../../utils";
import { TakeawayOrder } from "../DefaultOrders";
import { Logger } from "../Other";

export const SEVEN_BONE: Takeaway = {
  name: "7Bone",
  category: "Burger",
  url: new URL("https://7bone.co.uk/"),
  placeOrderStages: [
    {
      name: "Select Store",
      urls: ["https://7bone.vmos.io/store/store-selection?app=online"],
      skipPageNavigation: true,
      placeOrder: async (order: TakeawayOrder) => {
        if (order.type !== "collection") {
          throw new Error(`Only 'collection' takeaways are supported for 7Bone`);
        }

        const searchInput = await waitUntilElementExists<HTMLInputElement>("input#searchText");

        if (!searchInput) {
          throw new Error("Could not find the 'Enter your address' input");
        }

        // The form handling relies on events and validation beyond just DOM manipulation, therefore need to dispatch events in this sequence
        searchInput.dispatchEvent(new Event("focus", { bubbles: true }));

        // Only setting the value would skip event triggers
        searchInput.value = order.address.postCode;

        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        searchInput.dispatchEvent(new Event("change", { bubbles: true }));
        searchInput.dispatchEvent(new Event("keyup", { bubbles: true }));

        const storeOrderButton = await waitUntilElementExists<HTMLAnchorElement>("a[data-test='preorder.store.menu.overview-link']");

        if (!storeOrderButton) {
          throw new Error(`Could not find the store order button for ${order.address.postCode}`);
        }

        storeOrderButton.click();
      },
    },
    {
      name: "Select Food",
      urls: ["https://7bone.vmos.io/store/*"],
      skipPageNavigation: true,
      placeOrder: async (order: TakeawayOrder, logger: Logger) => {
        //
      },
    },
    {
      name: "Review Order",
      urls: ["https://www.dominos.co.uk/basketdetails/show"],
      skipPageNavigation: true,
      placeOrder: async (order: TakeawayOrder) => {
        order.isComplete = true;
      },
    },
  ],
};
