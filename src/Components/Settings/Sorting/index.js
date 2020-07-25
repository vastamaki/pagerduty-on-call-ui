import React, { PureComponent } from "react";
import { changeModalState } from "../../../Context/actions";
import { Context } from "../../../Context";
import "./index.css";

class Sorting extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: {
        createdAt: false,
        updatedAt: false,
      },
    };
  }

  handleCheckboxChange = (e, name) => {
    this.setState({
      sortBy: {
        [name]: e.target.checked,
      },
    });
  };

  handleSave = () => {
    const { dispatch } = this.context;
    changeModalState({
      modal: "sorting",
      state: false,
    })(dispatch);
  };

  componentDidMount = () => {};

  render() {
    const { openModals } = this.context;

    return openModals.sorting ? (
      <div className="card-settings-wrapper">
        <div className="card-settings">
          <h2>Incident sorting</h2>
          <ul>
            <li>
              <p>
                <input
                  type="checkbox"
                  id="switch1"
                  onChange={(e) => this.handleCheckboxChange(e, "createdAt")}
                  checked={this.state.sortBy.createdAt}
                />
                <label for="switch1" />
                Sort by created at
              </p>
            </li>
            <li>
              <p>
                <input
                  type="checkbox"
                  id="switch2"
                  onChange={(e) => this.handleCheckboxChange(e, "updatedAt")}
                  checked={this.state.sortBy.updatedAt}
                />
                <label for="switch2" />
                Sort by last status change
              </p>
            </li>
          </ul>
          <input
            onClick={() => this.handleSave()}
            className="submit"
            type="submit"
            value="Save"
          />
        </div>
      </div>
    ) : null;
  }
}
Sorting.contextType = Context;
export default Sorting;
