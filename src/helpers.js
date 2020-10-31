import format from 'date-fns/format';

const sort = (a, b, sorting) => {
  if (sorting.names.by === 'serviceName' && sorting.names.active) {
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
};

/* eslint-disable camelcase */
export const mapIncidentToDay = (incidents, sorting) => {
  const sortedIncidents = {};

  const weekdays = Array.from(
    new Set(
      incidents.map((incident) => format(
        new Date(
          sorting.times.by === 'createdAt'
            ? incident.created_at
            : incident.last_status_change_at,
        ),
        'dd/MM/yyyy',
      )),
    ),
  ).sort((a, b) => new Date(a) - new Date(b));

  weekdays.forEach((day) => {
    sortedIncidents[day] = [];

    incidents
      .sort((a, b) => sort(a, b, sorting))
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
          id,
        } = incident;
        sortedIncidents[day].push({
          id,
          acknowledgements,
          incidentNumber,
          createdAt,
          service,
          summary: summary.replace(/([A-Z]+)/g, ' $1').replace(/ {1,}/g, ' '),
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
    sortedIncidents[day] = incidents[day].sort((a, b) => sort(a, b, sorting));
  });
  return sortedIncidents;
}

export const incidentStatusToColor = (status) => {
  switch (status) {
    case 'acknowledged':
      return '#ffb347';
    case 'triggered':
      return '#ff6961';
    default:
      return '#5fb15f';
  }
};
