import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GetView from './GetView';
import { Provider } from './Context';
import Notification from './Components/Notification';
import Modals from './Components/Modals';
import Footer from './Components/Footer';
import './index.css';

const routes = (
  <Provider>
    <Notification />
    <Modals />
    <Router>
      <Switch>
        <Route exact path='/' component={GetView} />
      </Switch>
    </Router>
    <Footer />
  </Provider>
);

ReactDOM.render(routes, document.getElementById('root'));
