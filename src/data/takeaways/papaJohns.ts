import { Takeaway } from "../AllTakeaways";
import { delay, scrollPageHeight, waitUntilElementExists } from "../../utils";
import { TakeawayOrder } from "../DefaultOrders";
import { Logger } from "../Other";

export const PAPA_JOHNS: Takeaway = {
  name: "Papa John's",
  category: "Pizza",
  url: new URL("https://www.papajohns.co.uk"),
  placeOrderStages: [
    {
      name: "Find Store",
      urls: ["https://www.papajohns.co.uk/"],
      placeOrder: async (order: TakeawayOrder) => {
        const postcodeInput = await waitUntilElementExists<HTMLInputElement>("input.homePostCode");

        if (!postcodeInput) {
          throw new Error("Could not find the postcode input");
        }

        postcodeInput.value = order.address.postCode;

        const deliveryButton = await waitUntilElementExists<HTMLButtonElement>("#delivButton");

        if (!deliveryButton) {
          throw new Error("Could not find the 'Order Now' button to search by postcode");
        }

        deliveryButton.click();
      },
    },
    {
      name: "Skip Deals",
      urls: ["https://www.papajohns.co.uk/order/deals*"],
      placeOrder: async (order: TakeawayOrder, logger: Logger) => {
        window.location.href = "https://www.papajohns.co.uk/order/menu";
      },
    },
    {
      name: "Select Food",
      urls: ["https://www.papajohns.co.uk/order/menu*"],
      placeOrder: async (order: TakeawayOrder, logger: Logger) => {
        // Load all food items on the page (because many items are only loaded when scrolled to)
        if (order.food.some((food) => food.status === undefined)) {
          await loadAllFoodItems();
        }

        while (true) {
          // Find the next item without a status (that hasn't been processed yet)
          const nextItem = order.food.find((food) => food.status === undefined);

          if (!nextItem) {
            order.isComplete = true;
            return;
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
  ],
};

// Loads all food items on the current page
async function loadAllFoodItems() {
  // Wait until at least one expand button has loaded
  await waitUntilElementExists(".productEntry");

  // Load all elements of the page by scrolling
  await scrollPageHeight(200);
}

// Finds a matching food item (e.g. "American Hot", "Pepperoni Passion")
async function findFoodItemElement(
  name: string,
  logger: Logger
): Promise<{ name: string; selectSize: (size: string) => Promise<void>; addToCartButton: HTMLAnchorElement }> {
  const foodItemElements = Array.from(document.querySelectorAll(".productEntry")).map((container) => {
    const productName = container.querySelector<HTMLHeadingElement>(".product-name")?.textContent ?? "";

    // Find the 'Add to Cart' button
    const addToCartButtonElement = container.querySelector<HTMLAnchorElement>(`.buttonEntry a`);

    if (!addToCartButtonElement) {
      throw new Error(`Failed to find 'Add to cart' button for item '${productName}'`);
    }

    return {
      name: productName,
      selectSize: async (size: string) => {
        // Find the dropdown button
        const sizeDropdownElement = container.querySelector<HTMLSelectElement>(`select.custSelect`);

        // Find the option in the select element
        const sizeOptionElements = Array.from(sizeDropdownElement?.querySelectorAll("option") ?? []).map((optionElement) => {
          const optionTextContent = optionElement.textContent?.trim() ?? "";

          return {
            name: optionTextContent,
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
        sizeDropdownElement?.click();
        await delay(350);
        matchingSizeOption.option.click();
        await delay(350);
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
