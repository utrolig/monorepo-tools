import React from "react";
import ReactDOM from "react-dom";
import pkgJson from "../package.json";
import { Root } from "./root";

function render() {
  const element = document.getElementById("page");
  ReactDOM.render(<Root title={pkgJson.name} />, element);
}

render();
