import React, { PureComponent } from 'react';
import { changeModalState, changeSorting } from '../../../Context/actions';
import { Context } from '../../../Context';

class Sorting extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: {
        createdAt: true,
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
      modal: 'sorting',
      state: false,
    })(dispatch);
    changeSorting(
      this.state.sortBy.createdAt ? 'createdAt' : 'updatedAt',
    )(dispatch);
  };

  componentDidMount = () => {
    const sortBy = localStorage.getItem('sortBy');
    if (sortBy) {
      this.setState({
        sortBy: JSON.parse(sortBy),
      });
    }
  };

  render() {
    return (
      <React.Fragment>
          <h2>Incident sorting</h2>
          <ul>
            <li>
              <p>
                <input
                  type="radio"
                  id="switch1"
                  onChange={(e) => this.handleCheckboxChange(e, 'createdAt')}
                  checked={this.state.sortBy.createdAt || false}
                />
                <label className="radio-label" htmlFor="switch1" />
                Sort by created at
              </p>
            </li>
            <li>
              <p>
                <input
                  type="radio"
                  id="switch2"
                  onChange={(e) => this.handleCheckboxChange(e, 'updatedAt')}
                  checked={this.state.sortBy.updatedAt || false}
                />
                <label className="radio-label" htmlFor="switch2" />
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
        </React.Fragment>
    );
  }
}
Sorting.contextType = Context;
export default Sorting;
