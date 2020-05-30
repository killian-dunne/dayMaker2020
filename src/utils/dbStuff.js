
export const getActions = async planId => {
  const db = window._DEFAULT_DATA[1];
  let myActions = [];
  let snapshot = await db.collection('actions').where('plan', '==', planId).get()
  let actions = await snapshot.docs;
  actions.forEach(action => {
    myActions.push([action.id, action.data()]);
  })
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
