import React from "react";
import { TakeawayCategory, TakeawayName } from "../data/AllTakeaways";

interface TakeawayListProps {
  availableTakeaways: { name: TakeawayName; category: TakeawayCategory; url: URL }[];
  selectedTakeawayCategory: TakeawayCategory;
  setSelectedTakeawayCategory: (category: TakeawayCategory | null) => void;
  setSelectedTakeaway: (takeawayName: TakeawayName | null) => void;
}

export const TakeawayList = (props: TakeawayListProps) => {
  // Show the links to the available takeaways of the currently selected takeaway category
  return (
    <>
      <ul className="takeaway-list">
        {props.availableTakeaways
          .filter((takeaway) => takeaway.category === props.selectedTakeawayCategory)
          .map((takeaway) => {
            return (
              <li key={takeaway.name} className="takeaway-list-item">
                <a
                  href={takeaway.url.toString()}
                  onClick={() => props.setSelectedTakeaway(takeaway.name)}
                  className="takeaway-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {takeaway.name}
                </a>
              </li>
            );
          })}
      </ul>

      <button className="back-button" onClick={() => props.setSelectedTakeawayCategory(null)}>
        Back
      </button>
    </>
  );
};
