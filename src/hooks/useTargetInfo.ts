import { useState, useEffect } from "react";
import { ALL_TAKEAWAYS } from "../data/AllTakeaways";

// Which of the supported takeaway websites are open within the current window (if any)?
function useTargetInfo() {
  const [targetInfo, setTargetInfo] = useState<{ isOpen: false } | { isOpen: true; openTakeawayURLs: URL[] }>({
    isOpen: false,
  });

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const openTakeawayURLs: URL[] = ALL_TAKEAWAYS.filter((takeaway) =>
        tabs.some((tab) => (tab.url ?? "-").startsWith(takeaway.url.toString()))
      ).map((takeaway) => takeaway.url);
      
      setTargetInfo(openTakeawayURLs.length > 0 ? { isOpen: true, openTakeawayURLs } : { isOpen: false });
    });
  }, []);

  return targetInfo;
}

export default useTargetInfo;
