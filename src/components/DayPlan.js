import React from 'react';
import Action from './Action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint } from '@fortawesome/free-solid-svg-icons';
import ActionSetup from './ActionSetup';
import { getActions } from '../utils/dbStuff';
import { enumerateHours, hourHeight, calculateTimeHeight, isToday, isTomorrow } from '../utils/lines&timer';
import { compareDates, compareTimes } from '../utils/dateStuff';
import ActionButton from './ActionButton';
import { faTrash } from '@fortawesome/free-solid-svg-icons'


const hourDiv = ["00", "15", "30", "45"];

class DayPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.date,
      title: props.plan.title,
      actions: [],
      addActionStart: null
    }
    this.planDiv = React.createRef();
  }

  componentDidMount() {
    this.scrollPlan();
    let currentTimeOn = this.isCurrentDay();
    if (currentTimeOn) {
      let height = calculateTimeHeight(currentTimeOn)
      this.setTimeHeight(this.props.keyProp, height);
    }
    this.loadActions();
    this.setPlanPosition();
    this.setPlanHeight();
  }

  loadActions = async () => {
    let myActions = await getActions(this.props.id)
    this.setState({
        actions: myActions
      });
  }

  scrollPlan = () => {
    const scroller = document.querySelector(`#day-plan-${this.props.keyProp} .scroller`);
    setTimeout(() => {
      let scrollHeight = 0;
      if (scroller) {
        if (this.isCurrentDay() === isToday) {
          let d = new Date();
          let currentTime = d.getHours() + ":" + d.getMinutes();
          if (this.state.actions.length) {
            let earlier = compareTimes(this.state.actions[0].times[0], currentTime);
            if (earlier < 1) { // use first action time
              let prevHour = parseInt(this.state.actions[0].times[0]) - 1;
              if (prevHour > 0) {
                scrollHeight = prevHour * hourHeight - 10;
              }
            } else {
              if (this.state.date.getHours() > 0) {
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
    if (compareDates(today, this.state.date) === 0) {
      return isToday;
    } else if (compareDates(tomorrow, this.state.date) === 0) {
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

  renamePlan = (e) => {
    this.setState({
      title: e.target.value
    });
  }

  openAction = e => {
    let box = e.target;
    let hour = box.closest('table').classList[1].substr(6);
    let minutes = box.classList[0];
    let startTime = ("00" + hour.toString()).slice(-2) + ":" + ("00" + minutes.toString()).slice(-2);
    this.setState({
      addActionStart: startTime
    }, () => {
      document.querySelector('#action-setup-modal').style.display = 'block';
      let button = box.querySelector('button');
      button.style.top = (minutes * hourHeight / 60) + "px";
    })
  }

  getActionHeight = (startTime, endTime) => {
    let [hours, minutes] = startTime.split(':');
    let [endHours, endMinutes] = endTime.split(':');
    let height = (endHours - hours) * hourHeight + (endMinutes - minutes) * hourHeight / 60;
    return height;
  }

  closeAction = () => {
    this.setState({
      addActionStart: null
    });
  }

  actionWithStart = (hour) => {
    let possibleActions = [];
    let actions = this.state.actions; // [id, data]
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

  render () {
    const times = enumerateHours();
    let lines = [];
    for (let i = 0; i < 30; i++) {
      let hour = ("00" + i.toString()).slice(-2);
      let a = this.actionWithStart(hour); // returns actions starting this hour
      lines.push(
        <table key={i} className={`times table-${i}`}>
          <thead>
            <tr>
              <th><div>{times[i]}</div></th>
              <th onClick={this.openAction} className={`.min-${hourDiv[0]}`}>
                {(a[0] !== null && a[0][1]) &&
                  <ActionButton height={a[0][2]} text={a[0][1].text}/>
                }
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td><td onClick={this.openAction} className={`.min-${hourDiv[1]}`}>
                {(a[1] !== null && a[1][1]) &&
                  <ActionButton height={a[1][2]} text={a[1][1].text}/>
                }
              </td>
            </tr>
            <tr>
              <td></td><td onClick={this.openAction} className={`.min-${hourDiv[2]}`}>
                {(a[2] !== null && a[2][1]) &&
                  <ActionButton height={a[2][2]} text={a[2][1].text}/>
                }
              </td>
            </tr>
            <tr>
              <td></td><td onClick={this.openAction} className={`.min-${hourDiv[3]}`}>
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
          <input value={this.state.title} className="h3 day-title" onChange={this.renamePlan}/>
          <FontAwesomeIcon icon={faTrash} size="1x" className="trash-icon plan-trash hvr-buzz-out"/>
        </div>
        <div className="scroller">
          <div className="now-time hide"></div><FontAwesomeIcon icon={faTint} color="blue" className="drop hide"/>
          {lines}
        </div>
        {
          this.state.addActionStart &&
          <ActionSetup startTime={this.state.addActionStart} planId={this.props.id} closeAction={this.closeAction}/>
        }
      </div>
    );
  }
}

export default DayPlan;
// < Action />
