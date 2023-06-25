import { Takeaway } from "../AllTakeaways";
import { waitUntilElementExists } from "../../utils";
import { TakeawayOrder } from "../DefaultOrders";
import { Logger } from "../Other";

export const SEVEN_BONE: Takeaway = {
  name: "7Bone",
  category: "Burger",
  url: new URL("https://7bone.co.uk/"),
  showProgress: true,
  placeOrderStages: [
    {
      name: "Select Store",
      urls: ["https://menus.preoday.com/7Bone-Burger-Co#/main/choose-branch"],
      skipPageNavigation: true,
      placeOrder: async (order: TakeawayOrder) => {
        if (order.type !== "collection") {
          throw new Error(`Only 'collection' takeaways are supported for 7Bone`);
        }

        // Wait until at least one venue/location button has loaded
        await waitUntilElementExists(".venue-item");

        // Dismiss login/loyalty dialog
        if (document.querySelector("#appmessage-dialog")) {
          const DismissButton = await waitUntilElementExists<HTMLButtonElement>(".modal-footer button");
          DismissButton?.click();
        }

        const StoreOptions = document.querySelectorAll<HTMLDivElement>(".venue-item");

        if (!StoreOptions) {
          throw new Error("Could not find any stores");
        }

        const Store =
          // Find a store option which has the order's town city within its text content
          Array.from(StoreOptions).find((el) => el.textContent?.toLowerCase().includes(order.address.townCity.toLowerCase())) ??
          // Otherwise, just use the first store location
          StoreOptions[0];

        if (!Store) {
          throw new Error("Could not find any store to collect from");
        }

        Store.click();

        const OrderButton = document.querySelector<HTMLButtonElement>(".choose-branch-view__button");

        if (!OrderButton) {
          throw new Error("Could not find the 'Order Now' button");
        }

        OrderButton.click();
      },
    },
    {
      name: "Select Food",
      urls: ["https://menus.preoday.com/7Bone-Burger-Co#/main/venue/menu"],
      skipPageNavigation: true,
      placeOrder: async (order: TakeawayOrder, logger: Logger) => {
        // Dismiss allergy dialog
        await waitUntilElementExists("#dialog-overlay");
        const DismissButton = await waitUntilElementExists<HTMLButtonElement>("#dialog-overlay .modal-footer button");
        DismissButton?.click();
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
