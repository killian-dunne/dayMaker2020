import { compareDates, compareTimes, secondsToDate } from '../utils/dateStuff';

const firebase = require('firebase');

export const getActions = async planId => {
  const db = window._DEFAULT_DATA[1];
  let myActions = [];
  let querySnapshot = await db.collection('plans').doc(planId).collection('actions').get();
  querySnapshot.forEach(action => {
    myActions.push({id: action.id, data: action.data()});
  });
  myActions.sort((a, b) => { // earliest start times first
    let aStartTime = a.data.times.startTime;
    let bStartTime = b.data.times.startTime;
    return compareTimes(aStartTime, bStartTime);
  });
  return myActions;
}

export const setAction = async (text, startTime, endTime, planId, completed, actionID) => {
  const db = window._DEFAULT_DATA[1];
  let data = {};
  if (text !== undefined) {
    data.text = text;
  }
  if (startTime !== undefined && endTime !== undefined) {
    data.times = {startTime, endTime};
  }
  if (completed !== undefined) {
    data.completed = completed;
  }
  if (actionID) {
    await db.collection('plans').doc(planId).collection('actions').doc(actionID).update(data);
  } else {
    await db.collection('plans').doc(planId).collection('actions').add(data);
  }
}

export const deleteAction = async (planID, id) => {
  const db = window._DEFAULT_DATA[1];
  try {
    await db.collection('plans').doc(planID).collection('actions').doc(id).delete();
  } catch (err) {
    console.log('Error while trying to delete action:');
    console.log(err.message);
  }
}

export const addPlan = async (text, date) => {
  const db = window._DEFAULT_DATA[1];
  await db.collection('plans').add({
    date: firebase.firestore.Timestamp.fromDate(date),
    title: text
  });
}


export const deletePlan = async id => {
  const db = window._DEFAULT_DATA[1];
  try {
    let snapshot = await db.collection('plans').doc(id).collection('actions').get();
    await db.collection('plans').doc(id).delete();
    console.log('plan deleted:', id)
    snapshot.forEach(action => {
      action.delete();
    });
  } catch (err) {
    console.log('Error when trying to delete plan with id', id);
    console.log(err.message);
  }
}

export const getPlanByDate = async date => {
  const oneDay = 86400; // seconds
  const db = window._DEFAULT_DATA[1];
  try {
    let firstPlan, secondPlan;
    let firstSnapshot = await db.collection('plans').orderBy('date').startAt(date).limit(1).get();
    let secondSnapshot = await db.collection('plans').orderBy('date', 'desc').startAt(date).limit(1).get();
    await firstSnapshot.forEach(plan => {
      firstPlan = {id: plan.id, data: plan.data()};
    });
    await secondSnapshot.forEach(plan => {
      secondPlan = {id: plan.id, data: plan.data()};
    })
    let earlierDate = secondsToDate(secondPlan.data.date.seconds);
    let laterDate = secondsToDate(firstPlan.data.date.seconds);
    if (compareDates(earlierDate, date) === 0) {
      return secondPlan.id;
    } else if (compareDates(laterDate, date) === 0) {
      return firstPlan.id;
    } else {
      let earlierSecDiff = Math.abs(secondPlan.data.date.seconds - date.getTime() / 1000)
      let laterSecDiff = Math.abs(firstPlan.data.date.seconds - date.getTime() / 1000);
      if (earlierSecDiff < laterSecDiff) {
        return secondPlan.id;
      } else {
        return firstPlan.id
      }
      return
    }
  } catch (err) {
    console.log(`couldn't retrieve plans.`);
    console.log(err.message)
  }
}
