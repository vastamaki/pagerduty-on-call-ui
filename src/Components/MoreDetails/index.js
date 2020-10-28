import React, { useEffect, useState } from 'react';
import * as localforage from 'localforage';
import { format, formatDistance } from 'date-fns';
import * as PropTypes from 'prop-types';
import fetch from '../Fetch';
import Loader from '../Loader';
import { incidentStatusToColor } from '../../helpers';
import './index.scss';
import '../../index.scss';
import '../../GetView.scss';

const MoreDetails = ({ props: incidentId }) => {
  const [loading, setLoading] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState('alerts');
  const [state, setState] = useState({
    notes: [],
    alerts: [],
    incident: {},
    logEntries: [],
  });

  useEffect(() => {
    async function getIncident() {
      const params = {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.pagerduty+json;version=2',
          Authorization: `Bearer ${await localforage.getItem('access_token')}`,
        },
      };

      const { incident } = await fetch(
        encodeURI(`https://api.pagerduty.com/incidents/${incidentId}`),
        params,
      );

      const { alerts } = await fetch(
        encodeURI(`https://api.pagerduty.com/incidents/${incidentId}/alerts`),
        params,
      );

      let logEntries = [];
      let response;
      let offset = 0;
      do {
        /* eslint-disable no-await-in-loop */
        response = await fetch(
          encodeURI(
            `https://api.pagerduty.com/incidents/${incidentId}/log_entries?offset=${offset}`,
          ),
          params,
        );

        offset += 100;
        logEntries = logEntries.concat(response.log_entries);
      } while (response.more);

      const { notes } = await fetch(
        encodeURI(`https://api.pagerduty.com/incidents/${incidentId}/notes`),
        params,
      );

      setState({
        alerts,
        notes,
        incident,
        logEntries,
      });

      return setLoading(false);
    }
    getIncident();
  }, [incidentId]);

  if (loading) return <Loader />;

  const generateNotes = () => {
    const generatedNotes = state.notes.map((note) => (
      <li key={note.created_at}>
        <h4 className="user">{note.user.summary}</h4>
        <hr />
        <p>{note.content}</p>
        <h4 className="timestamp">
          {format(new Date(note.created_at), 'dd/MM @ hh:mm')}
        </h4>
      </li>
    ));

    return generatedNotes;
  };

  const calculateDuration = () => {
    if (state.incident.status !== 'resolved') {
      return formatDistance(new Date(), new Date(state.incident.created_at));
    }
    return formatDistance(
      new Date(state.incident.last_status_change_at),
      new Date(state.incident.created_at),
    );
  };

  const generateAlertBody = (alert) => {
    if (alert.body?.cef_details.client === 'AWS Console') {
      const { details } = alert.body;
      const { Region, AWSAccountId } = details;
      const {
        Threshold, Period, Namespace, MetricName,
      } = details.Trigger;
      const { client_url: clientURL } = alert.body.cef_details;
      return (
        <div>
          <div>
          <h4>{alert.summary}</h4>
          <button
            className="submit"
            onClick={() => window.open(clientURL, '_blank')}
            >
            Open in AWS
          </button>
            </div>
          <table>
            <tr>
              <th>Region</th>
              <th>{Region}</th>
            </tr>
            <tr>
              <th>AWS Account</th>
              <th>{AWSAccountId}</th>
            </tr>
            <tr>
              <th>Threshold</th>
              <th>{Threshold}</th>
            </tr>
            <tr>
              <th>Period</th>
              <th>{Period}</th>
            </tr>
            <tr>
              <th>Namespace</th>
              <th>{Namespace}</th>
            </tr>
            <tr>
              <th>Metricname</th>
              <th>{MetricName}</th>
            </tr>
          </table>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (activeSubmenu === 'timeline') {
      return (
        <div>
          <table>
            {state.logEntries
              .sort((a, b) => a.created_at > b.created_at)
              .map((entry) => (
                <tr key={entry.created_at}>
                  <th>
                    {format(new Date(entry.created_at), 'dd/MM/yy HH:mm:ss')}
                  </th>
                  <th>{entry.summary}</th>
                </tr>
              ))}
          </table>
        </div>
      );
    }
    if (activeSubmenu === 'alerts') {
      return (
        <>
          {state.alerts
            .sort((a, b) => a.created_at > b.created_at)
            .map((alert) => generateAlertBody(alert))}
        </>
      );
    }
    return null;
  };

  return (
    <div className="incident">
      <div className="header">
        <div className="title">
          <h2>{`Incident ${state.incident.incident_number}`}</h2>
          <hr />
          <h3>
            <a href={state.incident.html_url}>{state.incident.title}</a>
          </h3>
        </div>
        <div className="status">
          <h2>Status</h2>
          <h3
            style={{
              color: incidentStatusToColor(state.incident.status),
            }}
          >
            {state.incident.status}
          </h3>
        </div>
        <div className="duration">
          <h2>Duration</h2>
          <h3>{calculateDuration()}</h3>
        </div>
      </div>
      <div className="content">
        <div className="details">
          <div className="header">
            <p
              className={`menu-item ${activeSubmenu === 'alerts' && 'active'}`}
              onClick={() => setActiveSubmenu('alerts')}
            >
              Alerts
            </p>
            <p
              className={`menu-item ${
                activeSubmenu === 'timeline' && 'active'
              }`}
              onClick={() => setActiveSubmenu('timeline')}
            >
              Timeline
            </p>
          </div>
          <div className="content">{renderContent()}</div>
        </div>
        <div className="notes-and-responders">
          {state.incident.acknowledgements[0] && (
            <div className="responders">
              <h2>Responders</h2>
              <hr />
              {state.incident.acknowledgements.map((i) => (
                <div key={i.created_at} className="user">
                  <div className="profile-picture">
                    {i.acknowledger.summary.substr(0, 1)}
                  </div>
                  <div className="user-details">
                    <h4>{i.acknowledger.summary}</h4>
                    <h5>
                      Ack&apos;d at {format(new Date(i.at), 'HH:mm')} (
                      {formatDistance(new Date(), new Date(i.at))} ago)
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="notes">
            <h2>Notes</h2>
            <hr />
            <ul>
              {state.notes.length > 0 ? (
                generateNotes()
              ) : (
                <li>
                  <p>Nothing to see here.. :(</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreDetails;

MoreDetails.propTypes = {
  props: PropTypes.shape({
    incidentId: PropTypes.string,
  }),
};
