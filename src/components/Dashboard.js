import React from 'react'
import DayPlan from './DayPlan';
import { toggleSignup, toggleSignin } from '../utils/toggleSetup';

const Dashboard = (props) => {

  const choosePlanHeight = (plan) => {
    let numActions = plan.actions.length;
    let height = 400;
    if (numActions < 2) {
      height = 350;
    } else if (numActions  < 4) {
      height = 450;
    } else {
      height = 600;
    }
    return height;
  }

  const assignNextPosition = (pA, pB) => {
    let num = Math.min(parseInt(pA), parseInt(pB));
    let position = '';
    if (pA <= pB) {
      position += 'A';
    } else {
      position += 'B';
    }
    return position + num.toString();
  }

  const itemizePlans = () => {
    let [pA, pB] = [0, 0]; // Next plan starting position for columnA/B
    let plans = props.plans.map((planPair, idx) => {
      let id = planPair[0];
      let plan = planPair[1];
      let height = choosePlanHeight(plan);
      let position = assignNextPosition(pA, pB);
      if (position[0] === 'A') {
        pA += height + 60;
      } else if (position[0] === 'B'){
        pB += height + 60;
      }
      let d = new Date(1970, 0, 1, 1);
      d.setSeconds(plan.date.seconds);
      return <DayPlan key={idx} plan={plan} keyProp={idx} date={d} id={id} height={height} position={position}/>
    });
    return plans;
  }

  let plans = itemizePlans();
  if (props.user === null) {
    return (
      <div className="container plans-list">
        <div className="tell-login plan-box bg-light">
          To get started <a className="user-state" onClick={toggleSignin}>Sign in</a> or <a onClick={toggleSignup} className="user-state">Sign Up</a>.
        </div>
      </div>
    );
  } else {
    return (
      <div className="container plans-list">{plans}</div>
    );
  }
}

export default Dashboard
