import React from 'react';
import Action from './Action';
class DayPlan extends React.Component {
  render () {
    return (
      <div className="container plan-box">
        <h3 className="day-title">Day 1</h3>
        < Action />
      </div>

    );
  }
}

export default DayPlan;
