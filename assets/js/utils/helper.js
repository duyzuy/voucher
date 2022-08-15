export const isExistsInput = (node) => {
  if (node.length < 0) {
    return false;
  }
  return true;
};

export const dateFormat = (date, currentFormat, lang, newFormat) => {
  const correctDate = moment(date, currentFormat);

  return correctDate.locale(lang).format(newFormat);
};

export const getScheduleTime = (scheduleTime, utcOffset, locale) => {
  const { hours, iso, minutes } = utcOffset;

  const schedule = moment(scheduleTime).clone();
  const hour = schedule.hours();
  const minute = schedule.minutes();
  const date = schedule
    .locale(locale.lang)
    .format(locale.locale.formatTextNoYear);
  const day = schedule.days();
  const dayName = locale.locale.daysOfWeekLongname[day];

  return {
    time: `${hour}:${minute}`,
    date: date,
    day: dayName,
  };
};
