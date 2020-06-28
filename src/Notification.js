import React, { PureComponent } from "react";
import "./notification.css";

class Notification extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      !this.props.hidden && (
        <div
          className={`notification ${this.props.success ? "success" : "error"}`}
        >
          <p>{this.props.success ? "Success!" : "Error!"}</p>
          <p>{this.props.message}</p>
        </div>
      )
    );
  }
}

export default Notification;
