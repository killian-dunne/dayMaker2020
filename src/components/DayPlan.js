import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint } from '@fortawesome/free-solid-svg-icons';
import ActionSetup from './ActionSetup';
import { deletePlan } from '../utils/dbStuff';
import { enumerateHours, hourHeight, calculateTimeHeight, isToday, isTomorrow } from '../utils/lines&timer';
import { compareDates, compareTimes } from '../utils/dateStuff';
import ActionButton from './ActionButton';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {addAction} from '../utils/dbStuff';


const hourDiv = ["00", "15", "30", "45"];

class DayPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addActionStart: null,
      addActionEnd: null,
    }
    this.planDiv = React.createRef();
  }

  componentDidMount() {
    this.scrollPlan();
    let currentTimeOn = this.isCurrentDay();
  //  console.log(this.props.title, this.props.keyProp, currentTimeOn)
    if (currentTimeOn === isToday) {
      let height = calculateTimeHeight(currentTimeOn)
      this.setTimeHeight(this.props.keyProp, height);
    }
    this.props.loadActions(this.props.id);
    this.setPlanPosition();
    this.setPlanHeight();
  }

  scrollPlan = () => {
    const scroller = document.querySelector(`#day-plan-${this.props.keyProp} .scroller`);
    setTimeout(() => {
      let scrollHeight = 0;
      if (scroller) {
        if (this.isCurrentDay() === isToday) {
          let d = new Date();
          let currentTime = d.getHours() + ":" + d.getMinutes();
          if (this.props.actions.length) {
            let earlier = compareTimes(this.props.actions[0].times[0], currentTime);
            if (earlier < 1) { // use first action time
              let prevHour = parseInt(this.props.actions[0].times[0]) - 1;
              if (prevHour > 0) {
                scrollHeight = prevHour * hourHeight - 10;
              }
            } else {
              if (this.props.date.getHours() > 0) {
                scrollHeight = parseInt(currentTime) * hourHeight - 10;
              }
            }
          } else {
            scrollHeight = parseInt(currentTime) * hourHeight - 10;
          }
        } else {
          scrollHeight = 8 * hourHeight - 10;
        }
      } else {
        console.log(`couldn't find scroller`)
      }
      scroller.scrollTop = scrollHeight;
    }, 500);
  }

  isCurrentDay = () => {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (compareDates(today, this.props.date) === 0) {
      return isToday;
    } else if (compareDates(tomorrow, this.props.date) === 0) {
      return isTomorrow;
    }
    return "";
  }

  setTimeHeight = (planNo, height) => {
    const timeLine = document.querySelector(`#day-plan-${planNo} .now-time`);
    if (timeLine) {
      timeLine.classList.remove('hide');
      timeLine.style.top = `${height + 26}px`;
      const drop = document.querySelector(`#day-plan-${planNo} .drop`);
      if (drop) {
        drop.classList.remove('hide');
        drop.style.top = `${height + 21}px`;
      }
    }
  }

  openAction = e => {
    let box = e.target;
    let hour = box.closest('table').classList[1].substr(6);
    if (!box.classList.contains('clickable-time')) {
      box = box.closest('.clickable-time');
    }
    let minutes = box.classList[0];
    let minutesSubstring =  ":" + ("00" + minutes.toString()).slice(-2);
    let startTime = ("00" + hour.toString()).slice(-2) + minutesSubstring;
    let endTime = ("00" + (parseInt(hour) + 1).toString()).slice(-2) + minutesSubstring;
    this.setState({
      addActionStart: startTime,
      addActionEnd: endTime
    });
  }

  closeAction = () => {

    this.setState({
      addActionStart: null,
      addActionEnd: null
    });
  }

  getActionHeight = (startTime, endTime) => {
    let [hours, minutes] = startTime.split(':');
    let [endHours, endMinutes] = endTime.split(':');
    let height = (endHours - hours) * hourHeight + (endMinutes - minutes) * hourHeight / 60;
    return height;
  }


  actionWithStart = (hour) => {
    let possibleActions = [];
    let actions = this.props.actions; // array of these [id, data]
    let found = false;
    for (let quarter of hourDiv) {
      for (let action of actions) {
        if (action[1].times[0] === hour + ":" + quarter) {
          let startTime = action[1].times[0];
          let endTime = action[1].times[1];
          possibleActions.push([...action, this.getActionHeight(startTime, endTime)]);
          found = true;
        }
      }
      if (!found) {
        possibleActions.push(null);
      } else {
        found = false;
      }
    }
    return possibleActions;
  }

  setPlanPosition = () => {
    let position = this.props.position;
    if (position[0] === 'B') {
      this.planDiv.current.style.left = '560px';
    }
    this.planDiv.current.style.top = position.substr(1) + 'px';
  }

  setPlanHeight = () => {
    this.planDiv.current.style.height = this.props.height.toString() + 'px';
  }

  handleDelete = e => {
    e.preventDefault();
    deletePlan(this.props.id);
  }

  changeStartTime = date => {
    console.log('onChange')
    let time = ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);
    this.setState({
      addActionStart: time
    });
  }

  changeEndTime = date => {
    let time = ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);
    this.setState({
      addActionEnd: time
    });
  }

  createAction = async (text) => {
    await addAction(text, this.state.addActionStart, this.state.addActionEnd, this.props.id);
    let plans = this.state.plans;
    this.props.loadActions(this.props.id);
    this.setState({
      addActionStart: null,
      addActionEnd: null,
      plans
    });
  }

  render () {
    const times = enumerateHours();
    let lines = [];
    if (this.state.addActionStart) {
      var [addHour, addMin] = this.state.addActionStart.split(":");
      var idx = hourDiv.indexOf(addMin);
    }
    for (let i = 0; i < 30; i++) {
      let hour = ("00" + i.toString()).slice(-2);
      let a = this.actionWithStart(hour); // returns actions starting this hour
      if (addHour && addHour === hour) {
        let height = this.getActionHeight(this.state.addActionStart, this.state.addActionEnd)
        a[idx] = ['addId', {text: null}, height];
      }
      lines.push(
        <table key={i} className={`times table-${i}`}>
          <thead>
            <tr>
              <th><div>{times[i]}</div></th>
              <th onClick={this.openAction} className={`.min-${hourDiv[0]} clickable-time`}>
                {(a[0] !== null && a[0][1]) &&
                  <ActionButton height={a[0][2]} text={a[0][1].text}/>
                }
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td><td onClick={this.openAction} className={`.min-${hourDiv[1]} clickable-time`}>
                {(a[1] !== null && a[1][1]) &&
                  <ActionButton height={a[1][2]} text={a[1][1].text}/>
                }
              </td>
            </tr>
            <tr>
              <td></td><td onClick={this.openAction} className={`.min-${hourDiv[2]} clickable-time`}>
                {(a[2] !== null && a[2][1]) &&
                  <ActionButton height={a[2][2]} text={a[2][1].text}/>
                }
              </td>
            </tr>
            <tr>
              <td></td><td onClick={this.openAction} className={`.min-${hourDiv[3]} clickable-time`}>
                {(a[3] !== null && a[3][1]) &&
                  <ActionButton height={a[3][2]} text={a[3][1].text}/>
                }
              </td>
            </tr>
          </tbody>
        </table>
        );
    }
    return (
      <div id={`day-plan-${this.props.keyProp}`} className="plan-box bg-light plan-details" ref={this.planDiv}>
        <div className="title-box">
          <input value={this.props.title} className="h3 day-title" onChange={e => {this.props.renamePlan(e, this.props.id)}} onBlur={e => {this.props.updatePlan(e, this.props.id)}}/>
          <FontAwesomeIcon icon={faTrash} size="1x" className="trash-icon plan-trash hvr-buzz-out" onClick={this.handleDelete}/>
        </div>
        <div className="scroller">
          <div className="now-time hide"></div><FontAwesomeIcon icon={faTint} color="blue" className="drop hide"/>
          {lines}
        </div>
        {
          this.state.addActionStart &&
          <ActionSetup  startTime={this.state.addActionStart}
                        endTime={this.state.addActionEnd}
                        planId={this.props.id}
                        createAction={this.createAction}
                        changeStartTime={this.changeStartTime}
                        changeEndTime={this.changeEndTime}
                        closeAction={this.closeAction}
                        />
        }
      </div>
    );
  }
}

export default DayPlan;
// < Action />
