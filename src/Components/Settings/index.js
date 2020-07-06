import React, { PureComponent } from "react";
import "./index.css";

class Settings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      teamID: "",
      teamsFetched: false,
      showTeams: false,
      teams: [],
      loading: false,
      excludeFilter: null
    };
  }

  componentDidMount = () => {
    const excludeFilter = localStorage.getItem("excludeFilter")
    const token = localStorage.getItem("token");
    this.setState({
      token,
      excludeFilter
    });
  }

  changeTeamID = (e) => {
    localStorage.setItem("teamID", e.target.value);
  };

  onTokenChange = (e) => {
    localStorage.setItem("token", e.target.value);
  }

  renderTeams = () => {
    return (
      <React.Fragment>
        <h4>Pagerduty team ID</h4>
        <select className="input" name="teams" id="teams">
          {this.state.teams.map((team, index) => {
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
  }

  getTeams = async () => {
    const params = {
      method: "GET",
      headers: {
        Accept: "application/vnd.pagerduty+json;version=2",
        Authorization: "Token token=" + localStorage.getItem("token"),
      },
    };

    let response;

    try {
      response = await fetch(
        encodeURI(`https://api.pagerduty.com/teams`),
        params
      );
    } catch (err) {
      this.setState({
        loading: false,
        notification: {
          success: false,
          message: "Failed to get teams!",
          hidden: false,
        },
      });
      return;
    }

    const teams = await response.json();

    this.setState({
      teams: teams.teams,
      teamID: teams.teams[0].id,
      showTeams: true,
    });
  }

  setToken = async () => {
    this.setState({
      loading: true,
    });
    localStorage.setItem("token", this.state.token);
    localStorage.setItem("excludeFilter", this.state.excludeFilter)
    await this.getTeams();
    this.setState({
      loading: false,
    });
  }

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
          {this.state.showTeams ? this.renderTeams() : null}
          <input
            onClick={() =>
              this.state.showTeams ? this.props.close() : this.setToken()
            }
            className="submit"
            type="submit"
            value={this.state.showTeams ? "Save" : "Get teams"}
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

export default Settings;
