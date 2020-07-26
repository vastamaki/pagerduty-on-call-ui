import React, { PureComponent } from 'react';
import { Context } from '../../Context';
import Cards from './Cards';
import Filters from './Filters';
import Settings from './Settings';
import Teams from './Teams';

class Modals extends PureComponent {
  render() {
    const { openModals } = this.context;
    if (openModals.teams) {
      return <Teams />;
    }
    if (openModals.cards) {
      return <Cards />;
    }
    if (openModals.filters) {
      return <Filters />;
    }
    if (openModals.settings) {
      return <Settings />;
    }
    return null;
  }
}

Modals.contextType = Context;
export default Modals;
