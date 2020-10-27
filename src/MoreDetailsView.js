import React, { useContext } from 'react';
import * as PropTypes from 'prop-types';
import MoreDetails from './Components/MoreDetails';
import { Context } from './Context';
import Loader from './Components/Loader';
import './GetView.scss';

const MoreDetailsView = (props) => {
  const [context] = useContext(Context);
  const { loading } = context;

  const {
    match: {
      params: { incident },
    },
  } = props;

  return (
    <React.Fragment>
        {loading ? (
          <Loader />
        ) : (
          <MoreDetails props={incident} />
        )}
    </React.Fragment>
  );
};

export default MoreDetailsView;

MoreDetailsView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      incident: PropTypes.string,
    }),
  }),
};
