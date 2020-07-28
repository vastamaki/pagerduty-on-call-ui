import React, { PureComponent } from 'react';
import { Context } from '../../Context';
import ContextMenu from '../ContextMenu';
import './index.css';

class Incidents extends PureComponent {
  state = {
    collapsedTables: [],
    showContextMenu: false,
    cursorPosition: {
      x: 0,
      y: 0,
    },
  };

  onContextMenu = (e, incident) => {
    e.preventDefault();
    this.setState({
      showContextMenu: !this.state.showContextMenu,
      selectedIncident: incident,
      cursorPosition: {
        x: e.pageX,
        y: e.pageY,
      },
    });
  };

  toggleDay = (index) => {
    const collapsedTables = [...this.state.collapsedTables];
    collapsedTables[index] = !collapsedTables[index];
    this.setState({
      collapsedTables,
    });
  };

  incidentStatusToColor = (incident) => {
    if (incident.alert_counts.triggered > 0 && incident.acknowledgements[0]) {
      return '#f59331';
    }

    if (incident.alert_counts.triggered > 0 && !incident.acknowledgements[0]) {
      return '#ff0000';
    }

    return '#00a600';
  };

  closeContextMenu = () => {
    this.setState({
      showContextMenu: false,
      selectedIncident: {},
      cursorPosition: {},
    });
  };

  isFilteredOut = (incident) => {
    const { filters } = this.context;
    if (filters.exclude) {
      const excluded = filters.exclude
        .split(',')
        .some((filter) => incident.service.summary.includes(filter));
      if (excluded) return false;
    }
    if (
      filters.showOnlyOwnIncidents
      && incident.last_status_change_by.summary !== this.context.currentUser.name
    ) return false;
    return true;
  };

  render() {
    const { incidents, weekdays, cardContent } = this.context;
    return (
      <React.Fragment>
        {this.state.showContextMenu && (
          <ContextMenu
            incident={this.state.selectedIncident}
            cursorPosition={this.state.cursorPosition}
            closeContextMenu={this.closeContextMenu}
          />
        )}
        <div className="columns">
          {incidents.map((day, index) => (
            <div className="day" key={index}>
              <h1 onClick={() => this.toggleDay(index)}>
                {weekdays[index]} ({day.length})
              </h1>
              {!this.state.collapsedTables[index] && (
                <ul id={index}>
                  {day.map(
                    (incident) => this.isFilteredOut(incident) && (
                        <li
                          className="incident"
                          key={incident.incident_number}
                          onContextMenu={(e) => this.onContextMenu(e, incident)}
                        >
                          <h3 className="summary">
                            <p
                              style={{
                                backgroundColor: this.incidentStatusToColor(
                                  incident,
                                ),
                              }}
                              className="incident-status"
                            ></p>
                            {incident.service.summary}{' '}
                            {this.context.hoursMarked[incident.day]
                            && this.context.hoursMarked[incident.day].includes(
                              incident.incident_number,
                            ) ? (
                              <p className="hour-mark" />
                              ) : (
                              <p className="no-hour-mark" />
                              )}
                          </h3>
                          {cardContent.summary && (
                            <h4
                              className="incident-summary"
                              title={incident.summary}
                              onClick={() => window.open(incident.html_url, '_blank')
                              }
                            >
                              {incident.summary.length > 50
                                ? `${incident.summary.substr(0, 50)}...`
                                : incident.summary}
                            </h4>
                          )}
                          {cardContent.createdAt && (
                            <h4>Created: {incident.created_at}</h4>
                          )}
                          {cardContent.latestChange && (
                            <h4>
                              Latest change: {incident.last_status_change_at}
                            </h4>
                          )}
                          {cardContent.changedBy && (
                            <h4>
                              Last status change by:{' '}
                              {incident.last_status_change_by.summary}
                            </h4>
                          )}
                        </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

Incidents.contextType = Context;
export default Incidents;
