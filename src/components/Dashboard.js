import React from 'react';
import DayPlan from './DayPlan';
import { toggleSignup, toggleSignin } from '../utils/toggleSetup';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: [] // [id, plan.data()]
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
        myPlans.push([plan.id, plan.data()]);
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
    boxes.forEach(box => {
      box.style.height = `${(Math.random() * 3 + 3)*100}px`;
    });
  }

  render () {
    let plans = this.state.plans.map((planPair, idx) => {
      let id = planPair[0];
      let plan = planPair[1];
      let d = new Date(1970, 0, 1, 1);
      d.setSeconds(plan.date.seconds);
      return <DayPlan key={idx} plan={plan} keyProp={idx} date={d} id={id}/>
    });

    if (this.props.user === null) {
      return (
        <div className="container plans-list">
          <div className="tell-login plan-box bg-light">
            To get started <a className="user-state" onClick={toggleSignin}>Sign in</a> or <a onClick={toggleSignup} className="user-state">Sign Up</a>.
        </div>
      </div>);
    } else {
      return (
        <div className="container plans-list">{plans}</div>
      );
    }
  }
}

export default Dashboard;
