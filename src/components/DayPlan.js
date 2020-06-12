import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint } from '@fortawesome/free-solid-svg-icons';
import ActionSetup from './ActionSetup';
import { deletePlan } from '../utils/dbStuff';
import { enumerateHours, hourHeight, calculateTimeHeight, isToday, isTomorrow } from '../utils/lines&timer';
import { compareDates, compareTimes, cleanInput } from '../utils/dateStuff';
import ActionBox from './ActionBox';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { setAction, deleteAction } from '../utils/dbStuff';

export const hourDiv = ["00", "15", "30", "45"];

class DayPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addActionStart: "",
      addActionEnd: "",
      addActionText: "",
      addActionID: "",
      tempStartTime: "",
      tempEndTime: "",
      openAddAction: false,
    }
    this.planDiv = React.createRef();
  }

  componentDidMount() {
    this.scrollPlan();
    this.interval = setInterval(() => {
      let currentTimeOn = this.isCurrentDay();
      //  console.log(this.props.title, this.props.keyProp, currentTimeOn)
      if (currentTimeOn === isToday) {
        let height = calculateTimeHeight(currentTimeOn);
        this.interval = setInterval(this.setTimeHeight(this.props.keyProp, height), 30000) // every 5 mins
      }
    });
    this.setPlanPosition();
    this.setPlanHeight();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.height !== this.props.height) {
      this.setPlanHeight();
    }
    if (prevProps.position !== this.props.position) {
      this.setPlanPosition();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
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
            let earlier = compareTimes(this.props.actions[0].data.times.startTime, currentTime);
            if (earlier < 1) { // use first action time
              let prevHour = parseInt(this.props.actions[0].data.times.startTime) - 1;
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

  openAction = (e, id)=> {
    let box = e.target;
    if (!box.closest('.action-box') || (box.closest('.action-icon') && box.closest('.action-icon').classList.contains('action-edit'))) {
      let startTime, endTime, text;
      if (id) {
        this.removeAction(null, id)
        let actions = this.props.actions;
        let myAction;
        actions.forEach(action => {
          if (action.id === id) {
            myAction = action;
          }
        });
        if (myAction) {
          startTime = myAction.data.times.startTime;
          endTime = myAction.data.times.endTime;
          text = myAction.data.text;
        } else {
          startTime = endTime = text = "";
        }

      } else {
        let hour = box.closest('table').classList[1].substr(6);
        if (!box.classList.contains('clickable-time')) {
          box = box.closest('.clickable-time');
        }
        let minutes = box.classList[0];
        let minutesSubstring =  ":" + ("00" + minutes.toString()).slice(-2);
        startTime = ("00" + hour.toString()).slice(-2) + minutesSubstring;
        endTime = ("00" + (parseInt(hour) + 1).toString()).slice(-2) + minutesSubstring;
        text = "";
        id = "";
      }
      this.setState({
        addActionStart: startTime,
        tempStartTime: startTime,
        tempEndTime: endTime,
        addActionEnd: endTime,
        addActionText: text,
        id,
        openAddAction: true
      });
    }
  }

  closeAction = () => {
    this.setState({
      addActionStart: "",
      addActionEnd: "",
      tempStartTime: "",
      tempEndTime: "",
      addActionText: "",
      addActionID: "",
      openAddAction: false
    });
  }

  getActionHeight = (startTime, endTime) => {
    if (endTime === null){
      var [endHours, endMinutes] = startTime.split(":");
      endHours++;
    } else {
      var [endHours, endMinutes] = endTime.split(":");
    }
    let [hours, minutes] = startTime.split(':');
    let height = (endHours - hours) * hourHeight + (endMinutes - minutes) * hourHeight / 60;
    return height;
  }

  actionWithStart = (hour) => {
    let possibleActions = [];
    let actions = this.props.actions; // array of these [id, data]
    let found = false;
    for (let quarter of hourDiv) {
      for (let action of actions) {
        if (action.data.times.startTime === hour + ":" + quarter) {
          let startTime = action.data.times.startTime;
          let endTime = action.data.times.endTime;
          possibleActions.push([action.id, action.data, this.getActionHeight(startTime, endTime)]);
          found = true;
        }
      }
      if (!found) {
        possibleActions.push(null);
      } else {
        found = false;
      }
    }
    return possibleActions; // Array of length 4 with each entry null or
    // of the form [{id, data: {text: , completed:, ...}}, height];
  }

  setPlanPosition = () => {
    let position = this.props.position;
    if (position[0] === 'B') {
      this.planDiv.current.style.left = '50%';
    } else {
      this.planDiv.current.style.left = '0%';
    }
    this.planDiv.current.style.top = position.substr(1) + 'px';
    if (position[0] === 'C') {
      this.planDiv.current.closest('.plans-list').setAttribute('style', 'display: flex;justify-content:center;');
    }
  }

  setPlanHeight = () => {
    this.planDiv.current.style.height = this.props.height.toString() + 'px';
  }

  handleDelete = async e => {
    e.preventDefault();
    await deletePlan(this.props.id);
    this.props.removePlan(this.props.id);
  }

  changeActionText = e => {
    let text = e.target.value;
    this.setState({
      addActionText: text
    });
  }

  changeStartTime = e => {
    let time = e.target.value;
    let cleanedInput = cleanInput(time);
    if (!cleanedInput[1]) {
      this.setState({tempStartTime: cleanedInput[0]})
    }
    this.setState({
      addActionStart: time
    });
  }

  changeEndTime = e => {
    let time = e.target.value;
    let cleanedInput = cleanInput(time);
    if (!cleanedInput[1]) {
      this.setState({tempEndTime: cleanedInput[0]})
    }
    this.setState({
      addActionEnd: time
    });
  }

  addOrUpdateAction = async (text, startTime, endTime, planId, completed, actionID) => {
    if (actionID) {
      await setAction(text, startTime, endTime, planId, completed, actionID);
    } else {
      await setAction(text, this.state.addActionStart, this.state.addActionEnd, this.props.id);
    }
    await this.props.loadActions(this.props.id);
    let plans = this.state.plans;
    this.setState({
      addActionStart: "",
      addActionEnd: "",
      tempStartTime: "",
      tempEndTime: "",
      addActionText: "",
      addActionID: "",
      plans,
      openAddAction: false
    });
  }

  removeAction = async (e, id) => {
    await deleteAction(this.props.id, id);
    this.props.loadActions(this.props.id);
  }

  render () {
    const times = enumerateHours();
    let lines = [];
    if (this.state.tempStartTime) {
      var [addHour, addMin] = this.state.tempStartTime.split(":");
      var idx = hourDiv.indexOf(addMin);
    }
    for (let i = 0; i < 30; i++) {
      let hour = ("00" + i.toString()).slice(-2);
      let a = this.actionWithStart(hour); // returns actions starting this hour
      if (addHour && addHour === hour) {
        let height = this.getActionHeight(this.state.tempStartTime, this.state.tempEndTime);
        a[idx] = ['addId', {text: "", times: [this.state.tempStartTime, this.state.tempEndTime], completed: false, plan: this.props.id}, height];
      }
      lines.push(
        <table key={i} className={`times table-${i}`}>
          <thead>
            <tr>
              <th><div>{times[i]}</div></th>
              <th className={`.min-${hourDiv[0]} clickable-time`} onClick={this.openAction}>
                {(a[0] !== null && a[0][1]) &&
                  <ActionBox  height={a[0][2]}
                              text={a[0][1].text}
                              removeAction={this.removeAction}
                              editAction={this.openAction}
                              id={a[0][0]}
                              startTime={a[0][1].times.startTime}
                              endTime={a[0][1].times.endTime}
                              triggerSelect={this.selectAction}
                              date={this.props.date}
                              planID={this.props.id}
                              addOrUpdateAction={this.addOrUpdateAction}
                              plan={this.props.plan}/>
                }
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td><td className={`.min-${hourDiv[1]} clickable-time`} onClick={this.openAction}>
                {(a[1] !== null && a[1][1]) &&
                  <ActionBox  height={a[1][2]}
                              text={a[1][1].text}
                              removeAction={this.removeAction}
                              editAction={this.openAction}
                              id={a[1][0]}
                              startTime={a[1][1].times.startTime}
                              endTime={a[1][1].times.endTime}
                              triggerSelect={this.selectAction}
                              date={this.props.date}
                              planID={this.props.id}
                              addOrUpdateAction={this.addOrUpdateAction}
                              plan={this.props.plan}/>
                }
              </td>
            </tr>
            <tr>
              <td></td><td className={`.min-${hourDiv[2]} clickable-time`} onClick={this.openAction}>
                {(a[2] !== null && a[2][1]) &&
                  <ActionBox  height={a[2][2]}
                              text={a[2][1].text}
                              removeAction={this.removeAction}
                              editAction={this.openAction}
                              id={a[2][0]}
                              startTime={a[2][1].times.startTime}
                              endTime={a[2][1].times.endTime}
                              triggerSelect={this.selectAction}
                              date={this.props.date}
                              planID={this.props.id}
                              addOrUpdateAction={this.addOrUpdateAction}
                              plan={this.props.plan}/>
                }
              </td>
            </tr>
            <tr>
              <td></td><td className={`.min-${hourDiv[3]} clickable-time`} onClick={this.openAction}>
                {(a[3] !== null && a[3][1]) &&
                  <ActionBox  height={a[3][2]}
                              text={a[3][1].text}
                              removeAction={this.removeAction}
                              editAction={this.openAction}
                              id={a[3][0]}
                              startTime={a[3][1].times.startTime}
                              endTime={a[3][1].times.endTime}
                              triggerSelect={this.selectAction}
                              date={this.props.date}
                              planID={this.props.id}
                              addOrUpdateAction={this.addOrUpdateAction}
                              plan={this.props.plan}/>
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
          <FontAwesomeIcon icon={faTrash} size="1x" className="fa-icon plan-trash hvr-buzz-out" onClick={this.handleDelete}/>
        </div>
        <div className="scroller">
          <div className="now-time hide"></div><FontAwesomeIcon icon={faTint} color="blue" className="drop hide"/>
          {lines}
        </div>
        {
          this.state.openAddAction &&
          <ActionSetup  startTime={this.state.addActionStart}
                        endTime={this.state.addActionEnd}
                        planId={this.props.id}
                        createAction={this.addOrUpdateAction}
                        changeStartTime={this.changeStartTime}
                        changeEndTime={this.changeEndTime}
                        closeAction={this.closeAction}
                        text={this.state.addActionText}
                        changeText={this.changeActionText}
                        actionID={this.state.addActionID}
                        updateAction={this.addOrUpdateAction}
                        date={this.props.date}
                        openAddAction={this.state.openAddAction}
                        />
        }
      </div>
    );
  }
}

export default DayPlan;
// < Action />
