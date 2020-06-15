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

export const planDateFormat = d => {
  return dateFormat(d, "d-mmm-yy");
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
  let mins = parseInt(prevMin) + parseInt(roundMins);
  let hours = parseInt(prevHour) + parseInt(numHours);
  if (mins > 59) {
    mins %= 60;
    hours ++;
  } else if (mins < 0) {
    mins += 60;
    hours --;
  }
  return hourMinToString(hours, mins);
}

export const timeAddition = (oldTime, increment) => { // Eg increment = -30 (mins)
  if (increment === 0) return oldTime;
  let [hours, mins] = oldTime.split(':');
  [hours, mins] = [parseInt(hours), parseInt(mins)];
  let pos = increment > 0 ? true : false;
  if (!pos) increment = -increment;
  let numHours = Math.floor(increment / 60);
  let numMins = increment % 60;
  if (!pos) {
    numHours = -numHours;
    numMins = -numMins;
  }
  if (numMins + mins > 59) {
    hours ++;
  } else if (numMins + mins < 0) {
    hours --;
    mins += 60;
  }
  return hourMinToString(hours + numHours, mins + numMins);
}

export const hourMinToString = (h, m) => {
  return ("00" + (parseInt(h) % 24)).slice(-2) + ":" + ("00" + (parseInt(m) % 60)).slice(-2);
}

export const roundTime = (h, m) => {
  [h, m] = [parseInt(h), parseInt(m)];
  let [retH, retM] = [0, 0];
  if (m.toString().length === 1) {
    m = m * 10;
  }
  let longerhDiv = hourDiv.concat(60);
  for (let i = 0; i < longerhDiv.length - 1; i++) {
    if (m < (parseInt(longerhDiv[i]) + parseInt(longerhDiv[i+1])) / 2) {
      retM = longerhDiv[i];
      break;
    } else {
      retM = 60;
    }
  }
  if (retM === 60) {
    retM = 0;
    retH = parseInt(h) + 1;
  } else {
    retH = h;
  }
  [retH, retM] = [parseInt(retH), parseInt(retM)];
  return [retH, retM];
}

export const cleanInput = (text, increment = false) => { // return [text, problem]
  if (isNaN(parseInt(text))) {
    return ['Time missing', true];
  }
  if (!increment) {
    [text, increment] = handleAMPM(text);
  }
  if (text.includes(":")) {
    let [h, m] = text.split(":");
    if (isNaN(h) || isNaN(m)) {
      return ['Input time only as numbers', true]
    } else {
      if (increment) {
        h = parseInt(h) + 12;
      }
      return [hourMinToString(h, m), false];
    }
  } else {
    let [h, m] = [0, 0];
    switch (text.length) {
      case 1:
        if (isNaN(text)) {
          return [`A time needs a number!`, true]
        } else {
          if (increment) {
            text = parseInt(text) + 12;
          }
          return [hourMinToString(text, 0), false]
        }
      case 2:
        if (!isNaN(text)) {
          if (increment) {
            text = parseInt(text) + 12;
          }
          return [hourMinToString(text, 0), false];
        }
      case 3:
        if (handleAMPM(text)[0] !== text) {
          if (increment) {
            return cleanInput(text.substring(text.length), increment)
          }
        }
        [h, m] = [text[0], text.substring(1)];
        if (increment) {
          h = parseInt(h) + 12;
        }
        if (!isNaN(h) && !isNaN(m)) {
          let [roundedH, roundedM] = roundTime(h, m);
          return [hourMinToString(roundedH, roundedM), false];
        }
      case 4:
        [h, m] = [text.substring(0, 2), text.substring(2)];
        if (!isNaN(h) && !isNaN(m)) {
          if (increment || (h == 12 && increment === null)) {
            h = parseInt(h) + 12;
          }
          let [roundedH, roundedM] = roundTime(h, m);
          return [hourMinToString(roundedH, roundedM), false];
        }
      case 5:
      case 6:
        if (handleAMPM(text)[0] !== text) {
          if (increment) {
            if (text[0] === 1 && text[1] === 2) {
              increment = !increment;
            }
            return cleanInput(text.substring(0, text.length - 2), increment);
          }
        }
      default:
        return ['Input is not formatted correctly', true];
    }
  }
}

export const handleAMPM = (text) => {
  let lastPart = text.substring(text.length - 2);
  if (lastPart === 'am' || lastPart === 'AM') {
    return [text.substring(0, text.length - 2), null];
  } else if (lastPart === 'pm' || lastPart === 'PM') {
    return [text.substring(0, text.length - 2), true];
  } else {
    return [text, false];
  }
}

export const isLater = (timeA, timeB) => { // true if timeA after timeB
  let [hA, mA] = timeA.split(":");
  let [hB, mB] = timeB.split(":");
  [hA, mA] = [parseInt(hA), parseInt(mA)];
  [hB, mB] = [parseInt(hB), parseInt(mB)];
  if (hA > hB || (hA === hB && mA > mB)) {
    return ['Set the end time after the start time', true];
  } else if (hA === hB && mA === mB) {
    return [`It should take at least ${hourDiv[1]} minutes`, true];
  } else {
    return ['Yay', false];
  }
}


export const secondsToDate = (secs) => {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t;
}
