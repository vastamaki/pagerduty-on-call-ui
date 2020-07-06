import React, { PureComponent } from "react";
import Notification from "./Notification";
import TimeSelect from "./Components/TimeSelect";
import Incidents from "./Components/Incidents";
import Header from "./Components/Header";
import { getWeekDays, mapIncidentToDay } from "./helpers";
import "react-datepicker/dist/react-datepicker.css";
import "./GetView.css";

export default class GetView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      incidents: [],
      teamID: "",
      showIncidents: false,
      loading: false,
      collapsedTables: [],
      weekdays: [],
      notification: {
        hidden: true,
        message: "",
        success: true,
      },
    };
  }

  getIncidents = async (startDate, endDate) => {
    const teamID = localStorage.getItem("teamID");
    if (!teamID) {
      return;
    }
    this.setState({
      loading: true,
    });
    const params = {
      method: "GET",
      headers: {
        Accept: "application/vnd.pagerduty+json;version=2",
        Authorization: "Token token=" + localStorage.getItem("token"),
      },
    };

    try {
      var response = await fetch(
        encodeURI(
          `https://api.pagerduty.com/incidents?since=${startDate}&until=${endDate}&team_ids[]=${this.state.teamID}&time_zone=UTC&total=true&limit=250`
        ),
        params
      );
    } catch (err) {
      this.setState({
        loading: false,
        notification: {
          success: false,
          message: "Failed to fetch data!",
          hidden: false,
        },
      });
      return;
    }

    const incidents = await response.json();

    if (!incidents.incidents || incidents.error) {
      this.setState({
        loading: false,
        notification: {
          success: false,
          message: incidents.error.errors[0],
          hidden: false,
        },
      });
      return;
    }

    this.setState({
      incidents: incidents.incidents,
    });
    const weekdays = getWeekDays(incidents.incidents);
    const sorted_incidents = mapIncidentToDay(
      weekdays,
      this.state.incidents
    );
    this.setState({
      weekdays,
      sorted_incidents,
      showIncidents: true,
      loading: false,
    });
  };

  componentDidMount = () => {
    const teamID = localStorage.getItem("teamID");
    if (teamID) {
      this.setState({
        teamID,
      });
    }
  };

  copyToClipboard = (summary) => {
    navigator.clipboard.writeText(summary);
    this.setState({
      notification: {
        hidden: false,
        success: true,
        message: "Summary copied to clipboard!",
      },
    });
    setTimeout(() => {
      this.setState({
        notification: {
          hidden: true,
        },
      });
    }, 5000);
  };

  toggleDay = (index) => {
    const collapsedTables = [...this.state.collapsedTables];
    collapsedTables[index] = !collapsedTables[index];
    this.setState({
      collapsedTables,
    });
  };

  clearIncidents = () => {
    this.setState({
      incidents: [],
      sorted_incidents: [],
      showIncidents: false,
    });
  };

  closeNotification = () => {
    this.setState({
      notification: { hidden: true },
    });
  };

  render() {
    return (
      <React.Fragment>
        <Header clearIncidents={this.clearIncidents} />
        <div className="App">
          <div className="App-header">
            <Notification
              closeNotification={this.closeNotification}
              success={this.state.notification.success}
              hidden={this.state.notification.hidden}
              message={this.state.notification.message}
            />
            {this.state.loading ? (
              <div className="loading-spinner" />
            ) : this.state.showIncidents ? (
              <Incidents
                collapsedTables={this.state.collapsedTables}
                weekdays={this.state.weekdays}
                sorted_incidents={this.state.sorted_incidents}
                toggleDay={this.toggleDay}
                copyToClipboard={this.copyToClipboard}
              />
            ) : (
              <TimeSelect getIncidents={this.getIncidents} />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
