import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GetView from "./GetView";
import "./index.css";

const routes = (
  <Router>
    <Switch>
      <Route exact path="/" component={GetView} />
    </Switch>
  </Router>
);

ReactDOM.render(routes, document.getElementById("root"));
