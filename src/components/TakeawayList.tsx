import React from "react";
import { TakeawayCategory, TakeawayURL } from "../data";

interface TakeawayListProps {
  availableTakeaways: { name: string; category: TakeawayCategory; url: TakeawayURL }[];
  selectedTakeawayCategory: TakeawayCategory;
  setSelectedTakeawayCategory: (category: TakeawayCategory | null) => void;
}

export const TakeawayList = (props: TakeawayListProps) => {
  // Show the links to the available takeaways of the currently selected takeaway category
  return (
    <div className="wrapper">
      <ul className="takeaway-list">
        {props.availableTakeaways
          .filter((takeaway) => takeaway.category === props.selectedTakeawayCategory)
          .map((takeaway) => {
            return (
              <li key={takeaway.name} className="takeaway-list-item">
                <a href={takeaway.url} className="takeaway-link" target="_blank" rel="noopener noreferrer">
                  {takeaway.name}
                </a>
              </li>
            );
          })}
      </ul>
      <button onClick={() => props.setSelectedTakeawayCategory(null)}>Back</button>
    </div>
  );
};
