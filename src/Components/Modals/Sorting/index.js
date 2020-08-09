import React, { PureComponent } from 'react';
import { changeModalState, changeSorting } from '../../../Context/actions';
import { Context } from '../../../Context';
import './index.css';

class Sorting extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sorting: {
        names: {
          serviceName: false,
          direction: 'asc',
        },
        times: {
          createdAt: true,
          updatedAt: false,
          direction: 'asc',
        },
      },
    };
  }

  handleCheckboxChange = (e, name, type) => {
    this.setState({
      sorting: {
        ...this.state.sorting,
        [type]: {
          [name]: e.target.checked,
        },
      },
    });
  };

  changeNameSorting = (e) => {
    const state = e.target[e.target.selectedIndex].value;
    if (state === 'disabled') {
      this.setState({
        sorting: {
          ...this.state.sorting,
          names: {
            ...this.state.sorting.names,
            serviceName: false,
          },
        },
      });
    } else {
      this.setState({
        sorting: {
          ...this.state.sorting,
          names: {
            ...this.state.sorting.names,
            serviceName: true,
            direction: state,
          },
        },
      });
    }
  };

  getNameSortingSelection = () => {
    if (!this.state.sorting.names.serviceName) return false;
    return this.state.sorting.names.direction;
  };

  handleSave = async () => {
    const { dispatch } = this.context;
    if (
      JSON.stringify(this.state.sorting) !== localStorage.getItem('sorting')
    ) {
      await changeSorting(this.state.sorting)(dispatch);
    }
    localStorage.setItem('sorting', JSON.stringify(this.state.sorting));
    changeModalState({
      modal: 'sorting',
      state: false,
    })(dispatch);
  };

  componentDidMount = () => {
    const { sorting } = this.context;
    this.setState({
      sorting,
    });
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
                onChange={(e) => this.handleCheckboxChange(e, 'createdAt', 'times')
                }
                checked={this.state.sorting.times.createdAt || false}
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
                onChange={(e) => this.handleCheckboxChange(e, 'updatedAt', 'times')
                }
                checked={this.state.sorting.times.updatedAt || false}
              />
              <label className="radio-label" htmlFor="switch2" />
              Sort by last status change
            </p>
          </li>
          <hr id="sorting" />
          <li>
            <h4>Sort by service name</h4>
            <div className="dropdown">
              <select
                onChange={(e) => this.changeNameSorting(e)}
                className="input"
                name="sort-by-name"
                id="sort-by-name"
                value={this.getNameSortingSelection()}
              >
                <option value={'disabled'} name={'disabled'}>
                  Disabled
                </option>
                <option value={'asc'} name={'asc'}>
                  Ascending
                </option>
                <option value={'desc'} name={'desc'}>
                  Descending
                </option>
              </select>
            </div>
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
