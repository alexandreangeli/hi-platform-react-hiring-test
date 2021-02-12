import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import SelectorsWrapper from "./components/SelectorsWrapper";
import data from "./data.json";

ReactDOM.render(
  <React.StrictMode>
    <SelectorsWrapper data={data} />
  </React.StrictMode>,
  document.getElementById("root")
);
