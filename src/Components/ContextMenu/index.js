import React, { useState, useContext } from 'react';
import * as PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context';
import './index.scss';

const ContextMenu = (props) => {
  const navigate = useNavigate();
  const [context, dispatch] = useContext(Context);
  const { selectedIncidents } = context;
  const [state, setState] = useState({
    visibleTimeout: 0,
  });

  const copySummary = () => {
    if (selectedIncidents.length >= 1) {
      let text = '';
      selectedIncidents.forEach((incident) => {
        text += ` [#${incident}]`;
      });
      text += props.incident.summary;
      navigator.clipboard.writeText(text);
    } else {
      navigator.clipboard.writeText(props.incident.summary);
    }

    dispatch({
      type: 'TOGGLE_NOTIFICATION',
      payload: {
        hidden: false,
        success: true,
        message: 'Summary copied to clipboard!',
        timeout: 3000,
      },
    });

    dispatch({
      type: 'SET_HOUR_MARK',
      payload: props.incident,
    });

    props.closeContextMenu();
  };

  const openIncidentInPagerduty = () => {
    window.open(props.incident.htmlUrl, '_blank');

    props.closeContextMenu();
  };

  const onMouseLeave = () => {
    setState({
      visibleTimeout: setTimeout(() => {
        props.closeContextMenu();
      }, 700),
    });
  };

  const onMouseEnter = () => {
    setState({
      visibleTimeout: clearTimeout(state.visibleTimeout),
    });
  };

  const showMoreDetails = () => {
    navigate(`/incident/${props.incident.id}`);
  };

  return (
    <div
      onMouseLeave={() => onMouseLeave()}
      onMouseEnter={() => onMouseEnter()}
      style={{
        top: props.cursorPosition.y - 3,
        left: props.cursorPosition.x - 3,
      }}
      className='context-menu'
    >
      <ul>
        <li onClick={() => copySummary()}>Copy summary</li>
        <li onClick={() => openIncidentInPagerduty()}>Show in pagerduty</li>
        <li onClick={() => showMoreDetails()}>Show more details</li>
      </ul>
    </div>
  );
};

ContextMenu.propTypes = {
  closeContextMenu: PropTypes.func,
  cursorPosition: PropTypes.object,
  incident: PropTypes.object,
};
export default ContextMenu;
