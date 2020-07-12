import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GetView from "./GetView";
import { Provider } from "./Context";
import "./index.css";

const routes = (
  <Provider>
    <Router>
      <Switch>
        <Route exact path="/" component={GetView} />
      </Switch>
    </Router>
  </Provider>
);

ReactDOM.render(routes, document.getElementById("root"));
