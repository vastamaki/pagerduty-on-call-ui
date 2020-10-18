import React, { useContext } from 'react';
import { Context } from '../../../Context';
import { setFilters } from '../../../Context/actions';

const Filters = () => {
  const { dispatch, filters } = useContext(Context);

  const onFilterChange = async (filter, e) => {
    setFilters({
      ...filters,
      [filter]: e.target.value,
    })(dispatch);
  };

  const handleCheckboxChange = (e, name) => {
    const newFilters = {
      ...filters,
      [name]: e.target.checked,
    };
    setFilters(newFilters)(dispatch);
    return localStorage.setItem('filters', JSON.stringify(newFilters));
  };

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
