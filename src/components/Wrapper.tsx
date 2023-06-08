import React from "react";
import { NAME } from "../data";

export const Wrapper: (props: { children: React.ReactNode }) => JSX.Element = (props) => {
  return (
    <div className="wrapper">
      <header>
        <h3 className="title">{NAME}</h3>
        <img className="icon" src={chrome.runtime.getURL("icon.png")} width={64} />
      </header>
      <main className="content">{props.children}</main>
    </div>
  );
};
