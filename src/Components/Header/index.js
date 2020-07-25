import React, { PureComponent } from 'react';
import { clearIncidents, changeModalState } from '../../Context/actions';
import { Context } from '../../Context';
import './index.css';

class Header extends PureComponent {
  render() {
    const { dispatch } = this.context;
    return (
      <React.Fragment>
        <div className="header">
          <div className="menu-left">
            <p title={localStorage.getItem('teamID')}>
              {localStorage.getItem('teamName')}
            </p>
          </div>
          <div className="menu-right">
            <p onClick={() => clearIncidents()(dispatch)}>Select time</p>
            <p
              onClick={() => {
                changeModalState({
                  modal: 'filters',
                  state: true,
                })(dispatch);
              }}
            >
              Filters
            </p>
            <p
              onClick={() => {
                changeModalState({
                  modal: "sorting",
                  state: true,
                })(dispatch);
              }}
            >
              Sorting
            </p>
            <p
              onClick={() => {
                changeModalState({
                  modal: "settings",
                  state: true,
                })(dispatch);
              }}
            >
              Settings
            </p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Header.contextType = Context;
export default Header;
