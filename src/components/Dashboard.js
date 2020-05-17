import React from 'react';
import DayPlan from './DayPlan';


class Dashboard extends React.Component {
  render () {
    return (
      <div className="container">
        <ul>
          <DayPlan />
          <DayPlan />
          <DayPlan />
        </ul>
      </div>
    );
  }
}

export default Dashboard;
