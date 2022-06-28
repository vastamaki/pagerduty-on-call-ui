import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Incidents from "./Views/Incidents";
import MoreDetailsView from "./Views/MoreDetails";
import Sidebar from "./Components/Sidebar";
import { Provider } from "./Context";
import Notification from "./Components/Notification";
import "./index.scss";

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider>
    <Notification />
    <div className="App">
      <Sidebar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={Incidents} />
          <Route path="/incident/:incident" element={MoreDetailsView} />
        </Routes>
      </BrowserRouter>
    </div>
  </Provider>
);
