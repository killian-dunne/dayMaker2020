import React from 'react';
import Action from './Action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTint } from '@fortawesome/free-solid-svg-icons'

let isToday = "current-time";
let isTomorrow = "tomorrow-time";

class DayPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.date,
      title: props.title,
      actions: props.actions
    }
  }

  componentDidMount() {
    setTimeout(this.scrollPlans(), 500);
    let currentTimeOn = this.isCurrentDay();
    if (currentTimeOn) {
      let height = this.calculateTimeHeight(currentTimeOn)
      this.setTimeHeight(this.props.keyProp, height);
    }

  }

  scrollPlans = () => {
    if (this.isCurrentDay() === isToday) {
      const scroller = document.querySelector(`#day-plan-${this.props.keyProp} .scroller`);
      if (scroller) {
        if (this.state.date.getHours() >= 1) {
          scroller.scrollTop = this.state.date.getHours() * 52.8 - 10;
        } else {
          //console.log('no scrolling needed')
        }
      } else {
        console.log(`couldn't find scroller`)
      }
    }
  }

  getTimes = () => {
    let times = [];
    for (let i = 0; i < 24; i++) {
      times.push(("00" + i).slice(-2) + ":00");
    }
    for (let j = 0; j < 6; j++) {
      times.push(("00" + j).slice(-2) + ":00");
    }
    return times;
  }

  isCurrentDay = () => {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (this.compareDates(today, this.state.date)) {
      return isToday;
    } else if (this.compareDates(tomorrow, this.state.date)) {
      return isTomorrow;
    }
    return "";
  }

  compareDates = (date1, date2) => {
    date1.setHours(0,0,0,0);
    date2.setHours(0,0,0,0);
    return date1.getTime() === date2.getTime();
  }

  calculateTimeHeight = (day) => {
    let d = new Date();
    if (day === isToday) {
      // each hour is about 52.8px
      return 52.8 * ( d.getHours() + d.getMinutes() / 60);
    } else if (day === isTomorrow) {
      return 52.8 * (24 + d.getHours() + d.getMinutes() / 60);
    }
    return null;
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

  changeTitle = (e) => {
    this.setState({
      title: e.target.value
    });
  }

  render () {
    const times = this.getTimes();
    let lines = [];

    for (let i = 0; i < 30; i++) {
      lines.push(
        <table key={i} className="times">
          <thead>
            <tr>
              <th><div>{times[i]}</div></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td><td></td>
            </tr>
            <tr>
              <td></td><td></td>
            </tr>
            <tr>
              <td></td><td></td>
            </tr>
          </tbody>
        </table>
        );
    }
    return (
      <div id={`day-plan-${this.props.keyProp}`} className="plan-box bg-light plan-details">
        <div className="title-box">
          <input value={this.state.title} className="h3 day-title" onChange={this.changeTitle}/>
        </div>
        <div className="scroller">
          <div className="now-time hide"></div><FontAwesomeIcon icon={faTint} color="blue" className="drop hide"/>
          {lines}
        </div>
      </div>
    );
  }
}

export default DayPlan;
// < Action />
