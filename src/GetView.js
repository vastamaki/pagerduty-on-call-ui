import React, { useContext } from 'react';
import Incidents from './Components/Incidents';
import { Context } from './Context';
import Sidebar from './Components/Sidebar';
import './GetView.scss';

const GetView = () => {
  const [context] = useContext(Context);
  const { loading } = context;

  return (
    <React.Fragment>
      <div className="App">
        {!loading ? (
          <>
            <Sidebar />
            <Incidents />
          </>
        ) : (
          <div className="loading-spinner" />
        )}
      </div>
    </React.Fragment>
  );
};

export default GetView;
