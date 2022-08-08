import { constants } from "./constant.js";
import config, { baseURL, languageId } from "./config.js";
import { bookingFormText, dateLocale } from "./translate.js";

const calendarContainer = $("#bk__calendar");
const Bkcalendar = {
  calendar: {
    selected: "10-08-2022",
    today: "",
    days: [],
    currentLocale: {},
  },
  viewRange: 7,
  currentIndex: 0,
  activeIndex: 3,
  init: function (locale) {
    //set current day

    const currentLocale = dateLocale.find((lc) => lc.lang === locale);

    this.calendar.currentLocale = currentLocale;

    this.calendar.today = moment().format(currentLocale.locale.format);

    //define properties
    this.defineProperties();
    this.updateArrayDay();
    //render template
    this.renderSlider();

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
  updateArrayDay: function () {
    const _this = this;

    //get midView of number view;
    const midView = Math.floor(_this.viewRange / 2);

    let startDayOfRange = moment(
      _this.calendar.selected,
      _this.calendar.currentLocale.locale.format
    ).add(-midView, "days");

    let endDayOfRange = moment(
      _this.calendar.selected,
      _this.calendar.currentLocale.locale.format
    ).add(midView, "days");

    for (let i = 0; i < _this.viewRange; i++) {
      if (i === 0) {
        _this.calendar.days[i] = _this.keysOfDay(
          startDayOfRange,
          _this.calendar.currentLocale
        );
      } else {
        const nextDay = startDayOfRange.add(1, "days");
        _this.calendar.days[i] = _this.keysOfDay(
          nextDay,
          _this.calendar.currentLocale
        );
      }
    }
  },
  keysOfDay: function (date, locale) {
    const _this = this;
    let selectedDate = moment(
      _this.calendar.selected,
      _this.calendar.currentLocale.locale.format
    );
    let today = moment(
      _this.calendar.today,
      _this.calendar.currentLocale.locale.format
    );
    return {
      dayName: locale.locale.daysOfWeekLongname[date.get("date") % 7],
      altDate: date.locale(locale.lang).format(locale.locale.formatTextShort),
      day: date.get("date"),
      month: date.get("month") + 1,
      year: date.get("year"),
      value: date.format(locale.locale.format),
      moment: date,
      selectedDay: date.isSame(selectedDate) ? true : false,
      today: date.isSame(today) ? true : false,
      inRange:
        date.isBefore(selectedDate.add(3, "days")) &&
        date.isAfter(selectedDate.add(-3, "days"))
          ? false
          : true,
    };
  },
  updateView(action) {
    const _this = this;
    const locale = _this.calendar.currentLocale;
    //update array day by next/prev or day
    const days = _this.calendar.days;
    let selectedDate = moment(
      _this.calendar.selected,
      _this.calendar.currentLocale.locale.format
    );

    const lastOfRange = _this.calendar.days[_this.calendar.days.length - 1];
    const startOfRange = _this.calendar.days[0];
    if (action === "addOne") {
      _this.calendar.selected = selectedDate
        .add(1, "days")
        .format(locale.locale.format);
      const newDay = _this.keysOfDay(lastOfRange.moment.add(1, "days"), locale);

      _this.calendar.days.push(newDay);

      // const restOfrange = _this.calendar.days.slice(1, _this.viewRange);

      // _this.calendar.days = [...restOfrange, newDay];
    }

    if (action === "removeOne") {
      _this.calendar.selected = selectedDate
        .add(-1, "days")
        .format(locale.locale.format);
      // const newDay = _this.keysOfDay(lastOfRange.moment.add(1, "days"), locale);
      // _this.calendar.days.push(newDay);
    }
    _this.updateArrayDay();
    console.log(_this.calendar.days);
    _this.items(_this.calendar.days);
  },
  renderSlider: function () {
    //render calendar
    const _this = this;

    calendarContainer.append(_this.template());

    //apend items to the slide day
    const item = calendarContainer.find(".bk__calendar-item");

    const widthItem = 50 / _this.viewRange;

    //remder item to slider.
    _this.items(_this.calendar.days);
    item.css({
      width: widthItem + "%",
    });
  },
  items: function (dates, className, id) {
    calendarContainer.find(".bk__calendar-items").html("");
    let items = "";
    const _this = this;
    const itemWidth =
      Math.floor((calendarContainer.width() * 100) / _this.viewRange) / 100;
    calendarContainer.find("#bk__calendar-items").css({
      width: calendarContainer.width() * 2 + "px",
    });
    dates.forEach((date, indx) => {
      let classes = "bk__calendar-item calendar-date";

      date.inRange && (classes = classes.concat(" ", "in-range"));
      date.selectedDay && (classes = classes.concat(" ", "selected"));
      date.today && (classes = classes.concat(" ", "today"));

      items += `
          <li data-index="${indx}" style="width: ${itemWidth}px;" class="${classes}"
          data-day="${date.day}" data-value="${date.value}" data-month="${date.month}"
          data-year="${date.year}">
          <div class="date-inner">
          <p class="name-of-day">${date.dayName}</p>
          <p class="day-format">${date.altDate}</p></div>
          </li>`;
    });

    calendarContainer.find("#bk__calendar-items").append(items);

    // return items;
  },
  template: function () {
    let html = `<div id="bk__calendar--container" class="bk__calendar--container">
    <span class="bk__calendar-btn bk__calendar-prev"><i class="bi bi-arrow-left-short"></i></span>
    <span class="bk__calendar-btn bk__calendar-next"><i class="bi bi-arrow-right-short"></i></span>
    <div id="bk__calendar--slider" class="bk__calendar--slider">
    <ul id="bk__calendar-items" class="bk__calendar-items"></ul></div></div>`;
    return html;
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
    const today = moment(
      _this.calendar.today,
      _this.calendar.currentLocale.locale.format
    );
    const daySelected = moment(
      _this.calendar.selected,
      _this.calendar.currentLocale.locale.format
    );
    let sliding = false;
    const containerWidth = calendarContainer.width();

    const itemWidth = Math.floor(containerWidth / _this.viewRange);
    const wrapItems = calendarContainer.find(".bk__calendar-items");
    // const item = calendarContainer.find(".bk__calendar-item");

    wrapItems.css({ transform: `translate3d(0, 0, 0)` });

    //handle Next slider
    calendarContainer.on("click", ".bk__calendar-next", function (e) {
      if (sliding) {
        return;
      }
      sliding = true;
      setTimeout(() => {
        sliding = false;
      }, 480);
      _this.currentIndex = _this.currentIndex + 1;
      wrapItems.css({
        transform: `translate3d(-${itemWidth * _this.currentIndex}px,0,0)`,
      });
      _this.updateView("addOne");
    });
    //prev date

    calendarContainer.on("click", ".bk__calendar-prev", function (e) {
      if (sliding) {
        return;
      }
      sliding = true;
      setTimeout(() => {
        sliding = false;
      }, 480);

      if (daySelected.isBefore(today) || _this.currentIndex === 0) {
        return;
      } else {
        _this.currentIndex = _this.currentIndex - 1;
        wrapItems.css({
          transform: `translate3d(-${itemWidth * _this.currentIndex}px,0,0)`,
        });
        _this.updateView("removeOne");
      }
    });

    calendarContainer.on("click", ".bk__calendar-item", function (e) {
      const itemIndex = $(e.target).data("index");
      console.log(itemIndex);
    });
  },
};
Bkcalendar.init(constants.LOCALE_VI);
