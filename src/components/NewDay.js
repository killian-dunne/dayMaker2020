import React from 'react'
import Calendar from './Calendar';
var dateFormat = require('dateformat');



class NewDay extends React.Component {
  constructor(props) {
    super(props);
    const d = new Date();
    const date = this.displayDate(d);
    this.state = {
      seconds: 0,
      stopwatchString: this.displayStopwatch(0),
      date: date,
    }
  }
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  displayDate = (d) => {
    return dateFormat(d, "ddd, dS mmm yyyy, h:MM TT");
  }

  displayStopwatch = (sec) => {
    let output = `Planning time: `;
    let hours = Math.floor(sec/3600);
    let minutes = Math.floor(sec/60);
    let secondsString = '';
    if (minutes > 0) {
      if (hours > 0) {
        let hoursString = ("00" + hours).slice(-2);
        output += hoursString + ":";
      }
      let minutesString = '';
      if (minutes > 9) {
        minutesString = ("00" + (minutes%60)).slice(-2);
      } else {
        minutesString = minutes.toString();
      }
      output += minutesString + ":";
      secondsString = ("00" + (sec%60)).slice(-2);
    } else {
      secondsString = (sec%60).toString();
    }
    output += secondsString + "."
    return output;
  }

  tick = () => {
    const date = this.displayDate(new Date());
    const stopwatchString = this.displayStopwatch(this.state.seconds);
    this.setState((state, props) => ({
      stopwatchString: stopwatchString,
      seconds: state.seconds + 1,
      date: date
    }))
  }

  render () {
    return(
      <div>
        <div className="time">
            <span>{this.state.stopwatchString}</span>
          <h4>{this.state.date}</h4>
        </div>
        <h3>Add Day</h3>
        <Calendar />
      </div>
    );
  }
}

export default NewDay;
