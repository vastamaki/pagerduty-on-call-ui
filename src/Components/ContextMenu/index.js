import React, { PureComponent } from 'react';
import * as PropTypes from 'prop-types';
import { markHour, toggleNotification } from '../../Context/actions';
import { Context } from '../../Context';
import './index.css';

class ContextMenu extends PureComponent {
  state = {
    visibleTimeout: 0,
  };

  copySummary = () => {
    const { dispatch } = this.context;

    navigator.clipboard.writeText(this.props.incident.summary);

    toggleNotification({
      hidden: false,
      success: true,
      message: 'Summary copied to clipboard!',
      timeout: 3000,
    })(dispatch);

    markHour(this.props.incident)(dispatch);

    this.props.closeContextMenu();
  };

  openIncidentInPagerduty = () => {
    window.open(this.props.incident.html_url, '_blank');

    this.props.closeContextMenu();
  };

  onMouseLeave = () => {
    this.setState({
      visibleTimeout: setTimeout(() => {
        this.props.closeContextMenu();
      }, 700),
    });
  };

  onMouseEnter = () => {
    this.setState({
      visibleTimeout: clearTimeout(this.state.visibleTimeout),
    });
  };

  render() {
    return (
      <div
        onMouseLeave={() => this.onMouseLeave()}
        onMouseEnter={() => this.onMouseEnter()}
        style={{
          top: this.props.cursorPosition.y - 3,
          left: this.props.cursorPosition.x - 3,
        }}
        className="context-menu"
      >
        <ul>
          <li onClick={() => this.copySummary()}>Copy summary</li>
          <li onClick={() => this.openIncidentInPagerduty()}>
            Show in pagerduty
          </li>
        </ul>
      </div>
    );
  }
}

ContextMenu.contextType = Context;
ContextMenu.propTypes = {
  closeContextMenu: PropTypes.func,
  cursorPosition: PropTypes.object,
  incident: PropTypes.object,
};
export default ContextMenu;
