import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import useTargetInfo from "../hooks/useTargetInfo";
import { convertTakeawayURLsToNames, getEnabledTargetTakeaways } from "../utils";
import { ALL_TAKEAWAYS, TakeawayCategory, TakeawayURL } from "../data";

const Popup = () => {
  const targetInfo = useTargetInfo();
  const [availableTakeaways, setAvailableTakeaways] =
    useState<{ name: string; category: TakeawayCategory; url: TakeawayURL }[]>();

  useEffect(() => {
    (async () => {
      // Get the names of the enabled takeaways
      const enabledTakeaways = await getEnabledTargetTakeaways();

      // Get the entire information for the takeaways
      const details = enabledTakeaways
        // Map each option to its takeaway info (URL, category etc.)
        .map((enabledTakeaway) => ALL_TAKEAWAYS.find((takeaway) => takeaway.name === enabledTakeaway.name))
        // Filter out options which could not be mapped
        .filter((x) => x)
        // Tell TypeScript there are no undefined values
        .map((x) => x!);

      setAvailableTakeaways(details);
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

  // Show the links to the available takeaways
  return (
    <div className="wrapper">
      <ul className="takeaway-list">
        {availableTakeaways.map((takeaway) => {
          return (
            <li key={takeaway.name} className="takeaway-list-item">
              <a href={takeaway.url} className="takeaway-link button" target="_blank" rel="noopener noreferrer">
                {takeaway.name}
              </a>
            </li>
          );
        })}
      </ul>
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
