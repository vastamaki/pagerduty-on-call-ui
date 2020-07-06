import React, { PureComponent } from "react";
import "./index.css";

class Incidents extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

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
                  <ul id={index} key={index}>
                    {day.map((incident) => {
                      return (
                        <li key={index}>
                          <h3
                            className="summary"
                            onClick={() =>
                              this.props.copyToClipboard(incident.summary)
                            }
                          >
                            {incident.service.summary}
                          </h3>
                          <a alt={incident.summary} href={incident.html_url}>
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
