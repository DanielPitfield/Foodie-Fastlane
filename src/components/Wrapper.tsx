import React from "react";
import { NAME } from "../data";

interface WrapperProps {
  children?: React.ReactNode;
}

export const Wrapper = (props: WrapperProps) => {
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
