import { ALL_TAKEAWAYS, TakeawayOrder } from "./data";

async function checkOrder(logger: (message: string) => void) {
  // Find all takeaways with a stage of the current URL
  const matchingTakeaways = ALL_TAKEAWAYS.filter(({ placeOrderStages }) =>
    placeOrderStages.some((stage) => stage.urls.some((url) => window.location.href.startsWith(url)))
  );

  logger(`Found ${matchingTakeaways.length} matching takeaway(s) for URL '${window.location.href}': ${JSON.stringify(matchingTakeaways)}`);

  // If no matching takeaways were found for this URL
  if (matchingTakeaways.length <= 0) {
    // Exit
    return;
  }

  if (matchingTakeaways.length !== 1) {
    throw new Error(`Found more than 1 takeaway info for this URL`);
  }

  const matchingTakeaway = matchingTakeaways[0];

  // FInd the stage we are on for this matching takeaway
  const matchingStage = matchingTakeaway.placeOrderStages.find((stage) => stage.urls.some((url) => window.location.href.startsWith(url)));

  if (!matchingStage) {
    throw new Error(`Found 0 matching stage for matching takeaway info for this URL`);
  }

  logger(`Retrieving order from storage`);

  // Retrieve the order from storage
  const order = JSON.parse((await chrome.storage.sync.get("order"))["order"]) as TakeawayOrder;

  if (!order) {
    throw new Error(`Failed to retrieve order from storage`);
  }

  logger(`Placing order for '${matchingTakeaway.name}' at stage '${matchingStage.name}': ${JSON.stringify(order)}`);

  try {
    // Run the functionality for this stage of the order
    await matchingStage.placeOrder(order, logger);
  } catch (error) {
    logger(`Error occurred in takeaway '${matchingTakeaway.name}' at stage '${matchingStage.name}': ${error}`);
    throw error;
  }

  // Save any updates made to the order
  await chrome.storage.sync.set({ order: JSON.stringify(order) });
}

const logger = (message: string) => {
  console.info(message);

  // TODO: Send log to server when error occurs (for debugging)
};

checkOrder(logger);
