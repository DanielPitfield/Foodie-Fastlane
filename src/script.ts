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

  addBanner();

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

// Adds a banner to the page, if not already
function addBanner() {
  const BANNER_ID = "foodie-fastlane-banner";
  const existingBanner = document.querySelector<HTMLDivElement>(`#${BANNER_ID}`);

  if (existingBanner) {
    return;
  }

  const banner = document.createElement("div");
  banner.id = BANNER_ID;

  const title = document.createElement("h4");
  title.className = "title";
  title.textContent = "Foodie Fastlane";
  banner.appendChild(title);

  const message = document.createElement("h5");
  message.className = "message";
  message.textContent = "Your order is being processed, please wait";
  banner.appendChild(message);

  const styles = document.createElement("style");
  styles.textContent= `  
    body {
      margin-top: 36px !important;
    }
    
    #foodie-fastlane-banner {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      position: fixed !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      z-index: 9999999 !important;
      height: 36px !important;
      background-color: #df7503 !important;
      color: #eee !important;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif !important;
    }
    
    #foodie-fastlane-banner .title,
    #foodie-fastlane-banner .message {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif !important;
      font-size: 14px !important;
      color: white !important;
      margin: 0 !important;
      padding: 0 !important;
      margin-right: 0.5em !important;
      font-weight: normal !important;
      text-transform: uppercase !important;
    }

    #foodie-fastlane-banner .title {
      font-weight: bold !important;
    }
  `;
  banner.appendChild(styles);

  document.body.insertAdjacentHTML("afterbegin", banner.outerHTML);
}

const logger = (message: string) => {
  console.info(message);

  // TODO: Send log to server when error occurs (for debugging)
};

checkOrder(logger);
