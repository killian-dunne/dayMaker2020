import React from 'react'
import { displayStopwatch, displayDate, titleDate } from '../utils/dateStuff';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addPlan } from '../utils/dbStuff';
import { updatePlans } from './Dashboard';
import Dashboard from './Dashboard';

class NewDay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      stopwatchString: displayStopwatch(0),
      currentDate: new Date(),
      planDate: new Date(),
      planTitle: '',
      displayNotification: 'none'
    }
  }
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSelect = planDate => {
    this.setState({
      planDate: planDate
    });
    const title = document.querySelector('.new-title');
    if (title) {
      if (!title.value) {
        this.setState({planTitle: titleDate(planDate)});
      }
    }
  }

  handleInput = e => {
    this.setState({planTitle: e.target.value});
  }

  handleSubmit = async e => {
    e.preventDefault();
    await addPlan(this.state.planTitle, this.state.planDate);
    this.setState({
      displayNotification: 'block'
    });
    Dashboard.forceUpdate();
    setTimeout(() => {
      this.setState({
        displayNotification: 'none'
      });
    }, 5000);
  }

  tick = () => {
    const stopwatchString = displayStopwatch(this.state.seconds);
    this.setState((state, props) => ({
      stopwatchString: stopwatchString,
      seconds: state.seconds + 1,
      currentDate: new Date()
    }))
  }

  render () {
    if (this.props.user) {
      var buttonEnable = false;
    } else {
      var buttonEnable = true;
    }
    const dateString = displayDate(this.state.currentDate);
    return(
      <div>
        <div className="time">
          <span>{this.state.stopwatchString}</span>
          <h4>{dateString}</h4>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-center">
            <DatePicker inline selected={this.state.planDate} onSelect={this.handleSelect} className="red-border"/>
            <input className="new-title form-control" type="text" value={this.state.planTitle} placeholder="Plan title" onChange={this.handleInput}/>
            <div className="tooltip-container">
              <button className="btn btn-outline-warning" disabled={buttonEnable} type="submit">Create</button>
            </div>
          </div>
        </form>
        <div className="plan-created" style={{display: this.state.displayNotification}}>
          Plan created!
        </div>
      </div>
    );
  }
}

export default NewDay;
