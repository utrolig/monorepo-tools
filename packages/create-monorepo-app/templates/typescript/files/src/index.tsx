import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

type WindowType = typeof window & {
  renderReactTsApp: (el: HTMLElement) => void;
};

const _render = (el: HTMLElement): void => {
  ReactDOM.render(<App />, el);
};

(window as WindowType).renderReactTsApp = _render;
