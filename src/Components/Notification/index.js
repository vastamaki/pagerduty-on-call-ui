import React, { PureComponent } from 'react';
import { Context } from '../../Context';
import './index.css';

class Notification extends PureComponent {
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
