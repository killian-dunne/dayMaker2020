import React from 'react'
import DayPlan from './DayPlan';
import { toggleSignup, toggleSignin } from '../utils/toggleSetup';
import { compareDates } from '../utils/dateStuff';
import NewDay from './NewDay';
import { getActions, setAction } from '../utils/dbStuff';

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
      if (plan.id === id) {
        myPlan = plan.data;
      }
    }
    if (!myPlan) {
      console.log('No plan found');
      return;
    }
    const db = window._DEFAULT_DATA[1];
    await db.collection('plans').doc(id).update({
      title: myPlan.title,
      date: myPlan.date,
    });
    return;
  }

  getPlans = async () => {
    const db = window._DEFAULT_DATA[1];
    let myPlans = [];
    const querySnapshot = await db.collection('plans').get();
    querySnapshot.forEach(plan => {
      getActions(plan.id).then(actions => {
        myPlans.push({id: plan.id, data: {...plan.data(), actions}});
        let orderedPlans = myPlans.sort((a, b) => {
          if (compareDates(a.data.date.toDate(), b.data.date.toDate()) === 1) {
            return -1;
          } else {
            return 1;
          }
        });
        this.setState({plans: orderedPlans});
      }).catch(err => {
        console.log('Error getting actions', err.message)
      });
    });
    return;
  }

  removePlan = (id) => {
    let plans = this.state.plans.filter(plan => plan.id !== id);
    this.setState({plans});
  }

  updateActions = async (planId) => {
    let myActions = await getActions(planId)
    let myPlans = this.state.plans;
    let plans = myPlans.map(plan => {
      if (plan.id === planId) {
        plan.data.actions = myActions;
      }
      return plan;
    });
    this.setState({plans});
  }

  renamePlan = (e, id) => {
    let title = e.target.value;
    let myPlans = this.state.plans;
    let plans = myPlans.map(plan => {
      if (plan.id === id) {
        plan.data.title = title;
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

  assignNextPosition = (pA, pB, pC) => {
    let position = '';
    let num = Math.min(parseInt(pA), parseInt(pB));
    if (window.innerWidth < 1400) {
      position += 'C';
      num = pC;
    } else if (pA <= pB) {
      position += 'A';
    } else {
      position += 'B';
    }
    return position + num.toString();
  }

  itemizePlans = () => {
    let [pA, pB, pC] = [0, 0, 0]; // Next plan starting position for columnA/B or single col
    return this.state.plans.map((plan, idx) => {
      let id = plan.id;
      let data = plan.data;
      let height = this.choosePlanHeight(data);
      let position = this.assignNextPosition(pA, pB, pC);
      if (position[0] === 'A') {
        pA += height + 60;
      } else if (position[0] === 'B') {
        pB += height + 60;
      } else if (position[0] === 'C') {
        pC += height + 60;
      }
      let d = new Date(1970, 0, 1, 1);
      d.setSeconds(data.date.seconds);
      let scrollToThis = id === this.props.searchedPlan;
      return <DayPlan key={idx}
                      plan={data}
                      keyProp={idx}
                      date={d}
                      id={id}
                      height={height}
                      position={position}
                      renamePlan={this.renamePlan}
                      actions={data.actions}
                      loadActions={this.updateActions}
                      title={data.title}
                      getPlans={this.getPlans}
                      updatePlan={this.updatePlan}
                      removePlan={this.removePlan}
                      scrollToThis={scrollToThis}
                      />
    });
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
          <NewDay user={this.props.user} updatePlans={this.getPlans}/>
        </div>
      </div>
    );
  }
}

export default Dashboard;
