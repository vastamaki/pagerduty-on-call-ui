import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Incidents from './Views/Incidents';
import MoreDetailsView from './Views/MoreDetails';
import Sidebar from './Components/Sidebar';
import { Provider } from './Context';
import Notification from './Components/Notification';
import './index.scss';

const routes = (
    <Provider>
      <Notification />
      <div className="App">
        <Sidebar />
        <Router>
          <Route exact path="/" component={Incidents} />
          <Route exact path="/incident/:incident" component={MoreDetailsView} />
        </Router>
      </div>
    </Provider>
);

ReactDOM.render(routes, document.getElementById('root'));
