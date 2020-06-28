import React, { PureComponent } from "react";
import "./App.css";

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      teamID: "",
    };
  }

  componentDidMount() {
    this.setState({
      token: localStorage.getItem("token"),
      teamID: localStorage.getItem("teamID"),
    });
  }

  changeTeamID = (e) => {
    this.setState({
      teamID: e.target.value,
    });
  };

  onChange(e) {
    this.setState({
      token: e.target.value,
    });
  }

  setToken() {
    localStorage.setItem("token", this.state.token);
    this.props.history.push("/incidents");
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="wrapper">
            <p>Pagerduty token</p>
            <input
              placeholder="Pagerduty token"
              onChange={(e) => this.onChange(e)}
              className="input"
              value={this.state.token}
            />
            <p>Pagerduty team ID</p>
            <input
              onChange={(e) => this.changeTeamID(e)}
              className="input"
              value={this.state.teamID}
              placeholder="Team ID"
            />
            <input
              onClick={() => this.setToken()}
              className="submit"
              type="submit"
              value="Continue"
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
