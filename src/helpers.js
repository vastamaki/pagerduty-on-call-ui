export const mapIncidentToDay = (weekdays, incidents) => {
  return weekdays.map((day) => {
    return incidents
      .filter((incident) => {
        const date = new Date(incident.created_at).toISOString();
        if (date.substr(0, 10) === day) {
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
          day,
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
