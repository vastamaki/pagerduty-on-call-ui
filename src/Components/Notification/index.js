import React, { PureComponent } from 'react';
import { hideNotification } from '../../Context/actions';
import { Context } from '../../Context';
import './index.css';

class Notification extends PureComponent {
  render() {
    const { notification, dispatch } = this.context;

    return (
      !notification.hidden && (
        <div
        onClick={() => hideNotification()(dispatch)}
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
