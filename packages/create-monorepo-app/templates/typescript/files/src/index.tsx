import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

function render() {
  const el = document.getElementById("page");
  ReactDOM.render(<App />, el);
}

render();
