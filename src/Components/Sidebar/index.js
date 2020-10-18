import React, { PureComponent } from 'react';
import { Context } from '../../Context';
import TimeSelect from './TimeSelect';
import Cards from './Cards';
import Filters from './Filters';
import Sorting from './Sorting';
import Teams from './Teams';
import './index.scss';

class Sidebar extends PureComponent {
  render() {
    const { selectedTeamName, currentUser } = this.context;

    return (
      <div className="sidebar">
        <div className="header">
          <div>
            <img alt="" className="profile-picture" src={currentUser.avatar_url} />
            <div>
              <h3>{selectedTeamName.split('|')[0]}</h3>
              <h3>{selectedTeamName.split('|')[1]}</h3>
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
  }
}

Sidebar.contextType = Context;
export default Sidebar;
