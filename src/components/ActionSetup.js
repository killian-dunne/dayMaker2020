import React from 'react';
import DatePicker from 'react-datepicker';
import {addAction} from '../utils/dbStuff';

class ActionSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      startTime: this.props.startTime,
      endTime: this.getNextHour(this.props.startTime)
    };
    this.actionTitle = React.createRef();
  }

  handleSubmit = async e => {
    e.preventDefault();
    await addAction(
        this.state.text,
        this.state.startTime,
        this.state.endTime,
        this.props.planId);
    this.props.closeAction();
  }

  changeText = e => {
    this.setState({
      text: e.target.value
    });
  }

  changeStartTime = date => {
    let time = ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);
    this.setState({
      startTime: time
    });
  }

  changeEndTime = date => {
    let time = ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);
    this.setState({
      endTime: time
    });
  }

  getNextHour = (time) => {
    let addHour = parseInt(time) + 1;
    addHour %= 24;
    return ("00" + addHour.toString()).slice(-2) + time.substr(2);
  }

  render () {
    let nextHour = this.getNextHour(this.props.startTime);
    if (parseInt(nextHour) === 0) {
      // Adjust for next day
    }
    setTimeout(()  => { // I've tried SO many other options
      this.actionTitle.current.focus();
    }, 100);
    return(
      <div id="action-setup-modal" className="modal">
        <div className="action-setup-content">
          <span className="times" onClick={this.props.closeAction} >&times;</span>
          <form onSubmit={this.handleSubmit}>
            <input type="text" placeholder="Task" ref={this.actionTitle} value={this.state.text} name="text" onChange={this.changeText}/>
            <DatePicker
              value={this.state.startTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Start"
              dateFormat="hh:mm"
              onChange={this.changeStartTime}
              className="start-time"
            /><br/>
            <DatePicker
              value={this.state.endTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="End"
              dateFormat="hh:mm"
              onChange={this.changeEndTime}
              className="end-time"
            /><br/>
            <button type="submit" className="btn btn-outline-warning">Add</button>
          </form>
        </div>
      </div>
    );
  }
}

export default ActionSetup;
