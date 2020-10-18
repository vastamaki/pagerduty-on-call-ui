import React, { useContext } from 'react';
import { hideNotification } from '../../Context/actions';
import { Context } from '../../Context';
import './index.scss';

const Notification = () => {
  const { notification, dispatch } = useContext(Context);

  return (
    !notification.hidden && (
      <div
        onClick={() => hideNotification()(dispatch)}
        className={`notification ${notification.success ? 'success' : 'error'}`}
      >
        <p>{notification.success ? 'Success!' : 'Oops.. :('}</p>
        <p>{notification.message}</p>
      </div>
    )
  );
};

export default Notification;
