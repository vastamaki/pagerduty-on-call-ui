import React, { useState, useContext, useEffect } from 'react';
import format from 'date-fns/format';
import { Context } from '../../Context';
import ContextMenu from '../ContextMenu';
import hourMark from '../../Icons/hour-mark.svg';
import { incidentStatusToColor } from '../../helpers';
import './index.scss';

const Incidents = () => {
  const [context, dispatch] = useContext(Context);
  const {
    filters,
    currentUser,
    cardContent,
    selectedIncidents,
    incidents,
    hoursMarked,
  } = context;

  const [state, setState] = useState({
    collapsedTables: [''],
    showContextMenu: false,
    cursorPosition: {
      x: 0,
      y: 0,
    },
  });

  const onContextMenu = (e, incident) => {
    e.preventDefault();
    setState({
      showContextMenu: !state.showContextMenu,
      selectedIncident: incident,
      cursorPosition: {
        x: e.pageX,
        y: e.pageY,
      },
    });
  };

  const onClick = (e, incident) => {
    if (e.ctrlKey) {
      dispatch({
        type: 'SELECT_INCIDENT',
        payload: incident.incidentNumber,
      });
    }
  };

  const keyDown = (e) => {
    if (e.keyCode === 27) {
      dispatch({
        type: 'CLEAR_SELECTED_INCIDENTS',
      });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', keyDown);
  });

  // eslint-disable-next-line
  useEffect(() => () => document.removeEventListener('keydown', keyDown), []);

  const toggleDay = (index) => {
    const collapsedTables = [...state.collapsedTables];
    collapsedTables[index] = !collapsedTables[index];
    setState({
      collapsedTables,
    });
  };

  const closeContextMenu = () => {
    setState({
      showContextMenu: false,
      selectedIncident: {},
      cursorPosition: {},
    });
  };

  const isFilteredOut = (incident) => {
    const { lastStatusChangeBy, service } = incident;
    if (filters.exclude) {
      const excluded = filters.exclude
        .split(',')
        .some((filter) => service.summary.includes(filter));
      if (excluded) return true;
    }
    return (
      filters.showOnlyOwnIncidents
      && lastStatusChangeBy.summary !== currentUser.name
    );
  };

  const renderCardHeader = (incident) => {
    const { incidentNumber, status, service } = incident;

    return (
      <div className="summary">
        {!selectedIncidents.includes(incidentNumber) ? (
          <div
            style={{
              backgroundColor: incidentStatusToColor(status),
            }}
            className="status"
            title="Incident status"
          />
        ) : (
          <img alt="Incident selected" className="status" src={hourMark} />
        )}
        <h3 title={service.summary}>{service.summary}</h3>
      </div>
    );
  };

  const renderCardContent = (incident) => {
    const {
      summary,
      htmlUrl,
      createdAt,
      lastStatusChangeAt,
      lastStatusChangeBy,
    } = incident;

    const getLastStatusChangeBy = (statusChangedBy) => {
      if (statusChangedBy === incident.service.summary) {
        return 'Service';
      }
      return statusChangedBy;
    };

    return (
      <div className="content">
        {cardContent.summary && (
          <h4
            className="summary"
            title={summary}
            onClick={(e) => !e.ctrlKey && window.open(htmlUrl, '_blank')}
          >
            {summary.length > 50
              ? `${summary.substr(0, 70).trim()}...`
              : summary}
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
          <h4>
            Last status change by:{' '}
            {getLastStatusChangeBy(lastStatusChangeBy.summary)}
          </h4>
        )}
      </div>
    );
  };

  return (
    <React.Fragment>
      {state.showContextMenu && (
        <ContextMenu
          incident={state.selectedIncident}
          cursorPosition={state.cursorPosition}
          closeContextMenu={closeContextMenu}
        />
      )}
      <div className="columns">
        {Object.keys(incidents).map((day, index) => {
          const { collapsedTables } = state;

          const totalIncidentsOfDay = incidents[day].length;
          const isTableCollapsed = collapsedTables && collapsedTables[index];

          return (
            <div className="day" key={index}>
              <h1 className="day-header" onClick={() => toggleDay(index)}>
                {day} ({totalIncidentsOfDay})
                <hr />
              </h1>
              {!isTableCollapsed && (
                <ul id={day}>
                  {incidents[day].map(
                    (incident) => !isFilteredOut(incident) && (
                        <li
                          className={`incident-wrapper ${
                            hoursMarked[day] && hoursMarked[day].includes(incident.incidentNumber)
                              ? 'hour-mark'
                              : ''
                          }`}
                          key={incident.summary}
                          onContextMenu={(e) => onContextMenu(e, incident)}
                          onClick={(e) => onClick(e, incident)}
                        >
                      <div className="incident">

                          {renderCardHeader(incident)}
                          {renderCardContent(incident)}
                        </div>
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
};

export default Incidents;
