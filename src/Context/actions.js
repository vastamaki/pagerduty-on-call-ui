import fetch from '../Components/Fetch';
import mapIncidentToDay, { asyncLocalStorage } from '../helpers';

export const setCurrentUser = () => async (dispatch) => {
  const params = {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  };

  try {
    const response = await fetch(
      encodeURI('https://api.pagerduty.com/users/me'),
      params,
    );
    dispatch({
      type: 'SET_CURRENT_USER',
      payload: response.user,
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getTeams = () => async (dispatch) => {
  const params = {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  };

  try {
    const response = await fetch(
      encodeURI('https://api.pagerduty.com/teams'),
      params,
    );

    dispatch({
      type: 'GET_TEAMS',
      payload: response.teams,
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const setFilters = (filters) => async (dispatch) => {
  dispatch({
    type: 'SET_FILTERS',
    payload: filters,
  });
};

export const changeSorting = (sorting) => async (dispatch) => {
  dispatch({
    type: 'CHANGE_SORTING',
    payload: sorting,
  });
};

export const clearIncidents = () => (dispatch) => {
  dispatch({
    type: 'CLEAR_INCIDENTS',
  });
};

export const markHour = (incident) => (dispatch) => {
  dispatch({
    type: 'SET_HOUR_MARK',
    payload: incident,
  });
};

export const updateCardContent = (cardContent) => (dispatch) => {
  dispatch({
    type: 'UPDATE_CARD_CONTENT',
    payload: cardContent,
  });
};

export const hideNotification = () => (dispatch) => {
  dispatch({
    type: 'HIDE_NOTIFICATION',
  });
};
export const toggleNotification = (notification) => (dispatch) => {
  dispatch({
    type: 'HIDE_NOTIFICATION',
  });
  dispatch({
    type: 'TOGGLE_NOTIFICATION',
    payload: {
      hidden: notification.hidden,
      message: notification.message,
      success: notification.success,
      timeout: setTimeout(() => {
        dispatch({
          type: 'HIDE_NOTIFICATION',
        });
      }, notification.timeout),
    },
  });
};

export const setDefaultTeams = (currentUser) => (dispatch) => {
  const teamIDs = currentUser.teams.map((team) => team.id);
  dispatch({
    type: 'SET_DEFAULT_TEAMS',
    payload: teamIDs,
  });
};

export const setSelectedTeam = (teamID, teamName) => (dispatch) => {
  dispatch({
    type: 'SET_SELECTED_TEAM',
    payload: {
      teamID,
      teamName,
    },
  });
};

export const selectIncident = (incident) => (dispatch) => {
  dispatch({
    type: 'SELECT_INCIDENT',
    payload: incident.incidentNumber,
  });
};

export const setDateRange = (date, option) => (dispatch) => {
  dispatch({
    type: 'SET_DATE_RANGE',
    payload: {
      date,
      option,
    },
  });
};

export const clearSelectedIncident = () => (dispatch) => {
  dispatch({
    type: 'CLEAR_SELECTED_INCIDENTS',
  });
};

export const fetchIncidents = (options) => async (dispatch) => {
  const {
    selectedTeam, startDate, endDate, sorting,
  } = options;
  clearIncidents()(dispatch);
  const params = {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Bearer ${await asyncLocalStorage.getItem(
        'access_token',
      )}`,
    },
  };

  const teams = selectedTeam.map((team) => `&team_ids[]=${team}`).join('');

  let incidents = [];
  let offset = 0;
  let response;
  do {
    /* eslint-disable no-await-in-loop */
    response = await fetch(
      encodeURI(
        `https://api.pagerduty.com/incidents?since=${startDate}&until=${endDate}&time_zone=UTC&total=true&limit=100&offset=${offset}&${teams}`,
      ),
      params,
    );

    if (!response.incidents[0] || response.error) {
      toggleNotification({
        hidden: false,
        success: false,
        message: 'No incidents found!',
        timeout: 3000,
      })(dispatch);
      return clearIncidents()(dispatch);
    }
    offset += 100;
    incidents = incidents.concat(response.incidents);
  } while (response.more);

  const sortedIncidents = await mapIncidentToDay(incidents, sorting);
  return dispatch({
    type: 'GET_INCIDENTS',
    payload: sortedIncidents,
  });
};
