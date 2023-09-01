import { Takeaway } from "../AllTakeaways";
import { TakeawayOrder } from "../DefaultOrders";
import { waitUntilElementExists } from "../../utils";
import { Logger } from "../Other";

export const FIVE_GUYS: Takeaway = {
  name: "Five Guys",
  category: "Burger",
  url: new URL("https://order.fiveguys.co.uk"),
  placeOrderStages: [
    {
      name: "Find Store",
      urls: ["https://order.fiveguys.co.uk/findpostcode"],
      placeOrder: async (order: TakeawayOrder) => {
        if (order.type !== "collection") {
          throw new Error(`Only 'collection' takeaways are supported for Five Guys`);
        }

        const searchInput = await waitUntilElementExists<HTMLInputElement>("input#txtfindpostcode");

        if (!searchInput) {
          throw new Error("Could not find the 'Postcode Search' input");
        }

        searchInput.value = order.address.postCode;

        const submitButton = await waitUntilElementExists<HTMLButtonElement>("button#btnfind");

        if (!submitButton) {
          throw new Error("Could not find the 'Find/Submit' button");
        }

        submitButton.click();
      },
    },
    {
      name: "Select Store",
      urls: ["https://order.fiveguys.co.uk/StoreSelection"],
      placeOrder: async (order: TakeawayOrder) => {
        const firstStoreLink = await waitUntilElementExists<HTMLAnchorElement>("[id^=store] a[href^='/TimeSlotSelection']");

        if (!firstStoreLink) {
          throw new Error("Could not find the any store to collect from");
        }

        firstStoreLink.click();
      },
    },
    {
      name: "Select Time",
      urls: ["https://order.fiveguys.co.uk/TimeSlotSelection*"],
      placeOrder: async (order: TakeawayOrder) => {
        // If the order is not wanted as-soon-as-possible
        if (order.time !== "ASAP") {
          // Round the time to the nearest 5-minute slot
          order.time.setMinutes(Math.ceil(order.time.getMinutes() / 5) * 5);

          // Get the time of the order in the format "hh:mm"
          const timeString = `${order.time.getHours().toString().padStart(2, "0")}${order.time.getMinutes().toString().padStart(2, "0")}`;

          const timeSlotOption = await waitUntilElementExists<HTMLOptionElement>(`select#daywiseslot option[value$='${timeString}']`);

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
      name: "Select Food",
      urls: ["https://order.fiveguys.co.uk/menu"],
      placeOrder: async (order: TakeawayOrder, logger: Logger) => {
        // Find the next item without a status (that hasn't been processed yet)
        const nextItem = order.food.find((food) => food.status === undefined);

        if (!nextItem) {
          order.isComplete = true;
          return;
        }

        nextItem.status = "adding-to-cart";

        const { link } = await findFoodItemElement(nextItem.name, logger);

        // Open the page
        link.click();
      },
    },
    {
      name: "Add Food",
      urls: [
        "https://order.fiveguys.co.uk/little*",
        "https://order.fiveguys.co.uk/large*",
        "https://order.fiveguys.co.uk/bacon*",
        "https://order.fiveguys.co.uk/cheese*",
        "https://order.fiveguys.co.uk/ham*",
        "https://order.fiveguys.co.uk/hot*",
        "https://order.fiveguys.co.uk/grilled*",
        "https://order.fiveguys.co.uk/veggie*",
        "https://order.fiveguys.co.uk/five-guys-style*",
        "https://order.fiveguys.co.uk/cajun*",
        "https://order.fiveguys.co.uk/milkshake*",
        "https://order.fiveguys.co.uk/soda*",
        "https://order.fiveguys.co.uk/smart-water*",
      ],
      placeOrder: async (order: TakeawayOrder, logger: Logger) => {
        const inProgressItem = order.food.find((food) => food.status === "adding-to-cart");

        if (!inProgressItem) {
          throw new Error("Failed to find the current item being added to the cart");
        }

        logger(`Configuring food item '${inProgressItem.name}'`);

        if (inProgressItem.quantity > 1) {
          const increaseQuantityButton = await waitUntilElementExists<HTMLButtonElement>(".totalcount button.btn-plus");

          if (!increaseQuantityButton) {
            throw new Error("Could not find the 'Increase Quantity' button");
          }

          for (let currentQuantity = 1; currentQuantity < inProgressItem.quantity; currentQuantity++) {
            // Increase the quantity by 1
            logger(`Incrementing quantity`);
            increaseQuantityButton.click();
          }

          logger(`Successfully set quantity to '${inProgressItem.quantity}'`);
        }

        // For each option on this food item
        for (const option of inProgressItem.options ?? []) {
          logger(`Adding option '${option.name}'`);

          const { element } = await findFoodOptionElement(option.name, logger);

          // Check the option
          if (option.quantity >= 1) {
            element.click();
          }

          logger(`Successfully added option '${option.name}'`);
        }

        inProgressItem.status = "in-cart";

        const addToCartButton = await waitUntilElementExists<HTMLButtonElement>("button[id^='add-to-cart']");
        addToCartButton.click();

        logger(`Successfully added food item '${inProgressItem.name}' to cart`);
      },
    },
  ],
  saveOrder: async (logger: Logger) => {
    // TODO: Get the key value pairs of the shopping cart form and construct a TakeawayOrder object to save
  },
};

// Finds a matching food item (e.g. "Cheeseburger", "Bacon Cheeseburger")
async function findFoodItemElement(name: string, logger: Logger): Promise<{ name: string; link: HTMLAnchorElement }> {
  // Ensure the food items have loaded
  await waitUntilElementExists(".items-box a");

  // Find all food item elements, and the names of the products (i.e. "Cheeseburger", "Bacon Cheeseburger")
  const foodItemElements = Array.from(document.querySelectorAll<HTMLAnchorElement>(".items-box a")).map((link) => ({
    name: link.querySelector(".product-title")?.textContent ?? "",
    link,
  }));

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

// Finds a matching food option element (e.g. "Tomato", "Mayo", "Lettuce" etc.)
async function findFoodOptionElement(name: string, logger: Logger): Promise<{ name: string; element: HTMLLabelElement }> {
  // Ensure the food options have loaded
  await waitUntilElementExists("label[for^='product_attribute']");

  // Find all food option elements (e.g. "Tomato", "Mayo", "Lettuce" etc.)
  const foodOptionElements = Array.from(document.querySelectorAll<HTMLLabelElement>("label[for^='product_attribute']")).map((element) => {
    // Get the label text e.g. "Grilled Onions (12 kcal)"
    const labelText = element.textContent ?? "";

    const name = labelText.includes(" (")
      ? // Trim the calories e.g. "(12 kcal)" and remove excess whitespace
        labelText.substring(0, labelText.indexOf(" (")).trim()
      : // Just remove excess whitespace
        labelText.trim();

    return { name, element };
  });

  // Find the food option element
  const foodOptionElement = foodOptionElements.find((element) => element.name === name);

  if (!foodOptionElement) {
    throw new Error(
      `Failed to find food option element '${name}', available elements were: ${foodOptionElements
        .map((option) => `'${option.name}'`)
        .join(", ")}`
    );
  }

  logger(`Found matching food option element '${name}'`);

  return foodOptionElement;
}
