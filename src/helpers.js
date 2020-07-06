const isFiltered = (incident) => {
  const filters = localStorage.getItem("excludeFilter")

  if (filters && filters.split(",").some((filter) => incident.service.summary.includes(filter))) {
    return true;
  }
  return false;
};

export const mapIncidentToDay = (weekdays, incidents) => {
  return weekdays.map((day) => {
    return incidents
      .filter((incident) => {
        const date = new Date(incident.created_at).toISOString();
        if (date.substr(0, 10) === day && !isFiltered(incident)) {
          return true;
        }
        return false;
      })
      .map((incident) => {
        const {
          incident_number,
          created_at,
          service,
          summary,
          html_url,
          last_status_change_at,
          last_status_change_by,
        } = incident;
        return {
          incident_number,
          created_at,
          service,
          summary,
          html_url,
          last_status_change_at,
          last_status_change_by,
        };
      });
  });
};

export const getWeekDays = (incidents) => {
  return Array.from(
    new Set(
      incidents.map((incident) => {
        return new Date(incident.created_at).toISOString().substr(0, 10);
      })
    )
  );
};
