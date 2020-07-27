import React, { PureComponent } from 'react';
import { getTeams, changeModalState } from '../../../Context/actions';
import { Context } from '../../../Context';
import './index.css';

class Teams extends PureComponent {
  state = {
    loading: false,
  };

  componentDidMount = async () => {
    const { dispatch } = this.context;

    this.setState({
      loading: true,
    });

    await getTeams()(dispatch);

    this.setState({
      loading: false,
    });
  };

  changeTeamID = (e) => {
    const teamName = e.target[e.target.selectedIndex].text;
    const teamID = e.target[e.target.selectedIndex].value;

    localStorage.setItem('teamID', teamID);
    localStorage.setItem('teamName', teamName);
  };

  renderTeams = () => (
    <React.Fragment>
      <h4>Pagerduty team ID</h4>
      <select
        onChange={(e) => this.changeTeamID(e)}
        className="input"
        name="teams"
        id="teams"
      >
        {this.context.teams.map((team, index) => (
          <option key={index} value={team.id} name={team.name}>
            {team.name}
          </option>
        ))}
      </select>
    </React.Fragment>
  );

  render() {
    const { dispatch } = this.context;
    return (
      <div className="teams-settings-wrapper">
        <div className="teams-settings">
          <h4>Pagerduty team ID</h4>
          {this.state.loading ? (
              <div className="loading-spinner" />
          ) : (
          <select
            onChange={(e) => this.changeTeamID(e)}
            className="input"
            name="teams"
            id="teams"
          >
            {this.context.teams.map((team, index) => (
              <option key={index} value={team.id} name={team.name}>
                {team.name}
              </option>
            ))}
          </select>
          )}
          <input
            onClick={() => changeModalState({
              modal: 'teams',
              state: false,
            })(dispatch)
            }
            className="submit"
            type="submit"
            value="Save"
          />
        </div>
      </div>
    );
  }
}
Teams.contextType = Context;
export default Teams;
