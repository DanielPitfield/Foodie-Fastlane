import React from "react";
import { Takeaway, TakeawayCategory, takeawayCategories } from "../data/AllTakeaways";

interface TakeawayCategoryListProps {
  availableTakeaways: Takeaway[];
  setSelectedTakeawayCategory: (category: TakeawayCategory | null) => void;
}

export const TakeawayCategoryList = (props: TakeawayCategoryListProps) => {
  // Which takeaway categories have atleast one takeaway which is enabled?
  const availableCategories = takeawayCategories.filter((category) =>
    props.availableTakeaways.some((takeaway) => takeaway.category === category && takeaway.placeOrderStages.length > 0)
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
              style={{
                backgroundImage: `url(${chrome.runtime.getURL(`images/category-${category.toLowerCase()}.jpg`)})`,
              }}
              className="takeaway-category-link"
              title={category}
              onClick={() => props.setSelectedTakeawayCategory(category)}
            />
          </li>
        );
      })}
    </ul>
  );
};
