import React from 'react'
import { displayStopwatch, displayDate, titleDate } from '../utils/dateStuff';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addPlan } from '../utils/dbStuff';

class NewDay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      stopwatchString: displayStopwatch(0),
      currentDate: new Date(),
      planDate: new Date(),
      planTitle: '',
      displayNotification: 'none',
      displayNotificationText: 'Plan created!'
    }
    this.dateRef = React.createRef();
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
    if (this.state.planTitle) {
      this.setState({
        displayNotification: 'block',
        planTitle: '',
        planDate: new Date(),
      });
      await addPlan(this.state.planTitle, this.state.planDate);
      this.props.updatePlans();
    } else {
      this.setState({
        displayNotification: 'block',
        planTitle: '',
        planDate: new Date(),
        displayNotificationText: 'Add a title!'
      })
    }

    setTimeout(() => {
      this.setState({
        displayNotification: 'none',
        displayNotificationText: 'Plan created!'
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
    let buttonEnable;
    if (this.props.user) {
      buttonEnable = false;
    } else {
      buttonEnable = true;
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
            <DatePicker inline selected={this.state.planDate} onSelect={this.handleSelect} ref={this.dateRef} autoFocus/>
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
