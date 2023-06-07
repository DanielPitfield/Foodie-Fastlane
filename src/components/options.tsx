import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ALL_TAKEAWAYS } from "../data";
import useTargetInfo from "../hooks/useTargetInfo";
import { getEnabledTargetTakeaways } from "../utils";

const Options = () => {
  const targetInfo = useTargetInfo();

  // All takeaways are enabled by default
  const defaultTakeaways = ALL_TAKEAWAYS.map(({ name }) => {
    return { name, isEnabled: true };
  });

  const [targetTakeaways, setTargetTakeaways] = useState<{ name: string; isEnabled: boolean }[]>(defaultTakeaways);
  const [status, setStatus] = useState<string>("");

  // Restores the state of the enabled takeaways (using the preferences stored in chrome.storage)
  useEffect(() => {
    (async () => {
      setTargetTakeaways(await getEnabledTargetTakeaways());
    })();
  }, []);

  // Update status message to show options have been saved
  function showConfirmation() {
    if (targetInfo.isOpen) {
      // What is/are the name(s) of the open takeaway(s)?
      const openTakeawayNames = targetInfo.openTakeawayURLs
        // FInd the name for the URL
        .map((takeawayURL) => ALL_TAKEAWAYS.find((takeaway) => takeaway.url === takeawayURL)?.name ?? "")
        // Remove any which could not be resolved
        .filter(x => x)
        .join(", ");
      
      // Instruct the user to refresh the open takeaway tabs
      setStatus(`Options saved. Refresh ${openTakeawayNames}`);
    } else {
      setStatus("Options saved. Refresh.");
    }

    // Clear status message
    const id = setTimeout(() => {
      setStatus("");
    }, 5000);

    return () => clearTimeout(id);
  }

  // Saves options to chrome.storage
  async function saveOptions() {
    await chrome.storage.sync.set({
      targetTakeways: JSON.stringify(targetTakeaways),
    });

    showConfirmation();
  }

  function toggleOption(name: string) {
    // Find the option being changed in targetTakeaways
    const changedOption = targetTakeaways.find((option) => option.name === name);

    // Toggle enabled status
    if (changedOption) {
      changedOption.isEnabled = !changedOption.isEnabled;

      // Update state with the new option
      setTargetTakeaways([...targetTakeaways.filter((option) => option.name !== name), changedOption]);
    }
  }

  return (
    <>
      <div className="options">
        <h3 className="title">Takeaways</h3>
        <p>Select which takeways are automatically ordered</p>
        {ALL_TAKEAWAYS.map(({ name }) => (
          <label key={name} className="option">
            <input
              type="checkbox"
              className="option-checkbox"
              checked={targetTakeaways?.some((option) => option.name === name && option.isEnabled)}
              onClick={() => toggleOption(name)}
            />
            <span className="option-text">{name}</span>
          </label>
        ))}
      </div>

      {status && <div className="status">{status}</div>}
      <button onClick={saveOptions}>Save</button>
    </>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
