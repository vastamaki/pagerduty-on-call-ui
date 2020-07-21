import React, { PureComponent } from "react";
import { Context } from "../../Context";
import { setFilters, changeModalState } from "../../Context/actions";
import "./index.css";

class Filters extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      filters: {},
    };
  }

  componentDidMount = () => {
    const { filters } = this.context;
    this.setState({
      filters,
    });
  };

  onFilterChange = async (filter, e) => {
    this.setState({
      filters: {
        [filter]: e.target.value,
      },
    });
  };

  setFilters = () => {
    const { dispatch } = this.context;
    localStorage.setItem("filters", JSON.stringify(this.state.filters));
    setFilters("exclude", this.state.filters.exclude)(dispatch);
    changeModalState({
      modal: "filters",
      state: false,
    })(dispatch);
  };

  render() {
    const { openModals } = this.context;
    return openModals.filters ? (
      <div className="settings-wrapper">
        <div className="settings">
          <h1 className="title">Filters</h1>
          <h4>Exclude (use comma to separate)</h4>
          <input
            placeholder="Service names to filter out"
            onChange={(e) => this.onFilterChange("exclude", e)}
            className="input"
            value={this.state.filters.exclude}
          />
          <input
            onClick={() => this.setFilters()}
            className="submit"
            type="submit"
            value="Save"
          />
        </div>
      </div>
    ) : null;
  }
}

Filters.contextType = Context;
export default Filters;
