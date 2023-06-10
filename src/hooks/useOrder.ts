import { useEffect } from "react";
import { TakeawayOrder } from "../data/DefaultOrders";

function useOrder(order: TakeawayOrder) {
  useEffect(() => {
    chrome.storage.sync.set({ order: JSON.stringify(order) });
  }, [order]);
}

export default useOrder;
