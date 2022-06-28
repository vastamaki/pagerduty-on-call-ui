import React, { useReducer, useEffect, Component } from "react";
import { startOfWeek, endOfWeek } from "date-fns";
import * as localforage from "localforage";
import { getTeams, setCurrentUser, fetchIncidents } from "./actions";
import fetch from "../Components/Fetch";
import reducer from "./reducers";

export const Context = React.createContext({});

export const Provider = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    cardContent: {
      summary: true,
      createdAt: true,
      latestChange: true,
      changedBy: true,
    },
    currentUser: {},
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    filters: {
      exclude: "",
      showOnlyOwnIncidents: false,
    },
    hoursMarked: {},
    incidents: {},
    loading: true,
    moreDetailsAbout: "",
    notification: {
      hidden: true,
      message: "",
      success: true,
    },
    selectedIncidents: [],
    sorting: {
      names: {
        by: "serviceName",
        direction: "asc",
        active: false,
      },
      times: {
        by: "createdAt",
        direction: "asc",
      },
    },
    teams: [],
    selectedTeamName: "All current user teams",
    selectedTeam: [],
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
  });

  const checkToken = async () => {
    const token = localforage.getItem("access_token");
    const { search } = window.location;
    const queryParams = new URLSearchParams(search);
    const authorizationCode = queryParams.get("code");

    if (!token && !authorizationCode) {
      return false;
    }

    console.log(authorizationCode);

    if (authorizationCode) {
      try {
        const response = await fetch(
          encodeURI(
            `https://identity.pagerduty.com/oauth/token?grant_type=authorization_code&client_id=25a442d7-e8cb-40ce-9b85-b7254084353e&client_secret=XBsVVyzYigX2-3rrJgBnnHpttOMUQqNblC0tXhqVP0A&redirect_uri=${encodeURI(
              window.location.origin
            )}&code=${authorizationCode}&code_verifier`
          ),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-form-urlencoded",
            },
          }
        );

        if (response && response.access_token && response.refresh_token) {
          localforage.setItem("access_token", response.access_token);
          localforage.setItem("refresh_token", response.refresh_token);
          window.location.search = "";
          return true;
        }
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const redirectToLogin = () => {
    window.location.href = `https://identity.pagerduty.com/oauth/authorize?client_id=25a442d7-e8cb-40ce-9b85-b7254084353e&client_secret=XBsVVyzYigX2-3rrJgBnnHpttOMUQqNblC0tXhqVP0A&redirect_uri=${encodeURI(
      window.location.origin
    )}&response_type=code&code_challenge_method=S256&code_challenge`;
  };
  const { startDate, endDate } = state;
  useEffect(() => {
    (async () => {
      const isTokenValid = await checkToken();
      if (isTokenValid) {
        try {
          const currentUser = await setCurrentUser();
          dispatch({
            type: "SET_CURRENT_USER",
            payload: currentUser,
          });

          const teams = await getTeams();
          dispatch({
            type: "SET_TEAMS",
            payload: teams,
          });
          const teamIDs = currentUser.teams.map((team) => team.id);
          dispatch({
            type: "SET_DEFAULT_TEAMS",
            payload: teamIDs,
          });
          const cardContent =
            (await localforage.getItem("cardContent")) || state.cardContent;
          const filters =
            (await localforage.getItem("filters")) || state.filters;
          const sorting =
            (await localforage.getItem("sorting")) || state.sorting;
          const hoursMarked =
            (await localforage.getItem("hoursMarked")) || state.hoursMarked;
          dispatch({
            type: "LOAD_SETTINGS",
            payload: {
              cardContent,
              filters,
              sorting,
              hoursMarked,
            },
          });
          await fetchIncidents({
            sorting,
            selectedTeam: teamIDs,
            startDate,
            endDate,
            dispatch,
          });
          return dispatch({
            type: "SET_LOADING",
            payload: false,
          });
        } catch (err) {
          return redirectToLogin();
        }
      }
      return redirectToLogin();
    })();
  }, []);

  return (
    <Context.Provider value={[state, dispatch]}>
      {props.children}
    </Context.Provider>
  );
};

Provider.propTypes = {
  children: Component,
};
