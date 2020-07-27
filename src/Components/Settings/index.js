import React, { PureComponent } from 'react';
import { Context } from '../../Context';
import { changeModalState } from '../../Context/actions';

class Settings extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { dispatch, openModals } = this.context;
    return openModals.settings ? (
      <React.Fragment>
        <div className="settings-wrapper">
          <div className="settings">
            <h2>Settings</h2>
            <input
              onClick={() => changeModalState({
                modal: 'teams',
                state: true,
              })(dispatch)
              }
              className="submit"
              type="submit"
              value="Select team"
            />
            <input
              onClick={() => changeModalState({
                modal: 'cardSettings',
                state: true,
              })(dispatch)
              }
              className="submit"
              type="submit"
              value="Edit card content"
            />
          </div>
        </div>
      </React.Fragment>
    ) : null;
  }
}
Settings.contextType = Context;
export default Settings;
