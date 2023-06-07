export type TakeawayCategory = typeof takeawayCategories[number];
export type TakeawayURL = typeof TAKEAWAY_URLS[number];

export type TargetSelector = { selector: string; label: string };

export const NAME = "Foodie Fastlane";

export const ALL_TAKEAWAYS: {
  name: string;
  category: TakeawayCategory;
  url: string;
}[] = [
  {
    name: "McDonald's",
    category: "Burger",
    url: "https://www.mcdonalds.co.uk",
  },
  { name: "KFC", category: "Burger", url: "https://www.kfc.co.uk" },
  {
    name: "Burger King",
    category: "Burger",
    url: "https://www.burgerking.co.uk",
  },
  { name: "Five Guys", category: "Burger", url: "https://fiveguys.co.uk" },
  {
    name: "TGI Fridays",
    category: "Burger",
    url: "https://www.tgifridays.co.uk",
  },
  { name: "Leon", category: "Burger", url: "https://www.leon.co" },
  { name: "7Bone", category: "Burger", url: "https://7bone.co.uk/" },
  { name: "Subway", category: "Sandwich", url: "https://www.subway.com/en-GB" },
  { name: "Greggs", category: "Sandwich", url: "https://www.greggs.co.uk" },
  {
    name: "Costa Coffee",
    category: "Sandwich",
    url: "https://www.costa.co.uk",
  },
  {
    name: "Pret a Manger",
    category: "Sandwich",
    url: "https://www.pret.co.uk",
  },
  { name: "Wagamama", category: "Sushi", url: "https://www.wagamama.com" },
  { name: "Yo! Sushi", category: "Sushi", url: "https://www.yosushi.com" },
  {
    name: "Domino's Pizza",
    category: "Pizza",
    url: "https://www.dominos.co.uk",
  },
  { name: "Pizza Hut", category: "Pizza", url: "https://www.pizzahut.co.uk" },
  {
    name: "Papa John's",
    category: "Pizza",
    url: "https://www.papajohns.co.uk",
  },
  {
    name: "PizzaExpress",
    category: "Pizza",
    url: "https://www.pizzaexpress.com",
  },
  { name: "Fireaway", category: "Pizza", url: "https://fireaway.co.uk/" },
];

// Every takeaway option is enabled by default
export const DEFAULT_TAKEAWAYS = ALL_TAKEAWAYS.map(({ name }) => {
  return { name, isEnabled: true };
});

export const takeawayCategories = ["Pizza", "Burger", "Sandwich", "Coffee", "Sushi"] as const;
export const TAKEAWAY_URLS = ALL_TAKEAWAYS.map((takeaway) => takeaway.url);

export const images: string[] = [chrome.runtime.getURL("images/test.jpg")];
export const allTargetSelectors: TargetSelector[] = [{ selector: "._1cRje", label: "Test" }];
