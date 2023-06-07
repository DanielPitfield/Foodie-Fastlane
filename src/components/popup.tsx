import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import useTargetInfo from "../hooks/useTargetInfo";
import { convertTakeawayURLsToNames, getEnabledTargetTakeaways } from "../utils";
import { ALL_TAKEAWAYS, TakeawayCategory, TakeawayURL, takeawayCategories } from "../data";

const Popup = () => {
  const targetInfo = useTargetInfo();
  const [availableTakeaways, setAvailableTakeaways] =
    useState<{ name: string; category: TakeawayCategory; url: TakeawayURL }[]>();
  const [selectedTakeawayCategory, setSelectedTakeawayCategory] = useState<TakeawayCategory | null>(null);

  useEffect(() => {
    (async () => {
      // Get the names of the enabled takeaways
      const enabledTakeaways = await getEnabledTargetTakeaways();

      // Get the entire information for the takeaways
      const newAvailableTakeaways = enabledTakeaways
        // Map each option to its takeaway info (URL, category etc.)
        .map((enabledTakeaway) => ALL_TAKEAWAYS.find((takeaway) => takeaway.name === enabledTakeaway.name))
        // Filter out options which could not be mapped
        .filter((x) => x)
        // Tell TypeScript there are no undefined values
        .map((x) => x!);

      setAvailableTakeaways(newAvailableTakeaways);
    })();
  }, []);

  if (targetInfo.isOpen) {
    return (
      <div className="wrapper">
        <div className="status" data-is-target-open={targetInfo.isOpen}>
          {`${convertTakeawayURLsToNames(targetInfo.openTakeawayURLs)}`}
        </div>
        <div className="description">{`Auto ordering is available for ${
          targetInfo.openTakeawayURLs.length > 1 ? "these sites!" : "this site!"
        }`}</div>
      </div>
    );
  }

  // If the available takeaways have not loaded yet
  if (!availableTakeaways) {
    return <>Loading...</>;
  }

  if (selectedTakeawayCategory === null) {
    // Which takeaway categories have atleast one takeaway which is enabled?
    const availableCategories = takeawayCategories.filter(category => availableTakeaways.some(takeaway => takeaway.category === category));
    
    // Show the available takeaway categories
    return (
      <div className="wrapper">
        <ul className="takeaway-category-list">
          {availableCategories.map((category) => {
            return (
              <li key={category} className="takeaway-category-list-item">
                <button onClick={() => setSelectedTakeawayCategory(category)} className="takeaway-category-link" style={{backgroundImage: `url(${chrome.runtime.getURL(`images/category-${category.toLowerCase()}.jpg`)})` }}>
                  {category}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Show the links to the available takeaways of the currently selected takeaway category
  return (
    <div className="wrapper">
      <ul className="takeaway-list">
        {availableTakeaways.filter(takeaway => takeaway.category === selectedTakeawayCategory).map((takeaway) => {
          return (
            <li key={takeaway.name} className="takeaway-list-item">
              <a href={takeaway.url} className="takeaway-link" target="_blank" rel="noopener noreferrer">
                {takeaway.name}
              </a>
            </li>
          );
        })}
      </ul>
      <button onClick={() => setSelectedTakeawayCategory(null)}>Back</button>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
