import format from 'date-fns/format';

/* eslint-disable camelcase */
const mapIncidentToDay = (incidents, sorting) => {
  const sortedIncidents = {};

  const weekdays = Array.from(
    new Set(
      incidents.map((incident) => format(
        new Date(
          sorting.times.createdAt
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
      .sort((a, b) => {
        if (sorting.names.by === 'serviceName') {
          if (sorting.names.direction === 'asc') {
            if (a.service.summary < b.service.summary) return -1;
            if (a.service.summary > b.service.summary) return 1;
          } else {
            if (b.service.summary < a.service.summary) return -1;
            if (b.service.summary > a.service.summary) return 1;
          }
        }
        if (sorting.times.by === 'createdAt') {
          if (sorting.times.direction === 'asc') {
            if (a.summary < b.summary) return -1;
            if (a.summary > b.summary) return 1;
          } else {
            if (b.summary < a.summary) return -1;
            if (b.summary > a.summary) return 1;
          }
        }
        if (sorting.times.by === 'latestChange') {
          if (sorting.times.direction === 'asc') {
            if (a.lastStatusChangeAt < b.lastStatusChangeAt) return -1;
            if (a.lastStatusChangeAt > b.lastStatusChangeAt) return 1;
          } else {
            if (b.lastStatusChangeAt < a.lastStatusChangeAt) return -1;
            if (b.lastStatusChangeAt > a.lastStatusChangeAt) return 1;
          }
        }
        return 0;
      })
      .filter((incident) => {
        const date = format(
          new Date(
            sorting.times.by === 'createdAt'
              ? incident.created_at
              : incident.last_status_change_at,
          ),
          'dd/MM/yyyy',
        );
        return date === day;
      })
      .forEach((incident) => {
        const {
          incident_number: incidentNumber,
          acknowledgements,
          created_at: createdAt,
          service,
          summary,
          html_url: htmlUrl,
          last_status_change_at: lastStatusChangeAt,
          last_status_change_by: lastStatusChangeBy,
          status,
        } = incident;
        sortedIncidents[day].push({
          acknowledgements,
          incidentNumber,
          createdAt,
          service,
          summary: summary.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1'),
          htmlUrl,
          lastStatusChangeAt,
          lastStatusChangeBy,
          day,
          status,
        });
      });
  });
  return sortedIncidents;
};

export function sortIncidents(incidents, sorting) {
  const sortedIncidents = {};
  const days = Object.keys(incidents);

  days.forEach((day) => {
    sortedIncidents[day] = incidents[day].sort((a, b) => {
      if (sorting.names.serviceName) {
        if (sorting.names.direction === 'asc') {
          if (a.service.summary < b.service.summary) return -1;
          if (a.service.summary > b.service.summary) return 1;
        } else {
          if (b.service.summary < a.service.summary) return -1;
          if (b.service.summary > a.service.summary) return 1;
        }
      }
      if (sorting.times.createdAt) {
        if (sorting.times.direction === 'asc') {
          if (a.summary < b.summary) return -1;
          if (a.summary > b.summary) return 1;
        } else {
          if (b.summary < a.summary) return -1;
          if (b.summary > a.summary) return 1;
        }
      }
      if (sorting.times.updatedAt) {
        if (sorting.times.direction === 'asc') {
          if (a.last_status_change_at < b.last_status_change_at) return -1;
          if (a.last_status_change_at > b.last_status_change_at) return 1;
        } else {
          if (b.last_status_change_at < a.last_status_change_at) return -1;
          if (b.last_status_change_at > a.last_status_change_at) return 1;
        }
      }
      return 0;
    });
  });
  return sortedIncidents;
}

export default mapIncidentToDay;
