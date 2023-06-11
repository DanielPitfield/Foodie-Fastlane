import { ALL_TAKEAWAYS, DEFAULT_TAKEAWAYS, Takeaway, TakeawayName } from "./data/AllTakeaways";
import { ALL_DEFAULT_ORDERS, DEFAULT_ORDER, TakeawayOrder } from "./data/DefaultOrders";

// Get the target takeways which are enabled in the options
export async function getTargetTakeaways(): Promise<{ name: TakeawayName; isEnabled: boolean }[]> {
  const item = await chrome.storage.sync.get("targetTakeaways");

  // If a storage entry exists
  if (item.targetTakeaways) {
    // Deserialise the JSON
    return JSON.parse(item.targetTakeaways);
  }

  // Otherwise, all takeaways are enabled
  return DEFAULT_TAKEAWAYS;
}

// Get the default order for the provided takeaway
export function getDefaultOrder(takeaway: Takeaway | null): TakeawayOrder {
  if (!takeaway || !takeaway.name) {
    return DEFAULT_ORDER;
  }

  return ALL_DEFAULT_ORDERS?.[takeaway.name] ?? DEFAULT_ORDER;
}

// Returns a comma seperated list of the names corresponding to the provided takeaway URLs
export function convertTakeawayURLsToNames(takeawayURLs: URL[]): string {
  return (
    takeawayURLs
      // Find the name for the URL
      .map((takeawayURL) => ALL_TAKEAWAYS.find((takeaway) => takeaway.url === takeawayURL)?.name ?? "")
      // Remove those where a name could not be resolved
      .filter((x) => x)
      .join(", ")
  );
}

// Periodically check the active tab's content for the lack of an element with the provided selector
export async function waitUntilElementDoesNotExist(selector: string, timeoutMs = 10000): Promise<void> {
  const POLL_INTERVAL_MS = 100;
  const MAX_NUM_ATTEMPTS = Math.round(timeoutMs / POLL_INTERVAL_MS);
  let numAttempts = 0;

  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      const element = document.querySelector(selector);

      if (!element) {
        clearInterval(intervalId);
        resolve();
        return;
      }

      if (numAttempts >= MAX_NUM_ATTEMPTS) {
        clearInterval(intervalId);
        reject(`Element '${selector}' still exists after ${timeoutMs} milliseconds`);
        return;
      }

      numAttempts++;
    }, POLL_INTERVAL_MS);
  });
}

// Periodically check the active tab's content for an element with the provided selector
export async function waitUntilElementExists<TElement extends HTMLElement>(selector: string, timeoutMs = 10000): Promise<TElement> {
  const POLL_INTERVAL_MS = 100;
  const MAX_NUM_ATTEMPTS = Math.round(timeoutMs / POLL_INTERVAL_MS);
  let numAttempts = 0;

  return new Promise<TElement>((resolve, reject) => {
    const intervalId = setInterval(async () => {
      const element = document.querySelector<TElement>(selector);

      if (element) {
        clearInterval(intervalId);
        resolve(element);
        return;
      }

      if (numAttempts >= MAX_NUM_ATTEMPTS) {
        clearInterval(intervalId);
        reject(`Failed to find element '${selector}' after ${timeoutMs} milliseconds`);
        return;
      }

      numAttempts++;
    }, POLL_INTERVAL_MS);
  });
}

// Capitalises the first letter of the string
export function capitaliseFirstLetter(str: string): string {
  if (!str) {
    return str;
  }

  return `${str[0].toUpperCase()}${str.substring(1)}`;
}

// Waits for the specified time
export async function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => {
      window.clearTimeout(timeoutId);
      resolve();
    }, milliseconds);
  });
}

// Scrolls the entire page height
export async function scrollPageHeight(): Promise<void> {
  // Load all elements of the page by scrolling
  for (let i = 1; i * window.innerHeight < document.body.scrollHeight; i++) {
    window.scrollTo({ behavior: "smooth", top: i * window.innerHeight });
    await delay(150);
  }

  await delay(150);
  window.scrollTo({ behavior: "smooth", top: 0 });
}
