/* eslint-disable */

import React, { useContext, useEffect, useState } from "react";
import * as localforage from "localforage";
import fetch from "../Fetch";
import Loader from "../Loader";
import { format, formatDistance } from "date-fns";
import { incidentStatusToColor } from "../../helpers";
import "./index.scss";
import "../../index.scss";
import "../../GetView.scss";

const MoreDetails = ({ props: incidentId }) => {
  console.log(incidentId);
  const [loading, setLoading] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState("alerts");
  const [state, setState] = useState();

  useEffect(() => {
    async function getIncident() {
      const params = {
        method: "GET",
        headers: {
          Accept: "application/vnd.pagerduty+json;version=2",
          Authorization: `Bearer ${await localforage.getItem("access_token")}`,
        },
      };

      const { incident } = await fetch(
        encodeURI(`https://api.pagerduty.com/incidents/${incidentId}`),
        params
      );

      const { alerts } = await fetch(
        encodeURI(`https://api.pagerduty.com/incidents/${incidentId}/alerts`),
        params
      );

      const { log_entries } = await fetch(
        encodeURI(
          `https://api.pagerduty.com/incidents/${incidentId}/log_entries`
        ),
        params
      );

      const { notes } = await fetch(
        encodeURI(`https://api.pagerduty.com/incidents/${incidentId}/notes`),
        params
      );

      setState({
        alerts,
        notes,
        log_entries,
        incident,
      });

      return setLoading(false);
    }
    getIncident();
  }, []);

  if (loading) return <Loader />;

  const {
    incident_number: incidentNumber,
    title,
    description,
    created_at: createdAt,
    status,
    service,
    last_status_change_at: lastStatusChangeAt,
    last_status_change_by: lastStatusChangeBy,
  } = state.alerts;

  const generateNotes = () => {
    const generatedNotes = notes.map((note) => {
      return (
        <li>
          <h4>
            {note.user.summary} @{" "}
            {format(new Date(note.created_at), "dd/MM hh:mm:ss")}
          </h4>
          <p>{note.content}</p>
          <br />
        </li>
      );
    });

    return generatedNotes;
  };

  const calculateDuration = () => {
    if (state.incident.status !== "resolved") {
      return formatDistance(new Date(), new Date(state.incident.createdAt));
    }
    return formatDistance(
      new Date(state.incident.last_status_change_at),
      new Date(state.incident.created_at)
    );
  };

  const renderContent = () => {
    if (activeSubmenu === "timeline") {
      return (
        <table>
          {state.log_entries.sort((a, b) => a.created_at > b.created_at).map((entry) => {
            return (
              <tr>
                <th>
                  {format(new Date(entry.created_at), "dd/MM/yy HH:mm:ss")}
                </th>
                <th>{entry.summary}</th>
              </tr>
            );
          })}
        </table>
      );
    } else if (activeSubmenu === "alerts") {
      return null;
    } else {
      return null;
    }
  };

  return (
    <div className="incident">
      <div className="header">
        <div className="title">
          <h2>{`Incident ${state.incident.incident_number}`}</h2>
          <hr />
          <h3>
            <a href={state.incident.html_url}>{state.incident.summary}</a>
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
            <ul>
              <li onClick={() => setActiveSubmenu("alerts")}>
                <p>Alerts</p>
                {activeSubmenu === "alerts" && <hr />}
              </li>
              <li onClick={() => setActiveSubmenu("timeline")}>
                <p>Timeline</p>
                {activeSubmenu === "timeline" && <hr />}
              </li>
            </ul>
          </div>
          <div className="content">{renderContent()}</div>
        </div>
        <div className="notes-and-responders">
          {state.incident.acknowledgements[0] && (
            <div className="responders">
              <h2>Responders</h2>
              <hr />
              {state.incident.acknowledgements.map((i) => {
                return (
                  <div className="user">
                    <div className="profile-picture">
                      {i.acknowledger.summary.substr(0, 1)}
                    </div>
                    <div className="user-details">
                      <h4>{i.acknowledger.summary}</h4>
                      <h5>
                        Ack'd at {format(new Date(i.at), "HH:mm")} (
                        {formatDistance(new Date(), new Date(i.at))} ago)
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="notes">
            <h2>Notes</h2>
            <hr />
            <ul>
              {state.notes.length > 1 ? (
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
