import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import GetView from "./GetView";
import PrivateRoute from "./Components/Auth"
import { Provider } from "./Context";
import Notification from "./Components/Notification/";
import Settings from "./Components/Settings/index"
import Cards from "./Components/Settings/Cards"
import Teams from "./Components/Settings/Teams"
import Filters from "./Components/Filters"
import "./index.css";

const routes = (
  <Provider>
    <Notification />
    <Settings />
    <Cards />
    <Teams />
    <Filters />
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={GetView} />
      </Switch>
    </Router>
  </Provider>
);

ReactDOM.render(routes, document.getElementById("root"));
