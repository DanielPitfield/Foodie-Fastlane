import React from "react";
import { TakeawayCategory, takeawayCategories } from "../data/AllTakeaways";

interface TakeawayCategoryListProps {
  availableTakeaways: { name: string; category: TakeawayCategory; url: URL }[];
  setSelectedTakeawayCategory: (category: TakeawayCategory | null) => void;
}

export const TakeawayCategoryList = (props: TakeawayCategoryListProps) => {
  // Which takeaway categories have atleast one takeaway which is enabled?
  const availableCategories = takeawayCategories.filter((category) =>
    props.availableTakeaways.some((takeaway) => takeaway.category === category)
  );

  // There are no takeaway categories to show (liekly due to no takeaways being enabled)
  if (availableCategories.length <= 0) {
    return <>Enable takeaways in the options</>;
  }

  // Show the available takeaway categories
  return (
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
  );
};
