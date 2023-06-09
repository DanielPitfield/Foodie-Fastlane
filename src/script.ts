import { ALL_TAKEAWAYS, NAME, PlaceOrderStage, TakeawayOrder } from "./data";

export type Logger = (message: string) => void;

async function checkOrder(logger: Logger) {
  // Find all takeaways with a stage of the current URL
  const matchingTakeaways = ALL_TAKEAWAYS.filter(
    ({ url, placeOrderStages }) =>
      placeOrderStages.some((stage) => stage.urls.some((stageUrl) => isCurrentUrlPatternMatch(stageUrl))) || isCurrentUrlPatternMatch(url)
  );

  logger(`Found ${matchingTakeaways.length} matching takeaway(s) for URL '${window.location.href}': ${JSON.stringify(matchingTakeaways)}`);

  // If no matching takeaways were found for this URL
  if (matchingTakeaways.length <= 0) {
    return;
  }

  if (matchingTakeaways.length !== 1) {
    throw new Error(`Found more than 1 takeaway info for this URL`);
  }

  const matchingTakeaway = matchingTakeaways[0];

  // Find the stage we are on for this matching takeaway
  const matchingStage = matchingTakeaway.placeOrderStages.find((stage) => stage.urls.some((url) => isCurrentUrlPatternMatch(url)));

  if (!matchingStage) {
    // Find the URL of the first stage (as we may need to navigate to it)
    const firstStageUrl = matchingTakeaway.placeOrderStages?.[0].urls?.[0];

    // If not already on the URL of the first stage
    if (new URL(window.location.href).toString() !== new URL(firstStageUrl).toString()) {
      // Navigate to the first stage's URL
      window.location.href = firstStageUrl;
      return;
    }

    // Else; even after navigating to the first stage, no matching stage could be found
    throw new Error("Could not find any matching stage for the matching takeaway info of this URL");
  }

  // What is the name of the current order stage and what number stage is it?
  const stageProgress = `${matchingStage.name} ${
    matchingTakeaway.placeOrderStages.findIndex((stage) => stage.name === matchingStage.name) + 1
  }/${matchingTakeaway.placeOrderStages.length}`;

  addBanner("info", `Your order is being processed (${stageProgress}), please wait...`);

  logger("Retrieving order from storage");

  // Retrieve the order from storage
  const order = JSON.parse((await chrome.storage.sync.get("order"))["order"]) as TakeawayOrder;

  if (!order) {
    throw new Error("Failed to retrieve order from storage");
  }

  logger(`Placing order for '${matchingTakeaway.name}' at stage '${matchingStage.name}': ${JSON.stringify(order)}`);

  try {
    // Run the functionality for this stage of the order
    await matchingStage.placeOrder(order, logger);
  } catch (error) {
    const errorMessage = `Error occurred in takeaway '${matchingTakeaway.name}' at stage '${matchingStage.name}': ${error}`;
    logger(errorMessage);
    addBanner("error", errorMessage);

    throw error;
  }

  // Save any updates made to the order
  await chrome.storage.sync.set({ order: JSON.stringify(order) });
}

// Adds a banner to the page, if not already
function addBanner(type: "info" | "error", messageContent: string) {
  const BANNER_ID = "foodie-fastlane-banner";
  const existingBanner = document.querySelector<HTMLDivElement>(`#${BANNER_ID}`);

  if (existingBanner) {
    existingBanner.setAttribute("data-type", type);
    existingBanner.querySelector(".message")!.textContent = messageContent;
    return;
  }

  const banner = document.createElement("div");
  banner.id = BANNER_ID;
  banner.setAttribute("data-type", type);

  const title = document.createElement("h4");
  title.className = "title";
  title.textContent = NAME;
  banner.appendChild(title);

  const message = document.createElement("h5");
  message.className = "message";
  message.textContent = messageContent;
  banner.appendChild(message);

  const styles = document.createElement("style");
  styles.textContent = `    
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
    
    #foodie-fastlane-banner[data-type='error'] {
      background-color: #e70000 !important;
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

// Determines whether the current URL matches a  URL pattern
function isCurrentUrlPatternMatch(urlPattern: string): boolean {
  const currentUrl = window.location.href;

  // If there are no wildcards
  if (!urlPattern.includes("*")) {
    // Determine whether the URLs are identical (wrap in new URL to avoid trailing slashes being different)
    return new URL(currentUrl).toString() === new URL(urlPattern).toString();
  }

  // If there is an ending wildcard
  if (urlPattern.endsWith("*")) {
    return currentUrl.startsWith(urlPattern.substring(0, urlPattern.length - 1));
  }

  throw new Error(`URL pattern '${urlPattern}' is not supported, the '*' must be the last character`);
}

// Logger
const logger: Logger = (message: string) => {
  console.info(message);

  // TODO: Send log to server when error occurs (for debugging)
};

checkOrder(logger);
