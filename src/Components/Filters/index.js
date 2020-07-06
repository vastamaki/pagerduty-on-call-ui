import React, { PureComponent } from "react";
import "./index.css";

class Filters extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      excludeFilter: "",
    };
  }

  componentDidMount() {
    const excludeFilter = localStorage.getItem("excludeFilter")
    this.setState({
      excludeFilter,
    });
  }

  onExcludeFilterChange = async (e) => {
    this.setState({
      excludeFilter: e.target.value,
    });
  };

  setFilters = () => {
    localStorage.setItem("excludeFilter", this.state.excludeFilter || "");
    this.props.close()
  };

  render() {
    return (
      <div className="settings-wrapper">
        <div className="settings">
          <h1 className="title">Filters</h1>
          <h4>Exclude (use comma to separate)</h4>
          <input
            placeholder="Service names to filter out"
            onChange={(e) => this.onExcludeFilterChange(e)}
            className="input"
            value={this.state.excludeFilter}
          />
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

export default Filters;
