import React, { PureComponent } from 'react';
import TimeSelect from './Components/TimeSelect';
import Incidents from './Components/Incidents';
import Header from './Components/Header';
import fetch from './Components/Fetch';
import mapIncidentToDay from './helpers';
import {
  saveIncidents,
  clearIncidents,
  toggleNotification,
} from './Context/actions';
import { Context } from './Context';
import 'react-datepicker/dist/react-datepicker.css';
import './GetView.css';

export default class GetView extends PureComponent {
  state = {
    offset: 0,
    loading: false,
  };

  fetchIncidents = async (startDate, endDate) => {
    const { dispatch, sorting, selectedTeam } = this.context;

    this.setState({
      loading: true,
    });

    const params = {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.pagerduty+json;version=2',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    };

    let incidents = [];
    let offset = 0;
    let response;
    do {
      /* eslint-disable no-await-in-loop */
      response = await fetch(
        encodeURI(
          `https://api.pagerduty.com/incidents?since=${startDate}&until=${endDate}&team_ids[]=${selectedTeam}&time_zone=UTC&total=true&limit=100&offset=${offset}`,
        ),
        params,
      );

      if (!response.incidents[0] || response.error) {
        this.setState({
          loading: false,
        });
        toggleNotification({
          hidden: false,
          success: false,
          message: 'No incidents found!',
        })(dispatch);
        return clearIncidents()(dispatch);
      }
      offset += 100;
      incidents = incidents.concat(response.incidents);
    } while (response.more);

    const sortedIncidents = mapIncidentToDay(incidents, sorting);
    saveIncidents(sortedIncidents)(dispatch);
    return this.setState({
      loading: false,
    });
  };

  render() {
    const { showIncidents } = this.context;

    return (
      <React.Fragment>
        <Header />
        <div className="App">
          <div className="App-header">
            {!loading && showIncidents ? (
              <Incidents />
            ) : (
              <TimeSelect
                loading={loading}
                fetchIncidents={this.fetchIncidents}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

GetView.contextType = Context;
