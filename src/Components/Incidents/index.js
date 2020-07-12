import React, { PureComponent } from "react";
import { markHour } from "../../Context/actions";
import { Context } from "../../Context";
import "./index.css";

class Incidents extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hoursMarked: {},
      collapsedTables: [],
    };
  }

  componentDidMount = () => {
    const hoursMarked = localStorage.getItem("hoursMarked");
    hoursMarked &&
      this.setState({
        hoursMarked: JSON.parse(hoursMarked),
      });
  };

  toggleDay = (index) => {
    const collapsedTables = [...this.state.collapsedTables];
    collapsedTables[index] = !collapsedTables[index];
    this.setState({
      collapsedTables,
    });
  };

  render() {
    const { dispatch, incidents, filters, weekdays } = this.context;
    return (
      <React.Fragment>
        <div className="columns">
          {incidents.map((day, index) => {
            return (
              <div key={index}>
                <h1 onClick={() => this.toggleDay(index)}>
                  {weekdays[index]} ({day.length})
                </h1>
                {!this.state.collapsedTables[index] && (
                  <ul id={index}>
                    {day.map((incident) => {
                      const filteredOut = filters.exclude
                        .split(",")
                        .some(
                          (filter) =>
                            filter && incident.service.summary.includes(filter)
                        );
                      if (filteredOut) return null;
                      return (
                        <li key={incident.incident_number}>
                          <h3
                            className="summary"
                            onClick={() => {
                              this.props.copyToClipboard(incident.summary);
                              markHour(incident)(dispatch);
                            }}
                          >
                            {incident.service.summary}{" "}
                            {this.context.hoursMarked[incident.day] &&
                            this.context.hoursMarked[incident.day].includes(
                              incident.incident_number
                            ) ? (
                              <p className="hour-mark" />
                            ) : (
                              <p className="no-hour-mark" />
                            )}
                          </h3>
                          <a title={incident.summary} href={incident.html_url}>
                            {incident.summary.substr(0, 50) + "..."}
                          </a>
                          <h4>Created: {incident.created_at}</h4>
                          <h4>
                            Latest change: {incident.last_status_change_at}
                          </h4>
                          <h4>
                            Last status change by:{" "}
                            {incident.last_status_change_by.summary}
                          </h4>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

Incidents.contextType = Context;
export default Incidents;
