import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import useTargetInfo from "../hooks/useTargetInfo";
import { convertTakeawayURLsToNames, getEnabledTargetTakeaways } from "../utils";
import { ALL_TAKEAWAYS, TakeawayCategory, TakeawayOrder, TakeawayURL } from "../data";
import { TakeawayCategoryList } from "./TakeawayCategoryList";
import { TakeawayList } from "./TakeawayList";

const Popup = () => {
  const targetInfo = useTargetInfo();
  const [availableTakeaways, setAvailableTakeaways] =
    useState<{ name: string; category: TakeawayCategory; url: TakeawayURL, placeOrder: (order: TakeawayOrder) => Promise<void> }[]>();
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

  // There is already an open tab with a takeaway URL
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

  // Not yet chosen a category
  if (selectedTakeawayCategory === null) {
    return (
      <TakeawayCategoryList
        availableTakeaways={availableTakeaways}
        setSelectedTakeawayCategory={setSelectedTakeawayCategory}
      />
    );
  }

  // Chosen a category, show the takeaways belonging to that category
  return (
    <TakeawayList
      availableTakeaways={availableTakeaways}
      selectedTakeawayCategory={selectedTakeawayCategory}
      setSelectedTakeawayCategory={setSelectedTakeawayCategory}
    />
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
