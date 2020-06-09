import React from 'react';
import DatePicker from 'react-datepicker';
import { setAction } from '../utils/dbStuff';

const ActionSetup = (props) => {
  const handleSubmit = e => {
    e.preventDefault();
    if (props.actionID) {
      props.updateAcion(props.text, props.startTime, props.endTime, props.planId, props.completed, props.actionID);
    } else {
      props.createAction(props.text);
    }
  }

  document.addEventListener('keydown', e => {
    if (props.startTime && e.code === 'Escape') {
      props.closeAction();
    }
  }, {once: true});

  return (
    <div id="action-setup-modal" className="modal">
      <div className="action-setup-content">
        <span className="times" onClick={props.closeAction}>&times;</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Task" value={props.text} name="text" onChange={props.changeText}/>
          <DatePicker
            value={props.startTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Start"
            dateFormat="hh:mm"
            onChange={props.changeStartTime}
            className="start-time"
          /><br/>
          <DatePicker
            value={props.endTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="End"
            dateFormat="hh:mm"
            onChange={props.changeEndTime}
            className="end-time"
          /><br/>
        <button type="submit" className="btn btn-outline-warning">Save</button>
        </form>
      </div>
    </div>
  );
}

export default ActionSetup
