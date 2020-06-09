import { hourHeight } from './lines&timer';
import { hourDiv } from '../components/DayPlan';

var dateFormat = require('dateformat');

export const displayStopwatch = (sec) => {
  let output = `Planning time: `;
  let hours = Math.floor(sec/3600);
  let minutes = Math.floor(sec/60);
  let secondsString = '';
  if (minutes > 0) {
    if (hours > 0) {
      let hoursString = ("00" + hours).slice(-2);
      output += hoursString + ":";
    }
    let minutesString = '';
    if (minutes > 9) {
      minutesString = ("00" + (minutes%60)).slice(-2);
    } else {
      minutesString = minutes.toString();
    }
    output += minutesString + ":";
    secondsString = ("00" + (sec%60)).slice(-2);
  } else {
    secondsString = (sec%60).toString();
  }
  output += secondsString + "."
  return output;
}

export const displayDate = (d) => {
  return dateFormat(d, "ddd, dS mmm yyyy, h:MM TT");
}

export const titleDate = d => {
  return dateFormat(d, "dS mmm yy");
}

export const compareDates = (date1, date2) => {
  date1.setHours(0,0,0,0);
  date2.setHours(0,0,0,0);
  if (date1.getTime() === date2.getTime()) {
    return 0;
  } else if (date1 > date2) {
    return 1;
  } else {
    return -1;
  }
}

export const compareTimes = (time1, time2) => { // form= 08:15. positive if first larger/later
  let [aHour, aMin] = time1.split(':');
  let [bHour, bMin] = time2.split(':');
  if (aHour > bHour) {
    return 1;
  } else if (aHour < bHour) {
    return -1;
  } else {
    if (aMin > bMin) {
      return 1;
    } else if (aMin < bMin) {
      return -1;
    } else {
      return 0;
    }
  }
}

export const convertHeightToTime = (time, height) => {
  if (height === 0) {
    return time;
  }
  let add = height > 0 ? true : false;
  if (!add) {
    height = -height;
  }
  let numHours = Math.floor(height / hourHeight);
  let numMins = (height - numHours * hourHeight) * 60 / hourHeight;
  numHours = add ? numHours : -numHours;
  let roundMins = add ? 45 : -60;
  for (let i = 1; i < hourDiv.length; i++) {
    if (numMins < hourDiv[i]) {
      roundMins = add ? hourDiv[i-1] : -hourDiv[i];
      break;
    }
  }
  let [prevHour, prevMin] = time.split(':');
  let mins = prevMin + roundMins;
  let hours = prevHour + numHours;
  if (mins > 59) {
    mins %= 60;
    hours ++;
  } else if (mins < 0) {
    mins += 60;
    hours --;
  }
  return ("00" + hours).slice(-2) + ":" + ("00" + mins).slice(-2);
}
