import * as localforage from 'localforage';
import fetch from '../Components/Fetch';
import { mapIncidentToDay } from '../helpers';

export const setCurrentUser = async () => {
  const params = {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Bearer ${await localforage.getItem('access_token')}`,
    },
  };

  try {
    const response = await fetch(
      encodeURI('https://api.pagerduty.com/users/me'),
      params,
    );
    return response.user;
  } catch (err) {
    throw new Error(err);
  }
};

export const getTeams = async () => {
  const params = {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Bearer ${await localforage.getItem('access_token')}`,
    },
  };

  try {
    const response = await fetch(
      encodeURI('https://api.pagerduty.com/teams'),
      params,
    );

    return response.teams;
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchIncidents = async (options) => {
  const {
    selectedTeam, startDate, endDate, sorting, dispatch,
  } = options;
  dispatch({
    type: 'CLEAR_INCIDENTS',
  });
  const params = {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Bearer ${await localforage.getItem('access_token')}`,
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
      dispatch({
        type: 'TOGGLE_NOTIFICATION',
        payload: {
          hidden: false,
          success: false,
          message: 'No incidents found!',
          timeout: 3000,
        },
      });
      dispatch({
        type: 'SET_LOADING',
        value: false,
      });
      return dispatch({
        type: 'CLEAR_INCIDENTS',
      });
    }
    offset += 100;
    incidents = incidents.concat(response.incidents);
  } while (response.more);

  const sortedIncidents = mapIncidentToDay(incidents, sorting);
  dispatch({
    type: 'GET_INCIDENTS',
    payload: sortedIncidents,
  });
  return dispatch({
    type: 'SET_LOADING',
    payload: false,
  });
};
