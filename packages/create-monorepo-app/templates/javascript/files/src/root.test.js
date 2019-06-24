import React from "react";
import ReactDOM from "react-dom";
import { Root } from "./root";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Root title={"Title!"} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
