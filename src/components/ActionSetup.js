import React, { useEffect, useRef} from 'react';
import DatePicker from 'react-datepicker';
import { setAction } from '../utils/dbStuff';
import { timeAddition, hourMinToString, roundTime, cleanInput, isLater } from '../utils/dateStuff';

const ActionSetup = (props) => {

  const setupContent = useRef(null);
  const firstTimeInput = useRef(null);
  const secondTimeInput = useRef(null);

  useEffect(() => {
    setupContent.current.focus();
    document.addEventListener('keydown', e => {
      if (props.openAddAction && e.code === 'Escape') {
        props.closeAction();
      }
    });
  }, [])


  const handleSubmit = e => {
    e.preventDefault();
    if (props.actionID) {
      props.updateAcion(props.text, props.startTime, props.endTime, props.planId, props.completed, props.actionID);
    } else {
      props.createAction(props.text);
    }
  }

  const getMinTime = () => {
    let date = new Date(props.date.getTime());
    let [startHour, startMin] = props.startTime.split(":");
    return new Date(date.setHours(startHour, startMin, 0));
  }

  const getMaxTime = () => {
    let tomorrow = new Date(props.date.getTime());
    tomorrow.setDate(new Date().getDate() + 1);
    return new Date(tomorrow.setHours(6, 0, 0));
  }

  const adjustTime = e => {
    let time = e.target.value;
    let [cleanedTime, problem] = cleanInput(time);
    if (!problem) {
      if (e.key === 'Enter') {
        console.log(e.target.value);
        console.log(e.target)
        console.log(e.target.selected);
      } else if (e.keyCode === 38) {
        let updatedTime = timeAddition(cleanedTime, 15);
        e.target.value = updatedTime;
        e.target.focus();
      } else if (e.keyCode === 40) {
        let updatedTime = timeAddition(cleanedTime, -15);
        e.target.value = updatedTime;
        e.target.focus();
      }
    }

  }

  const handleInput = e => {
    let [text, problem] = cleanInput(e.target.value);
    if (problem) { // Input is well formatted
      e.target.nextSibling.classList.toggle('hide');
      e.target.nextSibling.textContent = text;
    } else {
      let [output, error] = isLater(firstTimeInput.current.value, text);
      let secondErrDiv = e.target.nextSibling.nextSibling;
      let firstInput = e.target === firstTimeInput.current;
      if (!firstInput && error) { // Second input is not after first
        secondErrDiv.classList.remove('hide');
        secondErrDiv.textContent = output;
      } else {
        if (!secondErrDiv.classList.contains('hide') && secondErrDiv.classList.contains('time-error')) {
          secondErrDiv.classList.add('hide');
        }
        e.target.value = text;
        if (firstInput) {
          props.changeStartTime(e);
        } else {
          props.changeEndTime(e);
        }
      }
      if (!e.target.nextSibling.classList.contains('hide')) {
        e.target.nextSibling.classList.add('hide');
      }
    }
  }

  return (
    <div id="action-setup-modal" className="modal">
      <div className="action-setup-content">
        <span className="times" onClick={props.closeAction}>&times;</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Task" value={props.text} name="text" onChange={props.changeText} ref={setupContent}/>
          <input  className="time-input start-time"
                  type="text"
                  placeholder="Start Time"
                  value={props.startTime}
                  name="start-time"
                  onKeyDown={adjustTime}
                  onChange={props.changeStartTime}
                  onBlur={handleInput}
                  ref={firstTimeInput}/>
          <div className="time-error hide first-error">
            Type a number in the form hh:mm, eg. 09:30.
          </div>
          <br/>
          <input  className="time-input end-time"
                  type="text"
                  placeholder="End Time"
                  value={props.endTime}
                  name="end-time"
                  onKeyDown={adjustTime}
                  onChange={props.changeEndTime}
                  onBlur={handleInput}
                  ref={secondTimeInput}/>
          <div className="time-error hide second-error">
            Type a number in the form hh:mm, eg. 09:30.
          </div>
          <div className="time-error hide third-error">
            Compare this time to the start time.
          </div>

        <button type="submit" className="btn btn-outline-warning">Save</button>
        </form>
      </div>
    </div>
  );
}

export default ActionSetup
