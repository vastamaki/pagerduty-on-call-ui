import React, { PureComponent } from 'react';
import format from 'date-fns/format';
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

  incidentStatusToColor = (status) => {
    if (status === 'acknowledged') {
      return '#f59331';
    }

    if (status === 'triggered') {
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
      if (excluded) return true;
    }
    return (
      filters.showOnlyOwnIncidents
      && incident.last_status_change_by.summary !== this.context.currentUser.name
    );
  };

  renderCardHeader = (incident) => {
    const isHoursMarked = this.context.hoursMarked[incident.day]
      && this.context.hoursMarked[incident.day].includes(incident.incident_number);
    return (
      <h3 className="summary">
        <p
          style={{
            backgroundColor: this.incidentStatusToColor(incident),
          }}
          className="incident-status"
          title="Incident status"
        />
        {incident.service.summary}
        {isHoursMarked ? (
          <p className="hour-mark" />
        ) : (
          <p className="no-hour-mark" />
        )}
      </h3>
    );
  };

  renderCardContent = (incident) => {
    const { cardContent } = this.context;
    return (
      <React.Fragment>
        {cardContent.summary && (
          <h4
            className="incident-summary"
            title={incident.summary}
            onClick={() => window.open(incident.html_url, '_blank')}
          >
            {incident.summary.length > 50
              ? `${incident.summary.substr(0, 50)}...`
              : incident.summary}
          </h4>
        )}
        {cardContent.createdAt && <h4>Created: {format(new Date(incident.created_at), 'dd/MM/yy HH:mm:ss')}</h4>}
        {cardContent.latestChange && (
          <h4>Latest change: {format(new Date(incident.last_status_change_at), 'dd/MM/yyyy HH:mm:ss')}</h4>
        )}
        {cardContent.changedBy && (
          <h4>
            Last status change by: {incident.last_status_change_by.summary}
          </h4>
        )}
      </React.Fragment>
    );
  };

  render() {
    const { incidents } = this.context;

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
          {Object.keys(incidents).map((day, index) => {
            const totalIncidentsOfDay = incidents[day].length;
            const isTableCollapsed = this.state.collapsedTables[index];

            return (
              <div className="day" key={index}>
                <h1 className="day-header" onClick={() => this.toggleDay(index)}>
                  {day} ({totalIncidentsOfDay})
                <hr />
                </h1>
                {!isTableCollapsed && (
                  <ul id={day}>
                    {incidents[day].map(
                      (incident) => !this.isFilteredOut(incident) && (
                          <li
                            className="incident"
                            key={incident.incident_number}
                            onContextMenu={(e) => this.onContextMenu(e, incident)
                            }
                          >
                            {this.renderCardHeader(incident)}
                            {this.renderCardContent(incident)}
                          </li>
                      ),
                    )}
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
