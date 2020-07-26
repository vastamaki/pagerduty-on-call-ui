import React, { PureComponent } from "react";
import { getTeams, changeModalState } from "../../../Context/actions";
import { Context } from "../../../Context";
import "./index.css";

class Teams extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      loading: false,
      showTeams: false,
    };
  }

  componentDidMount = async () => {
    const { dispatch } = this.context;
    const token = localStorage.getItem("token");
    if (token) {
      this.setState({
        token,
      });
      this.setState({
        loading: true,
      });
      await getTeams()(dispatch);
      this.setState({
        token,
        loading: false,
        showTeams: true,
      });
    }
  };

  changeTeamID = (e) => {
    const teamName = e.target[e.target.selectedIndex].text;
    const teamID = e.target[e.target.selectedIndex].value;
    localStorage.setItem("teamID", teamID);
    localStorage.setItem("teamName", teamName);
  };

  onTokenChange = (e) => {
    this.setState({
      token: e.target.value,
      showTeams: false
    });
    localStorage.setItem("token", e.target.value);
  };

  setToken = async () => {
    this.setState({
      loading: true,
    });
    const { dispatch } = this.context;
    localStorage.setItem("token", this.state.token);
    await getTeams()(dispatch);
    this.setState({
      loading: false,
      showTeams: true
    });
  };

  renderTeams = () => {
    return (
      <React.Fragment>
        <h4>Pagerduty team ID</h4>
        <select
          onChange={(e) => this.changeTeamID(e)}
          className="input"
          name="teams"
          id="teams"
        >
          {this.context.teams.map((team, index) => {
            return (
              <option key={index} value={team.id} name={team.name}>
                {team.name}
              </option>
            );
          })}
        </select>
      </React.Fragment>
    );
  };

  render() {
    const { dispatch } = this.context;
    return  (
      <div className="teams-settings-wrapper">
        <div className="teams-settings">
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
              this.state.showTeams
                ? changeModalState({
                    modal: "teams",
                    state: false,
                  })(dispatch)
                : this.setToken()
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
Teams.contextType = Context;
export default Teams;
