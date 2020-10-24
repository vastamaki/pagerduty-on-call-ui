import React from 'react';
import './index.scss';

const Loader = () => {
  console.log('loading');
  return (
    <div className="loading-wrapper">
      <div className='loading-spinner' />
    </div>
  );
};

export default Loader;
