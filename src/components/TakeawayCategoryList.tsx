import React from "react";
import { NAME, TakeawayCategory, TakeawayOrder, TakeawayURL, takeawayCategories } from "../data";

interface TakeawayCategoryListProps {
  availableTakeaways: { name: string; category: TakeawayCategory; url: TakeawayURL, placeOrder: (order: TakeawayOrder) => Promise<void> }[];
  setSelectedTakeawayCategory: (category: TakeawayCategory | null) => void;
}

export const TakeawayCategoryList = (props: TakeawayCategoryListProps) => {
  // Which takeaway categories have atleast one takeaway which is enabled?
  const availableCategories = takeawayCategories.filter((category) =>
    props.availableTakeaways.some((takeaway) => takeaway.category === category)
  );

  // Show the available takeaway categories
  return (
    <div className="wrapper">
      <h3 className="title">{NAME}</h3>
      <ul className="takeaway-category-list">
        {availableCategories.map((category) => {
          return (
            <li key={category} className="takeaway-category-list-item">
              <button
                onClick={() => props.setSelectedTakeawayCategory(category)}
                className="takeaway-category-link"
                style={{
                  backgroundImage: `url(${chrome.runtime.getURL(`images/category-${category.toLowerCase()}.jpg`)})`,
                }}
              >
                {category}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
