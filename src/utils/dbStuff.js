import { compareDates, compareTimes } from '../utils/dateStuff';

const firebase = require('firebase');


export const getActions = async planId => {
  const db = window._DEFAULT_DATA[1];
  let myActions = [];
  let snapshot = await db.collection('actions').where('plan', '==', planId).get()
  let actions = await snapshot.docs;
  actions.forEach(action => {
    myActions.push([action.id, action.data()]);
  });
  myActions.sort((a, b) => { // earliest start times first
    let aStartTime = a[1].times[0];
    let bStartTime = b[1].times[0];
    return compareTimes(aStartTime, bStartTime);
  });
  return myActions;
}

export const addAction = async (text, sTime, eTime, planId) => {
  const db = window._DEFAULT_DATA[1];
  await db.collection('actions').add({
    text: text,
    times: [sTime, eTime],
    plan: planId,
    completed: false
  });
}

export const addPlan = async (text, date) => {
  const db = window._DEFAULT_DATA[1];
  await db.collection('plans').add({
    actions: [],
    date: firebase.firestore.Timestamp.fromDate(date),
    title: text
  });
}

export const getPlans = async () => {
  const db = window._DEFAULT_DATA[1];
  let myPlans = [];
  let snapshot = await db.collection('plans').get()
  let plans = await snapshot.docs
  plans.forEach(plan => {
    myPlans.push([plan.id, plan.data()]);
  });
  let orderedPlans = myPlans.sort((a,b) => {
    let [idA, dataA] = a;
    let [idB, dataB] = b;
    if (compareDates(dataA.date.toDate(), dataB.date.toDate()) === 1) {
      return -1;
    } else {
      return 1;
    }
  });

  return orderedPlans;
}
