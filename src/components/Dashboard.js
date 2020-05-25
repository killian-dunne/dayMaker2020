import React from 'react';
import DayPlan from './DayPlan';
import { toggleSignup, toggleSignin } from '../utils/toggleSetup';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: []
    }
  }

  componentDidMount() {
    if (this.props.user) {
      this.getPlans();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      if (this.props.user) {
        this.getPlans();

      } else {
        this.setState({plans: []});
      }
    }
  }

  getPlans = () => {
    const db = window._DEFAULT_DATA[1];
    let myPlans = [];
    db.collection('plans').get()
    .then(snapshot => snapshot.docs)
    .then(plans => {
      plans.forEach(plan => {
        myPlans.push(plan.data());
      });
    })
    .then(() => {
      this.setState({
        plans: myPlans
      });
    })
    .then(() => {
      this.varyBoxHeights();
    });
  }

  varyBoxHeights = () => {
    const boxes = document.querySelectorAll('.plan-box.plan-details');
    console.log('boxes')
    console.log(boxes.length)
    boxes.forEach(box => {
      box.style.height = `${(Math.random() * 3 + 3)*100}px`;
    });
  }

  render () {
    let plans = this.state.plans.map((plan, idx) => {
      let d = new Date(1970, 0, 1, 1);
      d.setSeconds(plan.date.seconds);
      return <DayPlan key={idx} title={plan.title} actions={plan.actions} keyProp={idx} date={d}/>
    });

    if (this.props.user) {
      return (
        <div className="container plans-list">{plans}</div>
      );
    } else {
      return (
        <div className="container plans-list">
          <div className="tell-login plan-box bg-light">
            To get started <a className="userState" onClick={toggleSignin}>Sign in</a> or <a onClick={toggleSignup} className="userState">Sign Up</a>.
        </div>
      </div>);
    }

  }
}

export default Dashboard;
