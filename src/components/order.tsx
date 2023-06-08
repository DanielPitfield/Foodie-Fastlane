import { useEffect } from "react";
import { TakeawayOrder } from "../data";
import React from "react";

export const Order = () => {
  useEffect(() => {
    const order: TakeawayOrder = {
      type: "collection",
      address: {
        street1: "Beach",
        street2: "",
        postCode: "BH5 1BN",
        townCity: "Boscombe",
      },
      time: "ASAP",
      food: [
        {
          name: "Bacon Cheeseburger",
          quantity: 1,
          options: [
            { name: "Fresh Onions", quantity: 1 },
            { name: "Pickles", quantity: 1 },
            { name: "Tomato", quantity: 1 },
            { name: "Grilled Onions", quantity: 1 },
            { name: "Ketchup", quantity: 1 },
            { name: "Hot Sauce", quantity: 1 },
          ],
        },
        {
          name: "Bacon Cheeseburger",
          quantity: 1,
          options: [
            { name: "Mayo", quantity: 1 },
            { name: "Fresh Onions", quantity: 1 },
            { name: "Lettuce", quantity: 1 },
            { name: "Grilled Onions", quantity: 1 },
            { name: "BBQ Sauce", quantity: 1 },
            { name: "Lettuce Wrap", quantity: 1 },
          ],
        },
        {
          name: "Cheeseburger",
          quantity: 1,
          options: [
            { name: "Fresh Onions", quantity: 1 },
            { name: "Grilled Onions", quantity: 1 },
            { name: "Ketchup", quantity: 1 },
            { name: "BBQ Sauce", quantity: 1 },
          ],
        },
        {
          name: "Bacon Cheeseburger",
          quantity: 1,
          options: [
            { name: "Fresh Onions", quantity: 1 },
            { name: "Grilled Mushrooms", quantity: 1 },
            { name: "Ketchup", quantity: 1 },
            { name: "Green Peppers", quantity: 1 },
            { name: "BBQ Sauce", quantity: 1 },
          ],
        },
        {
          name: "Large Cajun Fries",
          quantity: 3,
        },
      ],
    };

    chrome.storage.sync.set({ order: JSON.stringify(order) });
  }, []);

  return <></>;
};
