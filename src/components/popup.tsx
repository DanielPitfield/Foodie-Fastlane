import React from "react";
import { createRoot } from "react-dom/client";
import useTargetInfo from "../hooks/useTargetInfo";
import { convertTakeawayURLsToNames } from "../utils";

const Popup = () => {
  const targetInfo = useTargetInfo();

  return (
    <div className="wrapper">
      <div className="status" data-is-target-open={targetInfo.isOpen}>
        {targetInfo.isOpen ? `${convertTakeawayURLsToNames(targetInfo.openTakeawayURLs)}` : "Not Active"}
      </div>

      <div className="description">
        {targetInfo.isOpen ? "Auto ordering is available for this site!" : "Go to a takeaway website"}
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
