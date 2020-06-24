import React, { PureComponent } from "react";
import "./App.css";

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.props.history.push("/incidents");
    }
  }

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
          <p>Enter your PD token:</p>
          <input onChange={(e) => this.onChange(e)} className="input" />
          <input
            onClick={() => this.setToken()}
            className="submit"
            type="submit"
            value="Set token"
          />
        </div>
      </div>
    );
  }
}

export default App;
