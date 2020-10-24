import React, { useContext } from 'react';
import { Context } from '../../../Context';

const Teams = () => {
  const [context, dispatch] = useContext(Context);
  const { currentUser, teams } = context;

  const changeTeamID = async (e) => {
    const teamName = e.target[e.target.selectedIndex].text;
    const teamID = e.target[e.target.selectedIndex].value;

    if (teamID === 'default') {
      const teamIDs = currentUser.teams.map((team) => team.id);
      return dispatch({
        type: 'SET_DEFAULT_TEAMS',
        payload: teamIDs,
      });
    }

    dispatch({
      type: 'SET_SELECTED_TEAM',
      payload: {
        teamID,
        teamName,
      },
    });
    return true;
  };

  return (
    <div className="teams">
      <h2>Select team</h2>
      <div className="dropdown">
        <select
          onChange={(e) => changeTeamID(e)}
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
          {teams.map((team, index) => (
            <option key={index} value={team.id} name={team.name}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Teams;
