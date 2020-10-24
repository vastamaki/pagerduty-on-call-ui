import React, { useContext } from 'react';
import { Context } from '../../../Context';

const Cards = () => {
  const [context, dispatch] = useContext(Context);
  const { cardContent } = context;

  const handleCheckboxChange = async (e, name) => {
    dispatch({
      type: 'UPDATE_CARD_CONTENT',
      payload: {
        name,
        value: e.target.checked,
      },
    });
  };

  return (
    <div className="card-content">
      <h2>Card content</h2>
      <div>
        <input
          type="checkbox"
          id="card-summary-switch"
          onChange={(e) => handleCheckboxChange(e, 'summary')}
          checked={cardContent.summary}
        />
        <label className="checkbox-label" htmlFor="card-summary-switch" />
        <p>Summary</p>
      </div>
      <div>
        <input
          type="checkbox"
          id="card-created-at-switch"
          onChange={(e) => handleCheckboxChange(e, 'createdAt')}
          checked={cardContent.createdAt}
        />
        <label className="checkbox-label" htmlFor="card-created-at-switch" />
        <p>Created at</p>
      </div>
      <div>
        <input
          type="checkbox"
          id="card-latest-change-switch"
          onChange={(e) => handleCheckboxChange(e, 'latestChange')}
          checked={cardContent.latestChange}
        />
        <label className="checkbox-label" htmlFor="card-latest-change-switch" />
        <p>Latest change</p>
      </div>
      <div>
        <input
          type="checkbox"
          id="card-latest-change-by-switch"
          onChange={(e) => handleCheckboxChange(e, 'changedBy')}
          checked={cardContent.changedBy}
        />
        <label
          className="checkbox-label"
          htmlFor="card-latest-change-by-switch"
        />
        <p>Latest change by</p>
      </div>
    </div>
  );
};

export default Cards;
