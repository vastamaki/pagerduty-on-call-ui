import React, { PureComponent } from "react";
import Settings from "../Settings";
import Filters from "../Filters"
import "./index.css";

class Header extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      settingsVisible: false,
      filtersVisible: false,
    };
  }

  closeSettings = () => {
    this.setState({
      settingsVisible: false,
    });
  };

  closeFilters = () => {
    this.setState({
      filtersVisible: false,
    });
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const teamID = localStorage.getItem("teamID");
    if (!token || !teamID) {
      this.setState({
        settingsVisible: true,
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.settingsVisible && (
          <Settings Notification={this.notification} close={this.closeSettings} />
        )}
        {this.state.filtersVisible && (
          <Filters close={this.closeFilters}/>
        )}
        <div className="header">
          <div className="menu-item">
            <p onClick={() => this.props.clearIncidents()}>Select time</p>
            <p
              onClick={() => {
                this.setState({
                  filtersVisible: true,
                });
              }}
            >
              Filters
            </p>
            <p
              onClick={() => {
                this.setState({
                  settingsVisible: true,
                });
              }}
            >
              Settings
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Header;
