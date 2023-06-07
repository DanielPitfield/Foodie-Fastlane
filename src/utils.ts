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

// Returns an image element (of a random image)
export function createImage(src: string): HTMLImageElement {
  const image: HTMLImageElement = document.createElement("img");

  image.src = src;
  image.width = 150;
  image.height = 150;
  image.style.borderRadius = "1em";

  return image;
}
