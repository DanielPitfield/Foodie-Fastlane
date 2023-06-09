import { useEffect } from "react";
import { TakeawayOrder } from "../data";

function useOrder(order: TakeawayOrder) {
  useEffect(() => {
    chrome.storage.sync.set({ order: JSON.stringify(order) });
  }, [order]);
}

export default useOrder;
