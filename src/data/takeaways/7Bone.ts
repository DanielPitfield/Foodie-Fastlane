import { Takeaway } from "../AllTakeaways";
import { delay, waitUntilElementExists } from "../../utils";
import { TakeawayOrder, TakeawayOrderFood } from "../DefaultOrders";

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
      placeOrder: async (order: TakeawayOrder) => {
        // Find the next item without a status (that hasn't been processed yet)
        const nextItem = order.food.find((food) => food.status === undefined);

        if (!nextItem) {
          order.isComplete = true;
          return;
        }

        nextItem.status = "adding-to-cart";

        // e.g. 'Dry aged beef burgers'
        const foodCategoryCard = await waitUntilElementExists<HTMLImageElement>(
          `a[data-test='preorder.store.menu.category.bundles-link'] > img[alt='${nextItem.categoryName?.toLowerCase()}']`
        );

        if (!foodCategoryCard) {
          throw new Error(`Could not find the food category ${nextItem.categoryName} for ${nextItem.name}`);
        }

        foodCategoryCard.click();

        // e.g. 'Triple B'
        const foodItemCard = await waitUntilElementExists<HTMLImageElement>(
          `div[data-test='card'] > div > img[alt='${nextItem.name?.toLowerCase()}']`
        );

        if (!foodItemCard) {
          throw new Error(`Could not find the food item ${nextItem.name}`);
        }

        foodItemCard.click();

        const sideDish = nextItem.options?.find((option) => option.category === "side dish");

        // No side dish, only the burger
        if (!sideDish) {
          const getItemOnlyButton = await waitUntilElementExists<HTMLSpanElement>(
            "div[data-test='modal-content-wrapper'] > ul > li > button"
          );

          if (!getItemOnlyButton) {
            throw new Error("Could not find the 'Get Item Only' button");
          }

          getItemOnlyButton.click();

          await selectDonenessOption(nextItem);

          const addToOrderButton = await waitUntilElementExists<HTMLButtonElement>("button[data-test='footer-btn']");

          if (!addToOrderButton) {
            throw new Error("Could not find the 'Add to Order' button");
          }

          addToOrderButton.click();

          return;
        }

        // Red basket deal
        const makeMealButton = await waitUntilElementExists<HTMLSpanElement>(
          "div[data-test='modal-content-wrapper'] > ul > li:nth-child(2) > button"
        );

        if (!makeMealButton) {
          throw new Error("Could not find the 'Make it a meal' button");
        }

        makeMealButton.click();

        // Fries
        if (sideDish.name.toLowerCase().includes("fries") || sideDish.name.toLowerCase().includes("poutine")) {
          const addFriesButton = await waitUntilElementExists<HTMLDivElement>("section > div:nth-child(2) > div[data-test='list-card']");

          if (!addFriesButton) {
            throw new Error("Could not find the 'Choose your fries' button");
          }

          addFriesButton.click();

          // e.g. 'Chilli Cheese Fries'
          const sideDishItemCard = await waitUntilElementExists<HTMLImageElement>(
            `div[data-test='card'] > div > img[alt='${sideDish.name.toLowerCase()}']`
          );

          if (!sideDishItemCard) {
            throw new Error(`Could not find the side dish ${sideDish.name}`);
          }

          sideDishItemCard.click();

          const updateMealButton = await waitUntilElementExists<HTMLButtonElement>("button[data-test='footer-btn']");

          if (!updateMealButton) {
            throw new Error("Could not find the 'Update Meal' button");
          }

          // Gets stuck here without a delay!
          await delay(1500);

          updateMealButton.click();
        }

        // Must go back and select doneness of burger
        const customiseBurgerButton = await waitUntilElementExists<HTMLDivElement>("section > div > div[data-test='list-card']");

        if (!customiseBurgerButton) {
          throw new Error("Could not find the 'Customise your burger' button");
        }

        customiseBurgerButton.click();

        await selectDonenessOption(nextItem);

        // Update burger
        const updateMealButton = await waitUntilElementExists<HTMLButtonElement>("button[data-test='footer-btn']");

        if (!updateMealButton) {
          throw new Error("Could not find the 'Update Meal' button");
        }

        // Gets stuck here without a delay!
        await delay(1500);

        updateMealButton.click();

        // Now can add to basket
        const addToOrderButton = await waitUntilElementExists<HTMLButtonElement>("button[data-test='footer-complete-button']");

        if (!addToOrderButton) {
          throw new Error("Could not find the 'Add to Order' button");
        }

        addToOrderButton.click();

        // Go back to main overview page by clicking on 7Bone logo, ready for next item
        const homeImage = await waitUntilElementExists<HTMLImageElement>("img[data-test='logo']");

        if (!homeImage) {
          throw new Error("Could not find the home image");
        }

        homeImage.click();
      },
    },
    {
      name: "Review Order",
      // TODO: How can the extension determine that the URL has changed from the previous stage? The URL is very similar when checking out!
      urls: ["https://7bone.vmos.io/store/*"],
      skipPageNavigation: true,
      placeOrder: async (order: TakeawayOrder) => {
        const cartButton = await waitUntilElementExists<HTMLSpanElement>("span[data-test='price']");

        if (!cartButton) {
          throw new Error("Could not find the cart/checkbout button");
        }

        cartButton.click();

        // By default, there is a 7.5% tip, opt out!
        const tipCheckbox = await waitUntilElementExists<HTMLInputElement>("input#checkbox-undefined");

        if (!tipCheckbox) {
          throw new Error("Could not find the 'Add a tip?' checkbox");
        }

        if (tipCheckbox.checked) {
          // Event trigger is used for validation, programatically setting checked property to false won't properly remove tip!
          tipCheckbox.click();
        }

        order.isComplete = true;
      },
    },
  ],
};

async function selectDonenessOption(nextItem: TakeawayOrderFood): Promise<void> {
  // No doneness options with chicken (buttermilk fried) burgers, this becomes the chicken/vegan/halloumi options
  if (nextItem.categoryName?.toLowerCase().includes("buttermilk")) {
    // Chicken option selected by default, early return
    return;
  }

  const doneness = nextItem.options?.find((option) => option.category === "doneness")?.name.toLowerCase();

  // 'Well done' (second option), otherwise pink (first option)
  const optionNumber = doneness?.includes("well done") ? 2 : 1;

  const donenessOption = await waitUntilElementExists<HTMLDivElement>(`ul > li > div > div > div:nth-child(${optionNumber})`);

  if (!donenessOption) {
    throw new Error(`Could not find an option for doneness ${doneness}`);
  }

  donenessOption.click();
}
