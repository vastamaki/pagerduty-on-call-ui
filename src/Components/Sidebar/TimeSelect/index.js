import React, { useContext } from 'react';
import { startOfDay, endOfDay } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import fi from 'date-fns/locale/fi';
import en from 'date-fns/locale/en-US';
import { fetchIncidents } from '../../../Context/actions';
import { Context } from '../../../Context';
import 'react-datepicker/dist/react-datepicker.css';

const language = window.navigator.language === 'fi' ? 'fi' : 'en-US';
const locales = {
  fi,
  'en-US': en,
};

registerLocale(language, locales[language]);

const TimeSelect = () => {
  const [context, dispatch] = useContext(Context);
  const {
    sorting, selectedTeam, startDate, endDate,
  } = context;
  const handleDayChange = (date, option) => {
    const selectedDate = option === 'startDate' ? startOfDay(date) : endOfDay(date);
    dispatch({
      type: 'SET_DATE_RANGE',
      payload: {
        date: selectedDate,
        option,
      },
    });
  };

  return (
    <div className="time-picker">
      <h2>Date range</h2>
      <div className="range">
        <h3>Start time</h3>
        <DatePicker
          className="input"
          locale={language}
          selected={startDate}
          onChange={(e) => handleDayChange(e, 'startDate')}
        />
        <h3>End time</h3>
        <DatePicker
          className="input"
          locale={language}
          selected={endDate}
          onChange={(e) => handleDayChange(e, 'endDate')}
        />
      </div>
      <input
        onClick={() => {
          dispatch({
            type: 'SET_LOADING',
            payload: true,
          });
          fetchIncidents({
            sorting,
            selectedTeam,
            startDate,
            endDate,
            dispatch,
          });
        }
        }
        className="submit"
        type="submit"
        value="Get Incidents"
      />
    </div>
  );
};

export default TimeSelect;
