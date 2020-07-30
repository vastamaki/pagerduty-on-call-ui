import React, { PureComponent } from 'react';
import { Context } from '../../Context';
import { toggleNotification } from '../../Context/actions';
import './index.css';

class Notification extends PureComponent {
  componentDidMount = () => {
    const { dispatch } = this.context;
    setTimeout(() => {
      toggleNotification({
        hidden: true,
      })(dispatch);
    }, 3000);
  };

  render() {
    const { notification } = this.context;
    return (
      !notification.hidden && (
        <div
          className={`notification ${
            notification.success ? 'success' : 'error'
          }`}
        >
          <p>{notification.success ? 'Success!' : 'Error!'}</p>
          <p>{notification.message}</p>
        </div>
      )
    );
  }
}

Notification.contextType = Context;
export default Notification;
