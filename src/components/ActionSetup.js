import React from 'react';
import DatePicker from 'react-datepicker';

class ActionSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
    this.actionTitle = React.createRef();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.createAction(this.state.text)
  }

  changeText = e => {
    this.setState({
      text: e.target.value
    });
  }

  render () {
    return(
      <div id="action-setup-modal" className="modal">
        <div className="action-setup-content">
          <span className="times" onClick={this.props.closeAction}>&times;</span>
          <form onSubmit={this.handleSubmit}>
            <input type="text" placeholder="Task" ref={this.actionTitle} value={this.state.text} name="text" onChange={this.changeText}/>
            <DatePicker
              value={this.props.startTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Start"
              dateFormat="hh:mm"
              onChange={this.props.changeStartTime}
              className="start-time"
            /><br/>
            <DatePicker
              value={this.props.endTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="End"
              dateFormat="hh:mm"
              onChange={this.props.changeEndTime}
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
