import React, { Component } from 'react';
import { startOfWeek, endOfWeek } from 'date-fns';
import {
  getTeams, setCurrentUser, setDefaultTeams, fetchIncidents,
} from './actions';
import { sortIncidents, asyncLocalStorage } from '../helpers';
import fetch from '../Components/Fetch';

export const Context = React.createContext({});

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload,
      };
    case 'GET_TEAMS':
      return {
        ...state,
        teams: action.payload,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
      };
    case 'SET_HOUR_MARK': {
      const hours = {
        hoursMarked: {
          ...state.hoursMarked,
          [action.payload.day]: state.hoursMarked[action.payload.day]
            ? [
              ...state.hoursMarked[action.payload.day],
              action.payload.incidentNumber,
            ]
            : [action.payload.incidentNumber],
        },
      };
      localStorage.setItem('hoursMarked', JSON.stringify(hours.hoursMarked));
      return hours;
    }
    case 'GET_INCIDENTS':
      return {
        ...state,
        incidents: action.payload,
        showIncidents: true,
      };
    case 'CLEAR_INCIDENTS':
      return {
        ...state,
        incidents: [],
        showIncidents: false,
      };
    case 'TOGGLE_NOTIFICATION':
      return {
        ...state,
        notification: {
          hidden: action.payload.hidden,
          message: action.payload.message,
          success: action.payload.success,
          timeout: action.payload.timeout,
        },
      };
    case 'HIDE_NOTIFICATION':
      return {
        ...state,
        notification: {
          hidden: true,
          timeout: clearTimeout(state.notification.timeout),
        },
      };
    case 'UPDATE_CARD_CONTENT':
      return {
        ...state,
        cardContent: {
          ...state.cardContent,
          [action.payload.name]: action.payload.value,
        },
      };
    case 'CHANGE_SORTING':
      return {
        ...state,
        sorting: action.payload,
        incidents: sortIncidents(state.incidents, action.payload),
      };
    case 'SET_DEFAULT_TEAMS':
      return {
        ...state,
        selectedTeam: action.payload,
        selectedTeamName: `${state.currentUser.name} | All current user teams`,
      };
    case 'SET_SELECTED_TEAM':
      return {
        ...state,
        selectedTeam: [action.payload.teamID],
        selectedTeamName: `${state.currentUser.name} | ${action.payload.teamName}`,
      };
    case 'SELECT_INCIDENT':
      return {
        ...state,
        selectedIncidents: [...state.selectedIncidents, action.payload],
      };
    case 'SET_DATE_RANGE':
      return {
        ...state,
        [action.payload.option]: action.payload.date,
      };
    case 'CLEAR_SELECTED_INCIDENTS':
      return {
        ...state,
        selectedIncidents: [],
      };
    default:
      return state;
  }
};
export class Provider extends Component {
  state = {
    teams: [],
    incidents: {},
    hoursMarked: {},
    filters: {
      exclude: '',
      showOnlyOwnIncidents: false,
    },
    selectedIncidents: [],
    notification: {
      hidden: true,
      message: '',
      success: true,
    },
    showIncidents: false,
    cardContent: {
      summary: true,
      createdAt: true,
      latestChange: true,
      changedBy: true,
    },
    sorting: {
      times: {
        by: 'createdAt',
        direction: 'asc',
      },
      names: {
        by: 'serviceName',
        direction: 'asc',
        active: false,
      },
    },
    loading: true,
    currentUser: {},
    selectedTeamName: 'All current user teams',
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    dispatch: (action) => this.setState((state) => reducer(state, action)),
  };

  checkToken = async () => {
    const token = localStorage.getItem('access_token');
    const { search } = window.location;
    const queryParams = new URLSearchParams(search);
    const authorizationCode = queryParams.get('code');

    if (!token && !authorizationCode) {
      return false;
    }

    if (authorizationCode) {
      const params = {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.pagerduty+json;version=2',
        },
      };

      try {
        const response = await fetch(
          encodeURI(
            `https://app.pagerduty.com/oauth/token?grant_type=authorization_code&client_id=ba65171a721befb7fc2b3ceece703a6b38c1da83c14954039f81a7115bb2058e&redirect_uri=${encodeURI(
              window.location.origin,
            )}&code=${authorizationCode}&code_verifier`,
          ),
          params,
        );

        if (response && response.access_token && response.refresh_token) {
          await asyncLocalStorage.setItem(
            'access_token',
            response.access_token,
          );
          await asyncLocalStorage.setItem(
            'refresh_token',
            response.refresh_token,
          );
          window.location.search = '';
          return true;
        }
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  redirectToLogin = () => {
    window.location.href = `https://app.pagerduty.com/oauth/authorize?client_id=ba65171a721befb7fc2b3ceece703a6b38c1da83c14954039f81a7115bb2058e&redirect_uri=${encodeURI(
      window.location.origin,
    )}&response_type=code&code_challenge_method=S256&code_challenge`;
  };

  componentDidMount = async () => {
    const isTokenValid = await this.checkToken();
    if (isTokenValid) {
      const filters = JSON.parse(await asyncLocalStorage.getItem('filters'));
      const hoursMarked = JSON.parse(
        await asyncLocalStorage.getItem('hoursMarked'),
      );
      const cardContent = JSON.parse(
        await asyncLocalStorage.getItem('cardContent'),
      );
      const savedSortings = JSON.parse(await asyncLocalStorage.getItem('sorting')) || {};

      this.setState({
        filters: filters || this.state.filters,
        hoursMarked: hoursMarked || this.state.hoursMarked,
        cardContent: cardContent || this.state.cardContent,
        sorting: savedSortings || this.state.sorting,
      });

      try {
        await setCurrentUser()(this.state.dispatch);
        await getTeams()(this.state.dispatch);
        setDefaultTeams(this.state.currentUser)(this.state.dispatch);
      } catch (err) {
        return this.redirectToLogin();
      }
      const {
        sorting, selectedTeam, startDate, endDate,
      } = this.state;
      await fetchIncidents({
        sorting,
        selectedTeam,
        startDate,
        endDate,
      })(this.state.dispatch);
      return this.setState({
        loading: false,
      });
    }
    return this.redirectToLogin();
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

Provider.propTypes = {
  children: Component,
};
