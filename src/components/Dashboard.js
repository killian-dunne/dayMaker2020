import React from 'react'
import DayPlan from './DayPlan';
import { toggleSignup, toggleSignin } from '../utils/toggleSetup';
import { compareDates } from '../utils/dateStuff';
import NewDay from './NewDay';
import { getActions } from '../utils/dbStuff';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: [] // Each of the form [id, planData]
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user) {
      if (this.props.user) {
        this.getPlans();
      } else {
        this.setState({plans: []});
      }
    }
  }

  updatePlan = async (e, id) => {
    let myPlan;
    for (let plan of this.state.plans) {
      if (plan[0] === id) {
        myPlan = plan[1];
      }
    }
    if (!myPlan) {
      console.log('No plan found');
      return;
    }
    const db = window._DEFAULT_DATA[1];
    await db.collection('plans').doc(id).set({
      actions: myPlan.actions,
      date: myPlan.date,
      title: myPlan.title
    });
    return;
  }

  getPlans = async () => {
    const db = window._DEFAULT_DATA[1];
    await db.collection('plans').onSnapshot(snapshot => {
      let myPlans = [];
      let plans = snapshot.docs;
      plans.forEach(plan => {
        myPlans.push([plan.id, plan.data()]);
      });
      let orderedPlans = myPlans.sort((a, b) => {
        let [idA, dataA] = a;
        let [idB, dataB] = b;
        if (compareDates(dataA.date.toDate(), dataB.date.toDate()) === 1) {
          return -1;
        } else {
          return 1;
        }
      });
      this.setState({plans: orderedPlans})
      return;
    })
    return;
  }

  loadActions = async (planId) => {
    let myActions = await getActions(planId)
    let myPlans = this.state.plans;
    let plans = myPlans.map(plan => {
      if (plan[0] === planId) {
        plan[1].actions = myActions;
      }
      return plan;
    });
    this.setState({plans});
  }

  renamePlan = (e, id) => {
    let title = e.target.value;
    let myPlans = this.state.plans;
    let plans = myPlans.map(plan => {
      if (plan[0] === id) {
        plan[1].title = title;
      }
      return plan;
    });
    this.setState({plans});
  }

  choosePlanHeight = (plan) => {
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

  assignNextPosition = (pA, pB) => {
  let num = Math.min(parseInt(pA), parseInt(pB));
  let position = '';
  if (pA <= pB) {
    position += 'A';
  } else {
    position += 'B';
  }
  return position + num.toString();
  }

  itemizePlans = () => {
    let [pA, pB] = [0, 0]; // Next plan starting position for columnA/B
    let plans = this.state.plans.map((planPair, idx) => {
      let id = planPair[0];
      let plan = planPair[1];
      let height = this.choosePlanHeight(plan);
      let position = this.assignNextPosition(pA, pB);
      if (position[0] === 'A') {
        pA += height + 60;
      } else if (position[0] === 'B'){
        pB += height + 60;
      }
      let d = new Date(1970, 0, 1, 1);
      d.setSeconds(plan.date.seconds);
      return <DayPlan key={idx}
                      plan={plan}
                      keyProp={idx}
                      date={d}
                      id={id}
                      height={height}
                      position={position}
                      renamePlan={this.renamePlan}
                      actions={plan.actions}
                      loadActions={this.loadActions}
                      title={plan.title}
                      getPlans={this.getPlans}
                      updatePlan={this.updatePlan}
                      />
     });
     return plans;
  }

  render() {
    let plans = this.itemizePlans();
    let returnJSX;
    if (this.props.user === null) {
      returnJSX =  (
        <div className="container plans-list">
          <div className="tell-login plan-box bg-light">
            To get started <a className="user-state" onClick={toggleSignin}>Sign in</a> or <a onClick={toggleSignup} className="user-state">Sign Up</a>.
          </div>
        </div>
      );
    } else {
      returnJSX = (
        <div className="container plans-list">{plans}</div>
      );
    }
    return (
      <div className="gen-area">
        {returnJSX}
        <div id="create-new" className="plan-box bg-light">
          <NewDay user={this.props.user}/>
        </div>
      </div>
    );
  }
}

export default Dashboard;
