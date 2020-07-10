import React, { PureComponent } from 'react';
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import fi from 'date-fns/locale/fi';
import en from 'date-fns/locale/en-US';

const language = window.navigator.language === 'fi' ? 'fi' : 'en-US';
const locales = {
  fi,
  'en-US': en
};

registerLocale(language, locales[language]);

class TimeSelect extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
      endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    };
  }

  handleDayChange = (date, option) => {
    this.setState({
      [option]: option === 'startDate' ? startOfDay(date) : endOfDay(date),
    });
  };

  render() {
    return (
      <div className="wrapper">
        <h3>Start time</h3>
        <DatePicker
          className="input"
          locale={language}
          selected={this.state.startDate}
          onChange={(e) => this.handleDayChange(e, 'startDate')}
        />
        <h3>End time</h3>
        <DatePicker
          className="input"
          locale={language}
          selected={this.state.endDate}
          onChange={(e) => this.handleDayChange(e, 'endDate')}
        />
        <input
          onClick={() => this.props.getIncidents(this.state.startDate, this.state.endDate, true)}
          className="submit"
          type="submit"
          value="Get Incidents"
        />
      </div>
    );
  }
}

export default TimeSelect;
