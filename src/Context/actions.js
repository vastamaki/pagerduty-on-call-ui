import fetch from '../Components/Fetch';

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

export const saveIncidents = (incidents) => (dispatch) => {
  dispatch({
    type: 'GET_INCIDENTS',
    payload: incidents,
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

export const changeModalState = (modal) => (dispatch) => {
  dispatch({
    type: 'TOGGLE_MODAL',
    payload: modal,
  });

  if (modal.state === false) {
    toggleNotification({
      hidden: false,
      success: true,
      message: 'Settings saved successfully!',
      timeout: 3000,
    })(dispatch);
  }
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
