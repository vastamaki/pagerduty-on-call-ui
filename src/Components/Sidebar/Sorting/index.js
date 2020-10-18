import React, { useContext } from 'react';
import { changeSorting } from '../../../Context/actions';
import { Context } from '../../../Context';

const Sorting = () => {
  const { dispatch, sorting } = useContext(Context);

  const handleCheckboxChange = async (e) => {
    const { alt: type, name } = e.target;
    await changeSorting({
      ...sorting,
      [type]: {
        ...sorting[type],
        by: name,
      },
    })(dispatch);
    localStorage.setItem(
      'sorting',
      JSON.stringify({
        ...sorting,
        [type]: {
          ...sorting[type],
          by: name,
        },
      }),
    );
  };

  const changeNameSorting = async (e) => {
    const state = e.target[e.target.selectedIndex].value;
    if (state === 'disabled') {
      await changeSorting({
        ...sorting,
        names: {
          ...sorting.names,
          by: 'serviceName',
          active: false,
        },
      })(dispatch);
      localStorage.setItem(
        'sorting',
        JSON.stringify({
          ...sorting,
          names: {
            ...sorting.names,
            by: 'serviceName',
            active: false,
          },
        }),
      );
    } else {
      await changeSorting({
        ...sorting,
        names: {
          ...sorting.names,
          by: 'serviceName',
          direction: state,
          active: true,
        },
      })(dispatch);
      localStorage.setItem(
        'sorting',
        JSON.stringify({
          ...sorting,
          names: {
            ...sorting.names,
            by: 'serviceName',
            direction: state,
            active: true,
          },
        }),
      );
    }
  };

  const getNameSortingSelection = () => {
    if (!sorting.names?.active) return false;
    return sorting.names.direction;
  };

  return (
    <div className="sorting">
      <h2>Incident sorting</h2>
      <div>
        <input
          type="radio"
          id="switch1"
          name="createdAt"
          alt="times"
          onChange={(e) => handleCheckboxChange(e)}
          checked={sorting.times?.by === 'createdAt' || false}
        />
        <label className="radio-label" htmlFor="switch1" />
        <p>By created at</p>
      </div>
      <div>
        <input
          type="radio"
          id="switch2"
          name="latestChange"
          alt="times"
          onChange={(e) => handleCheckboxChange(e)}
          checked={sorting.times?.by === 'latestChange' || false}
        />
        <label className="radio-label" htmlFor="switch2" />
        <p>By last status change</p>
      </div>
      <hr id="sorting" />
      <h4>Sort by service name</h4>
      <div className="dropdown">
        <select
          onChange={(e) => changeNameSorting(e)}
          className="input"
          name="sort-by-name"
          id="sort-by-name"
          value={getNameSortingSelection()}
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
    </div>
  );
};
export default Sorting;