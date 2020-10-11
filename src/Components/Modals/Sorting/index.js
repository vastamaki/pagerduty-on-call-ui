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
          by: 'serviceName',
          direction: 'asc',
        },
        times: {
          by: 'createdAt',
          direction: 'asc',
        },
      },
    };
  }

  handleCheckboxChange = (e) => {
    const { alt: type, name } = e.target;
    this.setState({
      sorting: {
        ...this.state.sorting,
        [type]: {
          ...this.state.sorting[type],
          by: name,
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
            by: 'serviceName',
            active: false,
          },
        },
      });
    } else {
      this.setState({
        sorting: {
          ...this.state.sorting,
          names: {
            ...this.state.sorting.names,
            by: 'serviceName',
            direction: state,
            active: true,
          },
        },
      });
    }
  };

  getNameSortingSelection = () => {
    if (!this.state.sorting.names.active) return false;
    return this.state.sorting.names.direction;
  };

  handleSave = async () => {
    const { dispatch } = this.context;
    await changeSorting(this.state.sorting)(dispatch);
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
                name="createdAt"
                alt="times"
                onChange={(e) => this.handleCheckboxChange(e)
                }
                checked={this.state.sorting.times.by === 'createdAt' || false}
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
                name="latestChange"
                alt="times"
                onChange={(e) => this.handleCheckboxChange(e)
                }
                checked={this.state.sorting.times.by === 'latestChange' || false}
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
