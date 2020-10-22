import React, { useContext } from 'react';
import { Context } from '../../../Context';

const Filters = () => {
  const [context, dispatch] = useContext(Context);
  const { filters } = context;

  const onFilterChange = async (filter, e) => {
    dispatch({
      type: 'SET_FILTERS',
      payload: {
        ...filters,
        [filter]: e.target.value,
      },
    });
  };

  const handleCheckboxChange = (e, name) => dispatch({
    type: 'SET_FILTERS',
    payload: {
      ...filters,
      [name]: e.target.checked,
    },
  });

  return (
    <div className="filters">
      <h2 className="title">Filters</h2>
      <h4>Exclude (use comma to separate)</h4>
      <input
        placeholder="Service names to filter out"
        onChange={(e) => onFilterChange('exclude', e)}
        className="input"
        value={filters.exclude}
      />
      <hr />
      <div>
        <input
          type="checkbox"
          id="show-own-incidents-switch"
          onChange={(e) => handleCheckboxChange(e, 'showOnlyOwnIncidents')}
          checked={filters.showOnlyOwnIncidents}
        />
        <label className="checkbox-label" htmlFor="show-own-incidents-switch" />
        <p>Only own incidents</p>
      </div>
    </div>
  );
};

export default Filters;
