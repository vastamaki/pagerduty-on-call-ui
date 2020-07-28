import fetch from '../Components/Fetch';

export const setCurrentUser = () => async (dispatch) => {
  const params = {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  };

  const response = await fetch(
    encodeURI('https://api.pagerduty.com/users/me'),
    params,
  );

  if (response) {
    dispatch({
      type: 'SET_CURRENT_USER',
      payload: response.user,
    });
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

  let response;

  try {
    response = await fetch(
      encodeURI('https://api.pagerduty.com/teams'),
      params,
    );
  } catch (err) {
    throw new Error(err);
  }

  if (response) {
    dispatch({
      type: 'GET_TEAMS',
      payload: response.teams,
    });
  }
};

export const setFilters = (name, value) => async (dispatch) => {
  dispatch({
    type: 'SET_FILTERS',
    payload: {
      name,
      value,
    },
  });
};

export const changeSorting = (sortBy) => async (dispatch) => {
  localStorage.setItem(
    'sortBy',
    JSON.stringify({
      [sortBy]: true,
    }),
  );
  dispatch({
    type: 'CHANGE_SORTING',
    payload: sortBy,
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

export const changeModalState = (modal) => (dispatch) => {
  dispatch({
    type: 'TOGGLE_MODAL',
    payload: modal,
  });
};

export const updateCardContent = (cardContent) => (dispatch) => {
  dispatch({
    type: 'UPDATE_CARD_CONTENT',
    payload: cardContent,
  });
};

export const getIncidents = (incidents, weekdays) => (dispatch) => {
  dispatch({
    type: 'GET_INCIDENTS',
    payload: { incidents, weekdays },
  });
};

export const toggleNotification = (notification) => (dispatch) => {
  dispatch({
    type: 'TOGGLE_NOTIFICATION',
    payload: {
      hidden: notification.hidden,
      message: notification.message,
      success: notification.success,
    },
  });
};

export const setDefaultTeams = (currentUser) => (dispatch) => {
  const teamIDs = currentUser.teams.map((team) => team.id);
  dispatch({
    type: 'SET_DEFAULT_TEAMS',
    payload: teamIDs.join(','),
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
