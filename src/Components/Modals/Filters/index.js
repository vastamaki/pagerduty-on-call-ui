import React, { PureComponent } from 'react';
import { Context } from '../../../Context';
import { setFilters, changeModalState } from '../../../Context/actions';
import './index.css';

class Filters extends PureComponent {
  state = {
    filters: {},
  };

  componentDidMount = () => {
    const { filters } = this.context;

    this.setState({
      filters,
    });
  };

  onFilterChange = async (filter, e) => {
    this.setState({
      filters: {
        ...this.state.filters,
        [filter]: e.target.value,
      },
    });
  };

  handleCheckboxChange = (e, name) => {
    this.setState({
      filters: {
        ...this.state.filters,
        [name]: e.target.checked,
      },
    });
  };

  setFilters = () => {
    const { dispatch } = this.context;

    localStorage.setItem('filters', JSON.stringify(this.state.filters));

    setFilters(this.state.filters)(dispatch);

    changeModalState({
      modal: 'filters',
      state: false,
    })(dispatch);
  };

  render() {
    return (
      <div className="filters-settings-wrapper">
        <div className="filters-settings">
          <h1 className="title">Filters</h1>
          <ul>
            <li>
              <h4>Exclude (use comma to separate)</h4>
              <input
                placeholder="Service names to filter out"
                onChange={(e) => this.onFilterChange('exclude', e)}
                className="input"
                value={this.state.filters.exclude}
              />
            </li>
            <hr />
            <li>
              <p>
                <input
                  type="checkbox"
                  id="switch1"
                  onChange={(e) => this.handleCheckboxChange(e, 'showOnlyOwnIncidents')}
                  checked={this.state.filters.showOnlyOwnIncidents}
                />
                <label className="checkbox-label" htmlFor="switch1" />
                Show only own incidents
              </p>
            </li>
          </ul>
          <input
            onClick={() => this.setFilters()}
            className="submit"
            type="submit"
            value="Save"
          />
        </div>
      </div>
    );
  }
}

Filters.contextType = Context;
export default Filters;
