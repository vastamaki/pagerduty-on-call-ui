/* eslint-disable camelcase */
export const mapIncidentToDay = (weekdays, incidents, sortBy) => weekdays.map((day) => incidents
  .filter((incident) => {
    const date = new Date(sortBy === 'createdAt' ? incident.created_at : incident.last_status_change_at).toISOString();
    return date.substr(0, 10) === day;
  })
  .map((incident) => {
    const {
      incident_number,
      acknowledgements,
      created_at,
      service,
      summary,
      html_url,
      last_status_change_at,
      last_status_change_by,
      alert_counts,
    } = incident;
    return {
      acknowledgements,
      alert_counts,
      incident_number,
      created_at,
      service,
      summary,
      html_url,
      last_status_change_at,
      last_status_change_by,
      day,
    };
  }).sort((a, b) => (sortBy === 'createdAt' ? a.created_at > b.created_at : a.last_status_change_at > b.last_status_change_at)));

export const getWeekDays = (incidents) => Array.from(
  new Set(
    incidents.map((incident) => new Date(incident.created_at).toISOString().substr(0, 10)),
  ),
);
