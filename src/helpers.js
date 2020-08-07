import format from 'date-fns/format';

/* eslint-disable camelcase */
const mapIncidentToDay = (incidents, sortBy) => {
  const sortedIncidents = {};

  const weekdays = Array.from(
    new Set(
      incidents.map((incident) => format(
        new Date(
          sortBy === 'createdAt'
            ? incident.created_at
            : incident.last_status_change_at,
        ),
        'dd/MM/yyyy',
      )),
    ),
  ).sort();

  weekdays.forEach((day) => {
    sortedIncidents[day] = [];

    incidents
      .filter((incident) => {
        const date = format(new Date(
          sortBy === 'createdAt'
            ? incident.created_at
            : incident.last_status_change_at,
        ), 'dd/MM/yyyy');
        return date === day;
      })
      .forEach((incident) => {
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
        sortedIncidents[day].push({
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
        });
      });
  });
  return sortedIncidents;
};

export default mapIncidentToDay;
