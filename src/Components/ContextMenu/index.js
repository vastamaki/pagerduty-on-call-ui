import React, { useState, useContext } from 'react';
import * as PropTypes from 'prop-types';
import { markHour, toggleNotification } from '../../Context/actions';
import { Context } from '../../Context';
import './index.scss';

const ContextMenu = (props) => {
  const { dispatch, selectedIncidents } = useContext(Context);
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

    toggleNotification({
      hidden: false,
      success: true,
      message: 'Summary copied to clipboard!',
      timeout: 3000,
    })(dispatch);

    markHour(props.incident)(dispatch);

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

  return (
    <div
      onMouseLeave={() => onMouseLeave()}
      onMouseEnter={() => onMouseEnter()}
      style={{
        top: props.cursorPosition.y - 3,
        left: props.cursorPosition.x - 3,
      }}
      className="context-menu"
    >
      <ul>
        <li onClick={() => copySummary()}>Copy summary</li>
        <li onClick={() => openIncidentInPagerduty()}>Show in pagerduty</li>
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
