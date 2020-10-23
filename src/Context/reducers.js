import * as localforage from 'localforage';
import { sortIncidents } from '../helpers';

export default (state, action) => {
  switch (action.type) {
    case 'SET_TEAMS':
      return {
        ...state,
        teams: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_FILTERS':
      localforage.setItem('filters', action.payload);
      return {
        ...state,
        filters: action.payload,
      };
    case 'SET_HOUR_MARK': {
      const hours = {
        ...state.hoursMarked,
        [action.payload.day]: state.hoursMarked[action.payload.day]
          ? [
            ...state.hoursMarked[action.payload.day],
            action.payload.incidentNumber,
          ]
          : [action.payload.incidentNumber],
      };
      localforage.setItem('hoursMarked', hours);
      return {
        ...state,
        hoursMarked: {
          ...state.hoursMarked,
          ...hours,
        },
      };
    }
    case 'GET_INCIDENTS':
      return {
        ...state,
        incidents: action.payload,
      };
    case 'CLEAR_INCIDENTS':
      return {
        ...state,
        incidents: [],
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
          timeout: 0,
        },
      };
    case 'UPDATE_CARD_CONTENT':
      localforage.setItem('cardContent', {
        ...state.cardContent,
        [action.payload.name]: action.payload.value,
      });
      return {
        ...state,
        cardContent: {
          ...state.cardContent,
          [action.payload.name]: action.payload.value,
        },
      };
    case 'LOAD_SETTINGS':
      return {
        ...state,
        ...(action.payload.cardContent && {
          cardContent: action.payload.cardContent,
        }),
        ...(action.payload.filters && { filters: action.payload.filters }),
        ...(action.payload.hoursMarked && {
          hoursMarked: action.payload.hoursMarked,
        }),
        ...(action.payload.sorting && { sorting: action.payload.sorting }),
      };
    case 'CHANGE_SORTING':
      localforage.setItem('sorting', {
        ...state.sorting,
        ...action.payload,
      });
      return {
        ...state,
        sorting: {
          ...state.sorting,
          ...action.payload,
        },
        incidents: sortIncidents(state.incidents, {
          ...state.sorting,
          ...action.payload,
        }),
      };
    case 'SET_DEFAULT_TEAMS':
      return {
        ...state,
        selectedTeam: action.payload,
        selectedTeamName: 'All current user teams',
      };
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload,
      };
    case 'SET_SELECTED_TEAM':
      return {
        ...state,
        selectedTeam: [action.payload.teamID],
        selectedTeamName: action.payload.teamName,
      };
    case 'SELECT_INCIDENT':
      if (state.selectedIncidents.includes(action.payload)) {
        const index = state.selectedIncidents.indexOf(action.payload);
        return {
          ...state,
          ...state.selectedIncidents.splice(index, 1),
        };
      }
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
