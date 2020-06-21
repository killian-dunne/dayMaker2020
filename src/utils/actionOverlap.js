import { isLater, timeDifferenceBetween } from './dateStuff';
import { hourDiv } from '../components/DayPlan';

export const shiftActions = (startTime, endTime, actions, currentIdx) => {
  let overlappingIndices = checkForOverlap(startTime, endTime, actions);
  if (overlappingIndices.length > 2) {
    console.log('You can only have two actions at the same time')
    return [-1, null, null];
  } else if (overlappingIndices.length > 0) {
    let firstIdx = Math.min(...overlappingIndices.filter(idx => idx !== currentIdx));
    if (firstIdx === Infinity) {
      return [0, 0, 0]
    }
    let shiftMins = timeDifferenceBetween(actions[firstIdx].data.times.startTime, endTime);
    if (shiftMins > 0) {
      let numActions = countActionsToShift(endTime, firstIdx, actions, shiftMins);
      return [firstIdx, shiftMins, numActions];
    } else {
      console.log('Time difference is negative');
      return [-1, null, null]
    }
  } else {
    return [0, 0, 0]
  }
}

export const checkForOverlap = (start, end, actions) => {
  let overlappingActions = [];
  actions.forEach((action, idx) => {
    if ((
        isLater(start, action.data.times.startTime)[1] !== -1 &&
        isLater(action.data.times.endTime, start)[1] === 1
      ) || (
        isLater(end, action.data.times.startTime)[1] === 1 &&
        isLater(action.data.times.endTime, end)[1] !== -1
      )) {
      overlappingActions.push(idx);
    }
  })
  return overlappingActions;
}

export const countActionsToShift = (newActionEnd, firstIndex, actions, shiftMins) => {
  // first Index should be the index of the first pair of overlapping actions
  // returns the number of overlapping actions after this index
  let numActions = 1;
  for (let i = firstIndex; i < actions.length - 1; i++) {
    if (timeDifferenceBetween(actions[i].data.times.endTime, actions[i+1].data.times.startTime)  < shiftMins) {
      numActions ++;
    } else {
      break;
    }
  }
  return numActions;
}

export const overlapActions = (actions) => {
  let idList = [];
  for (let i = 0; i < actions.length - 1; i++ ) {
    if (
      isLater(actions[i].data.times.endTime, actions[i + 1].data.times.startTime)[1] === 1 &&
      isLater(actions[i + 1].data.times.startTime, actions[i].data.times.startTime)[1] !== -1 &&
      !idList.includes(actions[i].id) &&
      !idList.includes(actions[i + 1].id)
    ) {
      idList.push(actions[i + 1].id)
    }
  }

  return idList;
}
