import { useState, useEffect } from "react";
import { TAKEAWAY_URLS, TakeawayURL } from "../data";

// Which of the supported takeaway websites are open within the current window (if any)?
function useTargetInfo() {
  const [targetInfo, setTargetInfo] = useState<{ isOpen: false } | { isOpen: true; openTakeawayURLs: TakeawayURL[] }>({
    isOpen: false,
  });

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const openTakeawayURLs = TAKEAWAY_URLS.filter((URL) => tabs.some((tab) => (tab.url ?? "-").startsWith(URL)));
      setTargetInfo(openTakeawayURLs.length > 0 ? { isOpen: true, openTakeawayURLs } : { isOpen: false });
    });
  }, []);

  return targetInfo;
}

export default useTargetInfo;
