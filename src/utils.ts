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
      // Remove any which could not be resolved
      .filter((x) => x)
      .join(", ")
  );
}

// Periodically check the active tab's content for an element with the provided selector
export async function waitUntilElementExists<TElement extends HTMLElement>(
  selector: string,
  timeoutMilliseconds = 10000
): Promise<TElement> {
  const POLL_MILLISECONDS = 100;
  const maxNumberOfAttempts = Math.round(timeoutMilliseconds / 100);
  let numberOfAttempts = 0;

  return new Promise<TElement>((resolve, reject) => {
    const intervalId = setInterval(async () => {
      const element = document.querySelector<TElement>(selector);

      if (element) {
        clearInterval(intervalId);
        resolve(element);
      }

      if (numberOfAttempts >= maxNumberOfAttempts) {
        reject(`Failed to find element '${selector}' after ${timeoutMilliseconds} milliseconds`);
      }

      numberOfAttempts++;
    }, POLL_MILLISECONDS);
  });
}

// Returns an image element (of a random image)
export function createImage(src: string): HTMLImageElement {
  const image: HTMLImageElement = document.createElement("img");

  image.src = src;
  image.width = 150;
  image.height = 150;
  image.style.borderRadius = "1em";

  return image;
}
