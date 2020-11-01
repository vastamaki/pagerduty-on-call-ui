import React, { useContext } from 'react';
import Incidents from '../../Components/Incidents';
import { Context } from '../../Context';
import Loader from '../../Components/Loader';
import './index.scss';

const IncidentsView = () => {
  const [context] = useContext(Context);
  const { loading } = context;

  return loading ? <Loader /> : <Incidents />;
};
export default IncidentsView;
