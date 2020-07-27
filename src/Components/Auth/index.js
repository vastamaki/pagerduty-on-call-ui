import React from 'react';
import { Route } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import fetch from '../Fetch';

const checkToken = async (rest) => {
  const token = localStorage.getItem('access_token');
  const { search } = rest.location;
  const queryParams = new URLSearchParams(search);
  const authorizationCode = queryParams.get('code');

  if (!token && !authorizationCode) {
    window.location.href = 'https://app.pagerduty.com/oauth/authorize?client_id=ba65171a721befb7fc2b3ceece703a6b38c1da83c14954039f81a7115bb2058e&redirect_uri=http://localhost:3000&response_type=code&code_challenge_method=S256&code_challenge';
  }

  if (!token && authorizationCode) {
    const params = {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.pagerduty+json;version=2',
      },
    };

    const response = await fetch(
      encodeURI(
        `https://app.pagerduty.com/oauth/token?grant_type=authorization_code&client_id=ba65171a721befb7fc2b3ceece703a6b38c1da83c14954039f81a7115bb2058e&redirect_uri=http://localhost:3000&code=${authorizationCode}&code_verifier`,
      ),
      params,
    );

    if (!response.ok) {
      window.location.href = 'https://app.pagerduty.com/oauth/authorize?client_id=ba65171a721befb7fc2b3ceece703a6b38c1da83c14954039f81a7115bb2058e&redirect_uri=http://localhost:3000&response_type=code&code_challenge_method=S256&code_challenge';
    }

    if (response && (response.access_token && response.refresh_token)) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      return true;
    }
  }
  return false;
};

export const PrivateRoute = ({ component: Component, ...rest }) => checkToken(rest) && (
  <Route {...rest} render={(props) => <Component {...props} />} />
);
export default PrivateRoute;

PrivateRoute.propTypes = {
  component: PropTypes.func,
};
