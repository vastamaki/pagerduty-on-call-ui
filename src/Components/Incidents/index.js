import React, { PureComponent } from 'react';
import format from 'date-fns/format';
import { Context } from '../../Context';
import { selectIncident, clearSelectedIncident } from '../../Context/actions';
import ContextMenu from '../ContextMenu';
import checkMark from '../../Icons/checkMark.svg';
import hourMark from '../../Icons/hour-mark.svg';
import noHourMark from '../../Icons/no-hour-mark.svg';
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

  onClick = (e, incident) => {
    if (e.ctrlKey) {
      const { dispatch } = this.context;
      selectIncident(incident)(dispatch);
    }
  };

  keyDown = (e) => {
    if (e.keyCode === 27) {
      const { dispatch } = this.context;
      clearSelectedIncident()(dispatch);
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.keyDown);
  }

  toggleDay = (index) => {
    const collapsedTables = [...this.state.collapsedTables];
    collapsedTables[index] = !collapsedTables[index];
    this.setState({
      collapsedTables,
    });
  };

  incidentStatusToColor = (status) => {
    switch (status) {
      case 'acknowledged':
        return '#ffb347';
      case 'triggered':
        return '#ff6961';
      default:
        return '#5fb15f';
    }
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
    const { lastStatusChangeBy, service } = incident;
    if (filters.exclude) {
      const excluded = filters.exclude
        .split(',')
        .some((filter) => service.summary.includes(filter));
      if (excluded) return true;
    }
    return (
      filters.showOnlyOwnIncidents
      && lastStatusChangeBy.summary !== this.context.currentUser.name
    );
  };

  hoursMarked = (incidentNumber, day) => {
    const isHoursMarked = this.context.hoursMarked[day]
      && this.context.hoursMarked[day].includes(incidentNumber);
    if (isHoursMarked) {
      return <img alt="Hours marked" src={hourMark} className="hour-mark" />;
    }
    return <img alt="Hours not marked" src={noHourMark} className="no-hour-mark" />;
  };

  renderCardHeader = (incident) => {
    const {
      day, incidentNumber, status, service,
    } = incident;

    return (
      <h3 className="summary">
        {!this.context.selectedIncidents.includes(incidentNumber) ? (
          <p
            style={{
              backgroundColor: this.incidentStatusToColor(
                status,
                incidentNumber,
              ),
            }}
            className="incident-status"
            title="Incident status"
          />
        ) : (
          <img alt="Incident selected" className="incident-status" src={checkMark} />
        )}
        {service.summary}
        {this.hoursMarked(incidentNumber, day)}
      </h3>
    );
  };

  renderCardContent = (incident) => {
    const {
      summary,
      htmlUrl,
      createdAt,
      lastStatusChangeAt,
      lastStatusChangeBy,
    } = incident;
    const { cardContent } = this.context;
    return (
      <React.Fragment>
        {cardContent.summary && (
          <h4
            className="incident-summary"
            title={summary}
            onClick={(e) => !e.ctrlKey && window.open(htmlUrl, '_blank')}
          >
            {summary.length > 50 ? `${summary.substr(0, 50)}...` : summary}
          </h4>
        )}
        {cardContent.createdAt && (
          <h4>Created: {format(new Date(createdAt), 'dd/MM/yy HH:mm:ss')}</h4>
        )}
        {cardContent.latestChange && (
          <h4>
            Latest change:{' '}
            {format(new Date(lastStatusChangeAt), 'dd/MM/yyyy HH:mm:ss')}
          </h4>
        )}
        {cardContent.changedBy && (
          <h4>Last status change by: {lastStatusChangeBy.summary}</h4>
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
                <h1
                  className="day-header"
                  onClick={() => this.toggleDay(index)}
                >
                  {day} ({totalIncidentsOfDay})
                  <hr />
                </h1>
                {!isTableCollapsed && (
                  <ul id={day}>
                    {incidents[day].map(
                      (incident) => !this.isFilteredOut(incident) && (
                          <li
                            className="incident"
                            key={incident.summary}
                            onContextMenu={(e) => this.onContextMenu(e, incident)
                            }
                            onClick={(e) => this.onClick(e, incident)}
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
