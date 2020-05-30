export const hourHeight = 52.8;
export let isToday = "current-time";
export let isTomorrow = "tomorrow-time";

export const enumerateHours = () => {
  let times = [];
  for (let i = 0; i < 24; i++) {
    times.push(("00" + i).slice(-2) + ":00");
  }
  for (let j = 0; j < 6; j++) {
    times.push(("00" + j).slice(-2) + ":00");
  }
  return times;
}

export const calculateTimeHeight = (day) => {
  let d = new Date();
  if (day === isToday) {
    // each hour is about hourHeightpx
    return hourHeight * ( d.getHours() + d.getMinutes() / 60);
  } else if (day === isTomorrow) {
    return hourHeight * (24 + d.getHours() + d.getMinutes() / 60);
  }
  return null;
}
