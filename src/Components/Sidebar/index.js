import React, { useContext } from 'react';
import { Context } from '../../Context';
import TimeSelect from './TimeSelect';
import Cards from './Cards';
import Filters from './Filters';
import Sorting from './Sorting';
import Teams from './Teams';
import './index.scss';

const Sidebar = () => {
  const [context] = useContext(Context);
  const { selectedTeamName, currentUser } = context;

  return (
    <div className="sidebar">
      <div className="header">
        <div>
          <img
            alt=""
            className="profile-picture"
            src={currentUser.avatar_url}
          />
          <div>
            <h3>{currentUser.name}</h3>
            <h3>{selectedTeamName}</h3>
          </div>
        </div>
        <hr />
      </div>
      <div className="content">
        <TimeSelect />
        <Cards />
        <Filters />
        <Sorting />
        <Teams />
      </div>
    </div>
  );
};

export default Sidebar;
