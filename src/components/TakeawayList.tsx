import React from "react";
import { Takeaway, TakeawayCategory } from "../data/AllTakeaways";

interface TakeawayListProps {
  availableTakeaways: Takeaway[];
  selectedTakeawayCategory: TakeawayCategory;
  setSelectedTakeawayCategory: (category: TakeawayCategory | null) => void;
  setSelectedTakeaway: (takeaway: Takeaway | null) => void;
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
                  onClick={() => props.setSelectedTakeaway(takeaway)}
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
