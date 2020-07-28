import React, { Component } from 'react';
import { setCurrentUser, setDefaultTeams } from './actions';

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
        incidents: [...state.incidents, ...action.payload.incidents],
        weekdays: [...state.weekdays, ...action.payload.weekdays],
        showIncidents: true,
      };
    case 'CLEAR_INCIDENTS':
      return {
        ...state,
        incidents: [],
        weekdays: [],
        showIncidents: false,
      };
    case 'TOGGLE_NOTIFICATION':
      return {
        ...state,
        notification: {
          hidden: action.payload.hidden,
          message: action.payload.message,
          success: action.payload.success,
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
        sortBy: action.payload,
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
    incidents: [],
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
    weekdays: [],
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
    sortBy: 'createdAt',
    currentUser: {},
    selectedTeamName: 'All current user teams',
    dispatch: (action) => this.setState((state) => reducer(state, action)),
  };

  componentDidMount = async () => {
    const filters = JSON.parse(localStorage.getItem('filters'));
    const hoursMarked = JSON.parse(localStorage.getItem('hoursMarked'));
    const cardContent = JSON.parse(localStorage.getItem('cardContent'));
    const sortBy = JSON.parse(localStorage.getItem('sortBy')) || {};
    await setCurrentUser()(this.state.dispatch);
    await setDefaultTeams(this.state.currentUser)(this.state.dispatch);
    this.setState({
      filters: filters || this.state.filters,
      hoursMarked: hoursMarked || this.state.hoursMarked,
      cardContent: cardContent || this.state.cardContent,
      sortBy: sortBy.createdAt ? 'createdAt' : 'updatedAt',
    });
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
