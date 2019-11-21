import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const _render = el => {
  ReactDOM.render(<App />, el);
};

window.renderReactReduxJsApp = _render;
