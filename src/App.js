import React, { PureComponent } from "react";
import "./App.css";

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      teamID: "",
      teamsFetched: false,
      showTeams: false,
      teams: [],
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    const teamID = localStorage.getItem("teamID");
    this.setState({
      token,
      teamID,
    });
  }

  changeTeamID = (e) => {
    this.setState({
      teamID: e.target.value,
    });
  };

  onTokenChange(e) {
    this.setState({
      token: e.target.value,
    });
  }

  renderTeams() {
    return (
      <React.Fragment>
        <p>Pagerduty team ID</p>
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

  async getTeams() {
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
      console.log(err);
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

  setToken() {
    localStorage.setItem("token", this.state.token);
    this.getTeams();
  }

  redirect(location) {
    localStorage.setItem("teamID", this.state.teamID);
    this.props.history.push(location);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="wrapper">
            <p>Pagerduty token</p>
            <input
              placeholder="Pagerduty token"
              onChange={(e) => this.onTokenChange(e)}
              className="input"
              value={this.state.token}
              type="password"
            />
            {this.state.showTeams ? this.renderTeams() : null}
            <input
              onClick={() =>
                this.state.showTeams
                  ? this.redirect("/incidents")
                  : this.setToken()
              }
              className="submit"
              type="submit"
              value={this.state.showTeams ? "Continue" : "Get teams"}
            />
            <p>
              Don't have a{" "}
              <a href=" https://support.pagerduty.com/docs/generating-api-keys#generating-a-personal-rest-api-key">
                token?
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
