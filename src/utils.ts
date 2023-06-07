// Get the target takeways which are enabled in the options
export async function getEnabledTargetTakeaways(): Promise<{ name: string; isEnabled: boolean }[]> {
  const item = await chrome.storage.sync.get("targetTakeaways");

  // If a storage entry exists
  if (item.targetTakeaways) {
    // Deserialise the JSON
    const targetTakeaways: { name: string; isEnabled: boolean }[] = JSON.parse(item.targetTakeaways);
    return targetTakeaways;
  }

  return [];
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
