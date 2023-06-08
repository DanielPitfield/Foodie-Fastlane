import { ALL_TAKEAWAYS, DEFAULT_TAKEAWAYS, TakeawayURL } from "./data";

// Get the target takeways which are enabled in the options
export async function getEnabledTargetTakeaways(): Promise<{ name: string; isEnabled: boolean }[]> {
  const item = await chrome.storage.sync.get("targetTakeaways");

  // If a storage entry exists
  if (item.targetTakeaways) {
    // Deserialise the JSON
    const targetTakeaways: { name: string; isEnabled: boolean }[] = JSON.parse(item.targetTakeaways);
    // Only the enabled options
    return targetTakeaways.filter((option) => option.isEnabled);
  }

  // Otherwise, all takeaways are enabled
  return DEFAULT_TAKEAWAYS;
}

// Returns a comma seperated list of the names corresponding to the provided takeaway URLs
export function convertTakeawayURLsToNames(takeawayURLs: TakeawayURL[]) {
  return (
    takeawayURLs
      // Find the name for the URL
      .map((takeawayURL) => ALL_TAKEAWAYS.find((takeaway) => takeaway.url === takeawayURL)?.name ?? "")
      // Remove those where a name could not be resolved
      .filter((x) => x)
      .join(", ")
  );
}

// Periodically check the active tab's content for an element with the provided selector
export async function waitUntilElementExists<TElement extends HTMLElement>(
  selector: string,
  timeoutMs = 10000
): Promise<TElement> {
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
