import React, { PureComponent } from "react";
import "./index.css";

class Incidents extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hoursMarked: {},
    };
  }

  componentDidMount = () => {
    const hoursMarked = localStorage.getItem("hoursMarked");
    hoursMarked &&
      this.setState({
        hoursMarked: JSON.parse(hoursMarked),
      });
  };

  markHour = (incident) => {
    this.setState(
      {
        hoursMarked: {
          ...this.state.hoursMarked,
          [incident.day]: this.state.hoursMarked[incident.day]
            ? [
                ...this.state.hoursMarked[incident.day],
                incident.incident_number,
              ]
            : [incident.incident_number],
        },
      },
      () => {
        localStorage.setItem(
          "hoursMarked",
          JSON.stringify(this.state.hoursMarked)
        );
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="columns">
          {this.props.sorted_incidents.map((day, index) => {
            return (
              <div key={index}>
                <h1 onClick={() => this.props.toggleDay(index)}>
                  {this.props.weekdays[index]} ({day.length})
                </h1>
                {!this.props.collapsedTables[index] && (
                  <ul id={index}>
                    {day.map((incident) => {
                      return (
                        <li key={incident.incident_number}>
                          <h3
                            className="summary"
                            onClick={() => {
                              this.props.copyToClipboard(incident.summary);
                              this.markHour(incident);
                            }}
                          >
                            {incident.service.summary}{" "}
                            {this.state.hoursMarked[incident.day] &&
                            this.state.hoursMarked[incident.day].includes(
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

export default Incidents;
