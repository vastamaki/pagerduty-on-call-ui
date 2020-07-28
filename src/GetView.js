import React, { PureComponent } from 'react';
import TimeSelect from './Components/TimeSelect';
import Incidents from './Components/Incidents';
import Header from './Components/Header';
import fetch from './Components/Fetch';
import { getWeekDays, mapIncidentToDay } from './helpers';
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
    const { dispatch, sortBy } = this.context;

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

    const incidents = [];
    let offset = 0;
    let response;
    do {
      /* eslint-disable no-await-in-loop */
      response = await fetch(
        encodeURI(
          `https://api.pagerduty.com/incidents?since=${
            startDate
          }&until=${endDate}&team_ids[]=${
            this.context.selectedTeam
          }&time_zone=UTC&total=true&limit=100&offset=${offset}`,
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
      offset += 99;
      response.incidents.forEach((incident) => {
        incidents.push(incident);
      });
    } while (response.more);

    const weekdays = getWeekDays(incidents);
    const sortedIncidents = mapIncidentToDay(weekdays, incidents, sortBy);
    saveIncidents(sortedIncidents, weekdays)(dispatch);
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
            {!this.state.loading && showIncidents ? (
              <Incidents />
            ) : (
              <TimeSelect loading={this.state.loading} fetchIncidents={this.fetchIncidents} />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

GetView.contextType = Context;
