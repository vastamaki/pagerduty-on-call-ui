import React, { useContext, useEffect } from 'react';
import { Context } from '../../Context';
import './index.scss';

const Notification = () => {
  const [context, dispatch] = useContext(Context);
  const { notification } = context;

  useEffect(() => {
    setTimeout(() => {
      dispatch({
        type: 'HIDE_NOTIFICATION',
      });
    }, notification.timeout);
  }, [notification.hidden, notification.timeout, dispatch]);

  return (
    !notification.hidden && (
      <div
        onClick={() => dispatch({
          type: 'HIDE_NOTIFICATION',
        })
        }
        className={`notification ${notification.success ? 'success' : 'error'}`}
      >
        <p>{notification.success ? 'Success!' : 'Oops.. :('}</p>
        <p>{notification.message}</p>
      </div>
    )
  );
};

export default Notification;
