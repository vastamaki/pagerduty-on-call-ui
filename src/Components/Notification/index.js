import React, { useContext } from 'react';
import { Context } from '../../Context';
import './index.scss';

const Notification = () => {
  const [context] = useContext(Context);
  const { notification, dispatch } = context;

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
