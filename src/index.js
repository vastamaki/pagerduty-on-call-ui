import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import GetView from './GetView';
import { Provider } from './Context';
import Notification from './Components/Notification';
import './index.scss';

const routes = (
  <Provider>
    <Notification />
    <Router>
      <Route exact path="/" component={GetView} />
    </Router>
  </Provider>
);

ReactDOM.render(routes, document.getElementById('root'));
