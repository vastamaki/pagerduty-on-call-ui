import React, { Component } from 'react';
import { setCurrentUser, setDefaultTeams } from './actions';
import { sortIncidents } from '../helpers';
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
              action.payload.incident_number,
            ]
            : [action.payload.incident_number],
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
    case 'TOGGLE_MODAL':
      return {
        ...state,
        openModals: {
          [action.payload.modal]: action.payload.state,
        },
      };
    case 'UPDATE_CARD_CONTENT':
      return {
        ...state,
        cardContent: action.payload,
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
        selectedTeam: action.payload.teamID,
        selectedTeamName: `${state.currentUser.name} | ${action.payload.teamName}`,
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
    notification: {
      hidden: true,
      message: '',
      success: true,
    },
    showIncidents: false,
    openModals: {
      settings: false,
      filters: false,
      teams: false,
      cards: false,
      sorting: false,
    },
    cardContent: {
      summary: true,
      createdAt: true,
      latestChange: true,
      changedBy: true,
    },
    sorting: {
      times: {
        createdAt: true,
        latestChange: false,
        direction: 'asc',
      },
      names: {
        serviceName: false,
        direction: 'asc',
      },
    },
    currentUser: {},
    selectedTeamName: 'All current user teams',
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
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
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
      const filters = JSON.parse(localStorage.getItem('filters'));
      const hoursMarked = JSON.parse(localStorage.getItem('hoursMarked'));
      const cardContent = JSON.parse(localStorage.getItem('cardContent'));
      const savedSortings = JSON.parse(localStorage.getItem('sorting')) || {};
      this.setState({
        filters: filters || this.state.filters,
        hoursMarked: hoursMarked || this.state.hoursMarked,
        cardContent: cardContent || this.state.cardContent,
        sorting: savedSortings.sorting || this.state.sorting,
      });

      try {
        await setCurrentUser()(this.state.dispatch);
        return setDefaultTeams(this.state.currentUser)(
          this.state.dispatch,
        );
      } catch (err) {
        return this.redirectToLogin();
      }
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
