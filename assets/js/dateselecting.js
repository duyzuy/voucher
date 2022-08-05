import { constants } from "./constant.js";
import config, { baseURL, languageId } from "./config.js";
import { bookingFormText, dateLocale } from "./translate.js";
const calendarContainer = $("#bk__calendar");
const Bkcalendar = {
  calendar: {
    selected: "08-14-2022",
    today: "",
    viewRange: 7,
    days: [],
    currentLocale: {},
  },

  init: function (locale) {
    //set current day

    const currentLocale = dateLocale.find((lc) => lc.lang === locale);
    this.calendar.currentLocale = currentLocale;

    this.calendar.today = moment()
      .locale(locale)
      .format(this.calendar.currentLocale.format);

    //define properties
    this.defineProperties();

    //render template
    this.render();

    this.handleEvents();
  },
  setLocale: function () {},
  defineProperties: function () {
    Object.defineProperty(this, "currentDay", {
      get: function () {
        return moment().get("date");
      },
    });

    Object.defineProperty(this, "currentMonth", {
      get: function () {
        return moment().get("month") + 1;
      },
    });
    Object.defineProperty(this, "currentYear", {
      get: function () {
        return moment().get("year");
      },
    });
    Object.defineProperty(this, "startOfMonth", {
      get: function () {
        return moment().startOf("month");
      },
    });
    Object.defineProperty(this, "endOfMonth", {
      get: function () {
        return moment().endOf("month");
      },
    });
  },

  render: function () {
    const _this = this;

    console.log(this.calendar.today);
    //get midView of number view;
    const midView = Math.floor(_this.calendar.viewRange / 2);

    //get selected mont, day, year;
    const selectedDay = moment(_this.calendar.selected).get("date");
    const selectedMonth = moment(_this.calendar.selected).get("month") + 1;
    const selectedyear = moment(_this.calendar.selected).get("year");

    //create array range by view of days;
    const startArrayDay = _this.createArray(selectedDay - midView, selectedDay);
    const endArrayDay = _this.createArray(
      selectedDay + 1,
      selectedDay + midView + 1
    );

    const rangeDay = [...startArrayDay, selectedDay, ...endArrayDay];
    let html = `<div id="bk__calendar--slider"><span class="bk__calendar-btn bk__calendar-prev"><i class="bi bi-arrow-left-short"></i></span><span class="bk__calendar-btn bk__calendar-next"><i class="bi bi-arrow-right-short"></i></span><div id="bk__calendar--container" class="bk__calendar--container"><ul id="bk__calendar-items" class="bk__calendar-items">`;
    for (const day of rangeDay) {
      const value = moment(`${selectedMonth}-${day}-${selectedyear}`)
        .locale(_this.calendar.currentLocale.lang)
        .format(_this.calendar.currentLocale.locale.format);

      const altDate = moment(`${selectedMonth}-${day}-${selectedyear}`)
        .locale(_this.calendar.currentLocale.lang)
        .format(_this.calendar.currentLocale.locale.formatTextShort);

      const dayName =
        _this.calendar.currentLocale.locale.daysOfWeekLongname[day % 7];

      const active = day === selectedDay ? true : false;
      _this.calendar.days.push({
        dayName,
        day,
        month: selectedMonth,
        year: selectedyear,
        value,
        altDate,
      });

      html += _this.template(
        dayName,
        altDate,
        day,
        selectedMonth,
        selectedyear,
        active ? " active" : "",
        value
      );
    }
    html += "</ul></div></div>";

    calendarContainer.append(html);
  },

  template: function (dayName, dayformat, day, month, year, active, value) {
    return `<li class="bk__calendar-item calendar-date${active}" data-day="${day}" data-value="${value}" data-month="${month}" data-year="${year}"><div class="date-inner"><p class="name-of-day">${dayName}</p><p class="day-format">${dayformat}</p></div></li>`;
  },
  addDayByOne: function () {},
  addDayByNumber: function (dayNumber) {
    const newDay = this.currentDay + Number(dayNumber);

    return {
      dayNum: newDay,
      dayName: this.calendar.locale.day[newDay % 7],
    };
  },
  createArray: function (start, end) {
    if (
      typeof start !== "number" ||
      typeof end !== "number" ||
      Number(end) < Number(start)
    )
      return;

    return Array.from({ length: end - start }, (_, i) => start + i);
  },
  handleEvents: function () {
    const _this = this;
    calendarContainer.on("click", function (e) {
      let item = $(e.target);
      _this.calendar.selected = item.data("value");
      if (calendarContainer.closest(".bk__calendar-item") === e.target) {
        console.log("1");
      }
    });
  },
};
Bkcalendar.init(constants.LOCALE_VI);
