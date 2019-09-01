const timeDifference = (current: number, previous: number) => {
  const milliSecondsPerMinute = 60 * 1000;
  const milliSecondsPerHour = milliSecondsPerMinute * 60;
  const milliSecondsPerDay = milliSecondsPerHour * 24;
  const milliSecondsPerMonth = milliSecondsPerDay * 30;
  const milliSecondsPerYear = milliSecondsPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < milliSecondsPerMinute / 3) {
    return 'just now';
  }
  if (elapsed < milliSecondsPerMinute) {
    return '< 1 min';
  } else if (elapsed < milliSecondsPerHour) {
    return Math.round(elapsed / milliSecondsPerMinute) + ' min';
  } else if (elapsed < milliSecondsPerDay) {
    return Math.round(elapsed / milliSecondsPerHour) + ' h';
  } else if (elapsed < milliSecondsPerMonth) {
    return Math.round(elapsed / milliSecondsPerDay) + ' d';
  } else if (elapsed < milliSecondsPerYear) {
    return Math.round(elapsed / milliSecondsPerMonth) + ' mo';
  } else {
    return Math.round(elapsed / milliSecondsPerYear) + ' y';
  }
};

export const timeDifferenceForDate = (date: string) => {
  const now = new Date().getTime();
  const updated = new Date(date).getTime();
  return timeDifference(now, updated);
};

export const getTimeDate = (date: string) => {
  const today = new Date(Date.now());
  const timeDate = new Date(date);
  const month = timeDate.getMonth() + 1;
  const day = timeDate.getDate();
  var hours: string | number = timeDate.getHours();
  var minutes: string | number = timeDate.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  if (today.getDate() === day) return `Today, ${strTime}`;
  if (today.getDate() - 1 === day - 1) return `Yesterday, ${strTime}`;
  return `${month <= 9 ? `0${month}` : month}-${
    day <= 9 ? `0${day}` : day
  }-${timeDate.getFullYear()}, ${strTime}`;
};
