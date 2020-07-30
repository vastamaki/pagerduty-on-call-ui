import React, { PureComponent } from 'react';
import { Context } from '../../Context';
import Cards from './Cards';
import Filters from './Filters';
import Settings from './Settings';
import Teams from './Teams';
import Sorting from './Sorting';
import './index.css';

class Modals extends PureComponent {
  render() {
    const { openModals } = this.context;
    return Object.values(openModals).some((key) => key === true) && (
      <div className="modal-wrapper">
        <div className="modal">
          {openModals.teams && <Teams />}
          {openModals.cardSettings && <Cards />}
          {openModals.filters && <Filters />}
          {openModals.sorting && <Sorting />}
          {openModals.settings && <Settings />}
        </div>
      </div>
    );
  }
}

Modals.contextType = Context;
export default Modals;
