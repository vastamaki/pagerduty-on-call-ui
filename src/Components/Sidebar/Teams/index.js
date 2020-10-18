import React, { useContext } from 'react';
import { setSelectedTeam, setDefaultTeams } from '../../../Context/actions';
import { Context } from '../../../Context';

const Teams = () => {
  const { dispatch, currentUser, teams } = useContext(Context);

  const changeTeamID = async (e) => {
    const teamName = e.target[e.target.selectedIndex].text;
    const teamID = e.target[e.target.selectedIndex].value;

    if (teamID === 'default') {
      return setDefaultTeams(currentUser)(dispatch);
    }

    setSelectedTeam(teamID, teamName)(dispatch);
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
