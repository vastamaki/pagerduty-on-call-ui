import React, { useContext } from 'react';
import Incidents from './Components/Incidents';
import { Context } from './Context';
import Loader from './Components/Loader';
import './GetView.scss';

const GetView = () => {
  const [context] = useContext(Context);
  const { loading } = context;

  return (
    <React.Fragment>
        {loading ? (
          <Loader />
        ) : (
          <Incidents />
        )}
    </React.Fragment>
  );
};

export default GetView;
