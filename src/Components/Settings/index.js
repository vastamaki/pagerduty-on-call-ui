import React, { PureComponent } from "react";
import { getTeams } from "../../Context/actions";
import { Context } from "../../Context";
import "./index.css";

class Settings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      teamID: "",
      loading: false,
    };
  }

  componentDidMount = async () => {
    this.setState({
      loading: true,
    });
    const { dispatch } = this.context;
    const token = localStorage.getItem("token");
    if (token) {
      await getTeams()(dispatch);
      this.setState({
        token,
        loading: false,
      });
    }
  };

  changeTeamID = (e) => {
    localStorage.setItem("teamID", e.target.value);
  };

  onTokenChange = (e) => {
    this.setState({
      token: e.target.value,
    });
    localStorage.setItem("token", e.target.value);
  };

  setToken = async () => {
    const { dispatch } = this.context;
    localStorage.setItem("token", this.state.token);
    getTeams()(dispatch);
  };

  renderTeams = () => {
    return (
      <React.Fragment>
        <h4>Pagerduty team ID</h4>
        <select className="input" name="teams" id="teams">
          {this.context.teams.map((team, index) => {
            return (
              <option
                onClick={(e) => this.changeTeamID(e)}
                key={index}
                value={team.id}
              >
                {team.name}
              </option>
            );
          })}
        </select>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="settings-wrapper">
        <div className="settings">
          <h4>Pagerduty token</h4>
          <input
            placeholder="Pagerduty token"
            onChange={(e) => this.onTokenChange(e)}
            className="input"
            value={this.state.token}
            type="password"
          />
          {this.state.loading ? <div className="loading-spinner" /> : null}
          {this.state.loading ? null : this.renderTeams()}
          <input
            onClick={() =>
              this.context.teams ? this.props.close() : this.setToken()
            }
            className="submit"
            type="submit"
            value={this.context.teams ? "Save" : "Get teams"}
          />
          <p>
            Don't have a{" "}
            <a href=" https://support.pagerduty.com/docs/generating-api-keys#generating-a-personal-rest-api-key">
              token?
            </a>
          </p>
        </div>
      </div>
    );
  }
}
Settings.contextType = Context;
export default Settings;
