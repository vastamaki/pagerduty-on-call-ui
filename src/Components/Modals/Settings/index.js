import React, { PureComponent } from 'react';
import { Context } from '../../../Context';
import { changeModalState } from '../../../Context/actions';

class Settings extends PureComponent {
  render() {
    const { dispatch } = this.context;

    return (
      <React.Fragment>
        <h2>Settings</h2>
        <ul>
          <li>
            <input
              onClick={() => changeModalState({
                modal: 'teams',
                state: true,
              })(dispatch)}
              className='submit'
              type='submit'
              value='Select team'
            />
          </li>
          <li>
            <input
              onClick={() => changeModalState({
                modal: 'cardSettings',
                state: true,
              })(dispatch)}
              className='submit'
              type='submit'
              value='Edit card content'
            />
          </li>
        </ul>
      </React.Fragment>
    );
  }
}
Settings.contextType = Context;
export default Settings;
