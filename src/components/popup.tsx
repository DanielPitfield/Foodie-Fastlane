import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Wrapper } from "./Wrapper";
import { TakeawayCategoryList } from "./TakeawayCategoryList";
import { TakeawayList } from "./TakeawayList";
import { ALL_TAKEAWAYS, Takeaway, TakeawayCategory, TakeawayName } from "../data/AllTakeaways";
import { convertTakeawayURLsToNames, getDefaultOrder, getTargetTakeaways } from "../utils";
import useTargetInfo from "../hooks/useTargetInfo";
import useOrder from "../hooks/useOrder";

const Popup = () => {
  const targetInfo = useTargetInfo();
  const [availableTakeaways, setAvailableTakeaways] = useState<Takeaway[]>([]);
  const [selectedTakeawayCategory, setSelectedTakeawayCategory] = useState<TakeawayCategory | null>(null);
  const [selectedTakeaway, setSelectedTakeaway] = useState<Takeaway | null>(null);

  useEffect(() => {
    (async () => {
      const targetTakeaways = await getTargetTakeaways();
      // What are the names of the takeaways which are enabled in the options?
      const enabledTakeawayNames: TakeawayName[] = targetTakeaways.filter((option) => option.isEnabled).map((option) => option.name);

      setAvailableTakeaways(ALL_TAKEAWAYS.filter((takeaway) => enabledTakeawayNames.includes(takeaway.name)));
    })();
  }, []);

  useOrder(getDefaultOrder(selectedTakeaway));

  // There is already an open tab with a takeaway URL
  if (targetInfo.isOpen) {
    return (
      <Wrapper>
        <div className="status" data-is-target-open={targetInfo.isOpen}>
          {`${convertTakeawayURLsToNames(targetInfo.openTakeawayURLs)}`}
        </div>
        <div className="description">{`Auto ordering is available for ${
          targetInfo.openTakeawayURLs.length > 1 ? "these sites!" : "this site!"
        }`}</div>
      </Wrapper>
    );
  }

  // If the available takeaways have not loaded yet
  if (!availableTakeaways) {
    return <Wrapper>Loading...</Wrapper>;
  }

  // Not yet chosen a category
  if (selectedTakeawayCategory === null) {
    return (
      <Wrapper>
        <TakeawayCategoryList availableTakeaways={availableTakeaways} setSelectedTakeawayCategory={setSelectedTakeawayCategory} />
      </Wrapper>
    );
  }

  // Chosen a category, show the takeaways belonging to that category
  return (
    <Wrapper>
      <TakeawayList
        availableTakeaways={availableTakeaways}
        selectedTakeawayCategory={selectedTakeawayCategory}
        setSelectedTakeawayCategory={setSelectedTakeawayCategory}
        setSelectedTakeaway={setSelectedTakeaway}
      />
    </Wrapper>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
