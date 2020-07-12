import React, { Component } from "react";
export const Context = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_TEAMS":
      return {
        ...state,
        teams: action.payload,
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: {
          [action.payload.name]: action.payload.value,
        },
      };
    case "SET_HOUR_MARK":
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
      localStorage.setItem("hoursMarked", JSON.stringify(hours.hoursMarked))
      return hours
    case "GET_INCIDENTS":
      return {
        ...state,
        incidents: action.payload.incidents,
        weekdays: action.payload.weekdays,
        showIncidents: true
      }
    case "CLEAR_INCIDENTS":
      return {
        ...state,
        incidents: [],
        weekdays: [],
        showIncidents: false
      }
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
      exclude: ""
    },
    showIncidents: false,
    dispatch: (action) => this.setState((state) => reducer(state, action)),
  };
  
  componentDidMount = () => {
    const filters = localStorage.getItem("filters");
    const hoursMarked = localStorage.getItem("hoursMarked");
    this.setState({
      filters: JSON.parse(filters) || this.state.filters,
      hoursMarked: JSON.parse(hoursMarked) || this.state.hoursMarked,
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
