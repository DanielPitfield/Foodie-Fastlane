import { PlaceOrderStage, TakeawayCategory, TakeawayName, TakeawayOrder } from "../data";
import { Logger } from "../script";
import {
  capitaliseFirstLetter,
  delay,
  scrollPageHeight as scrollDownThenUp,
  waitUntilElementDoesNotExist,
  waitUntilElementExists,
} from "../utils";

export const DOMINOS: {
  name: TakeawayName;
  category: TakeawayCategory;
  url: string;
  placeOrderStages: PlaceOrderStage[];
} = {
  name: "Domino's Pizza",
  category: "Pizza",
  url: "https://www.dominos.co.uk",
  placeOrderStages: [
    {
      name: "Find Store",
      urls: ["https://www.dominos.co.uk/storefinder"],
      placeOrder: async (order: TakeawayOrder, logger: Logger) => {
        // Build the URL query string parameters to the 'S'tore Finder' page
        const storeUrlParameters = new URLSearchParams([
          ["fulfilment", capitaliseFirstLetter(order.type)],
          ["searchterm", order.address.postCode],
          ["successUrl", "/menu"],
        ]);

        const storeUrl = `https://www.dominos.co.uk/storefinder/search?${storeUrlParameters}`;

        window.location.href = storeUrl;
      },
    },
    {
      name: "Select Store",
      urls: ["https://www.dominos.co.uk/storefinder/search*"],
      placeOrder: async (order: TakeawayOrder) => {
        const firstStoreCssSelector = {
          // For a 'collection' order, find the 'collect-button'
          collection: ".base-store-card[data-store-status='Online'] button[class*='collect-button']",
          // For a 'delivery' order, find the 'delivery-button'
          delivery: ".base-store-card[data-store-status='Online'] button[class*='delivery-button']",
        }[order.type];

        const firstStoreLink = await waitUntilElementExists<HTMLAnchorElement>(firstStoreCssSelector);

        if (!firstStoreLink) {
          throw new Error("Could not find the any store to collect from");
        }

        firstStoreLink.click();
      },
    },
    {
      name: "Select Food",
      urls: ["https://www.dominos.co.uk/store/*"],
      placeOrder: async (order: TakeawayOrder, logger: Logger) => {
        let pageFullyLoaded = false;

        while (true) {
          // Find the next item without a status (that hasn't been processed yet)
          const nextItem = order.food.find((food) => food.status === undefined);

          if (!nextItem) {
            window.location.href = "https://www.dominos.co.uk/basketdetails/show";
            return;
          }

          if (!pageFullyLoaded) {
            // Load all food items on the page (as many are only loaded when scrolled to)
            await loadAllFoodItems();
            pageFullyLoaded = true;
          }

          nextItem.status = "adding-to-cart";

          const { addToCartButton, selectSize } = await findFoodItemElement(nextItem.name, logger);

          // Find a size option for this food item (if any)
          const sizeFoodOption = nextItem.options?.find((x) => x.category === "size");

          if (sizeFoodOption) {
            await selectSize(sizeFoodOption.name);
          }

          // Add the food item
          addToCartButton.click();

          if (nextItem.quantity > 1) {
            for (let currentQuantity = 1; currentQuantity < nextItem.quantity; currentQuantity++) {
              // Find the food item again (as the 'Add to cart' button may have been disabled, then enabled again)
              const { addToCartButton } = await findFoodItemElement(nextItem.name, logger);

              // Increase the quantity of the food item by 1
              addToCartButton.click();
            }
          }

          nextItem.status = "in-cart";
        }
      },
    },
    {
      name: "Review Order",
      urls: ["https://www.dominos.co.uk/basketdetails/show"],
      placeOrder: async (order: TakeawayOrder) => {
        order.isComplete = true;
      },
    }
  ],
};

// Loads all food items on the current page
async function loadAllFoodItems() {
  // Wait until at least one expand button has loaded
  await waitUntilElementExists("button[data-ref-id='base-menu-card__group-button']");

  // Dismiss any modal dialogs
  document.querySelector<HTMLButtonElement>("button[data-ref-id='menu-button']")?.click();

  // Load all elements of the page by scrolling
  await scrollDownThenUp();

  // Expand all food item groups
  Array.from(document.querySelectorAll<HTMLButtonElement>("button[data-ref-id='base-menu-card__group-button']")).forEach((el) =>
    el.click()
  );

  await delay(250);

  window.scrollTo({ behavior: "smooth", top: 0 });
}

// Finds a matching food item (e.g. "American Hot", "Pepperoni Passion")
async function findFoodItemElement(
  name: string,
  logger: Logger
): Promise<{ name: string; selectSize: (size: string) => Promise<void>; addToCartButton: HTMLButtonElement }> {
  // Ensure the food items have loaded
  await waitUntilElementExists("[data-ref-id='base-menu-item-container']");
  await waitUntilElementDoesNotExist("[data-ref-id='base-menu-item-container'][class*='disabled']");

  // Find all food item elements, and the names of the products (i.e. "American Hot", "Pepperoni Passion")
  const foodItemElements = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-ref-id='base-menu-item-container']"))
    .filter((container) => !container.querySelector("button[data-ref-id='base-menu-card__group-button']"))
    .map((container) => {
      // Find the <h3> element containing the product name
      const productNameElement = container.querySelector<HTMLHeadingElement>(`[data-ref-id='base-menu-product-name']`);

      // Find the last text node child of the product <h3> element (as sometimes there is a "New" element before the name)
      const productNameTextNode = Array.from(productNameElement?.childNodes ?? [])
        .filter((node) => node.nodeType === node.TEXT_NODE)
        .at(-1);

      // Finally, trim any excess whitespace from the product name
      const productName = productNameTextNode?.textContent?.trim() ?? "";

      // Find the 'Add to Cart' button
      const addToCartButtonElement = container.querySelector<HTMLButtonElement>(`button[data-ref-id='base-menu-item-button']`);

      if (!addToCartButtonElement) {
        throw new Error(`Failed to find 'Add to cart' button for item '${productName}'`);
      }

      return {
        name: productName,
        selectSize: async (size: string) => {
          // Find the dropdown button
          const sizeDropdownElement = container.querySelector<HTMLSelectElement>(`select[data-ref-id='base-select-input']`);

          // Find the option in the select element
          const sizeOptionElements = Array.from(sizeDropdownElement?.querySelectorAll("option") ?? []).map((optionElement) => {
            const optionTextContent = optionElement.textContent?.trim() ?? "";
            const optionName = optionTextContent.substring(0, optionTextContent.indexOf(" £"));

            return {
              name: optionName,
              option: optionElement,
            };
          });

          const matchingSizeOption = sizeOptionElements.find((x) => x.name === size);

          if (!matchingSizeOption) {
            throw new Error(
              `Failed to find size food option element of '${size}' for food item '${productName}'; options were: ${sizeOptionElements
                .map((option) => `'${option.name}'`)
                .join(", ")}`
            );
          }

          matchingSizeOption.option.selected = true;
        },
        addToCartButton: addToCartButtonElement,
      };
    });

  // Find the food item element
  const foodItemElement = foodItemElements.find((element) => element.name === name);

  if (!foodItemElement) {
    throw new Error(
      `Failed to find food item element '${name}', available elements were: ${foodItemElements.map((item) => `'${item.name}'`).join(", ")}`
    );
  }

  logger(`Found matching food item element '${name}'`);

  return foodItemElement;
}
