import React, { PureComponent } from 'react';
import {
  getTeams,
  changeModalState,
  setSelectedTeam,
  setDefaultTeams,
} from '../../../Context/actions';
import { Context } from '../../../Context';

class Teams extends PureComponent {
  state = {
    loading: false,
    teamChanged: false,
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

  changeTeamID = async (e) => {
    this.setState({
      teamChanged: true,
    });
    const { dispatch, currentUser } = this.context;
    const teamName = e.target[e.target.selectedIndex].text;
    const teamID = e.target[e.target.selectedIndex].value;

    if (teamID === 'default') {
      return setDefaultTeams(currentUser)(dispatch);
    }

    return setSelectedTeam(teamID, teamName)(dispatch);
  };

  closeModal = async () => {
    const { currentUser, dispatch } = this.context;
    if (!this.state.teamChanged) {
      setDefaultTeams(currentUser)(dispatch);
    }
    changeModalState({
      modal: 'teams',
      state: false,
    })(dispatch);
  };

  render() {
    return (
      <React.Fragment>
        <h2>Pagerduty team ID</h2>
        {this.state.loading ? (
          <div className="loading-spinner" />
        ) : (
          <div className="dropdown">
            <select
              onChange={(e) => this.changeTeamID(e)}
              className="input"
              name="teams"
              id="teams"
            >
              <option
                key={'default'}
                value={'default'}
                name={'All current user teams'}
              >
                All current user teams
              </option>
              {this.context.teams.map((team, index) => (
                <option key={index} value={team.id} name={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <input
          onClick={() => this.closeModal()}
          className="submit"
          type="submit"
          value="Save"
        />
      </React.Fragment>
    );
  }
}
Teams.contextType = Context;
export default Teams;
