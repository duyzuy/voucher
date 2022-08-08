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
    Object.defineProperty(this, "today", {
      get: function () {
        return moment(
          this.calendar.today,
          this.calendar.currentLocale.locale.format
        );
      },
    });
    Object.defineProperty(this, "currentSelect", {
      get: function () {
        return moment(
          this.calendar.selected,
          this.calendar.currentLocale.locale.format
        );
      },
    });
    Object.defineProperty(this, "currentLocale", {
      get: function () {
        return this.calendar.currentLocale;
      },
    });
  },
  updateArrayDay: function () {
    const _this = this;
    //get midView of number view;
    const midView = Math.floor(_this.viewRange / 2);

    let startDayOfRange = moment(
      _this.calendar.selected,
      _this.currentLocale.locale.format
    ).add(-midView, "days");
    ß;
    let selectedDate = moment(
      _this.calendar.selected,
      _this.currentLocale.locale.format
    );
    let days = [];
    for (let i = 0; i < _this.viewRange; i++) {
      if (i === 0) {
        days[i] = _this.keysOfDay({
          date: startDayOfRange,
          locale: _this.currentLocale,
          selectedDate,
          today: _this.today,
        });
      } else {
        const nextDay = startDayOfRange.add(1, "days");
        days[i] = _this.keysOfDay({
          date: nextDay,
          locale: _this.currentLocale,
          selectedDate,
          today: _this.today,
        });
      }
    }
    _this.calendar.days = days;
    return days;
  },
  keysOfDay: function ({ date, locale, selectedDate, today }) {
    console.log(selectedDate);
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
      // inRange: date.isAfter(selectedDate.add(-3, "days")) ? false : true,
    };
  },
  updateView(action, dateSelect, indexSelect) {
    const _this = this;
    const locale = _this.calendar.currentLocale;
    //update array day by next/prev or day

    let currentSelect = _this.currentSelect;

    const lastOfRange = _this.calendar.days[_this.calendar.days.length - 1];
    const startOfRange = _this.calendar.days[0];
    if (action === "addOne") {
      const newSelected = currentSelect.add(1, "days");
      _this.calendar.selected = newSelected.format(locale.locale.format);

      const nextDate = _this.keysOfDay({
        date: lastOfRange.moment.add(1, "days"),
        locale,
        selectedDate: newSelected,
        today: _this.today,
      });
      const days = _this.updateArrayDay();
      _this.calendar.days = [..._this.calendar.days, nextDate];

      _this.items({
        dates: _this.calendar.days,
        viewRange: _this.viewRange,
      });
      // _this.calendar.days = _this.calendar.days.splice(1, _this.viewRange);

      return;
    }

    if (action === "removeOne") {
      _this.calendar.selected = selected
        .add(-1, "days")
        .format(locale.locale.format);

      const prevDay = _this.keysOfDay(
        startOfRange.moment.add(-1, "days"),
        locale
      );
    }

    if (action === "changeByDate") {
      _this.calendar.selected = dateSelect;
    }
    //update days array;

    //update view UI
    _this.items({
      dates: _this.calendar.days,
      viewRange: _this.viewRange,
    });
  },
  renderSlider: function () {
    //render calendar
    const _this = this;
    calendarContainer.append(_this.template());

    const reloadCalendar = function (e) {
      const calendarWidth = calendarContainer.width();
      calendarContainer.find("#bk__calendar-items").css({
        width: calendarWidth * 2 + "px",
      });
      if (calendarWidth < 1140) {
        _this.calendar.viewRange = 5;
      }

      _this.updateView();
    };
    $(window).on("resize", reloadCalendar);
    $(window).on("load", reloadCalendar);
  },
  items: function ({ dates, viewRange }) {
    const _this = this;
    calendarContainer.find(".bk__calendar-items").html("");
    let items = "",
      itemWidth = Math.floor((50 * 100) / viewRange) / 100,
      midView = Math.floor(viewRange / 2),
      classes;

    dates.forEach((date, indx) => {
      classes = "bk__calendar-item calendar-date";
      date.inRange && (classes = classes.concat(" ", "in-range"));
      date.selectedDay && (classes = classes.concat(" ", "selected"));
      date.today && (classes = classes.concat(" ", "today"));

      items += `
          <li data-index="${
            indx - midView
          }" style="width: ${itemWidth}%;" class="${classes}"
          data-day="${date.day}" data-value="${date.value}" data-month="${
        date.month
      }"
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

    let sliding = false;
    const containerWidth = calendarContainer.width();

    const itemWidth = Math.floor((50 * 100) / _this.viewRange) / 100;
    const wrapItems = calendarContainer.find(".bk__calendar-items");
    // const item = calendarContainer.find(".bk__calendar-item");

    wrapItems.css({ transform: `translate3d(0, 0, 0)` });

    //handle Next slider
    calendarContainer.on("click", ".bk__calendar-next", function (e) {
      if (sliding) {
        return;
      }
      sliding = true;

      _this.currentIndex = _this.currentIndex + 1;
      _this.updateView("addOne");

      wrapItems.addClass("animating");
      wrapItems.css({
        transform: `translate3d(${-itemWidth * _this.currentIndex}%,0,0)`,
      });
      const itemLists = wrapItems.find(".bk__calendar-item");
      setTimeout(() => {
        sliding = false;
        wrapItems.removeClass("animating");
        wrapItems.css({
          transform: `translate3d(0,0,0)`,
        });
        $(itemLists[0]).remove();
        console.log(itemLists);
        _this.currentIndex = 0;
      }, 480);
    });
    //prev date

    calendarContainer.on("click", ".bk__calendar-prev", function (e) {
      if (sliding === true) return;
      const daySelected = moment(
        _this.calendar.selected,
        _this.calendar.currentLocale.locale.format
      );
      if (
        daySelected.isBefore(today) ||
        daySelected.isSame(today) ||
        _this.currentIndex === -1
      )
        return;

      sliding = true;
      _this.currentIndex = _this.currentIndex - 1;
      _this.updateView("removeOne");
      wrapItems.addClass("animating");
      wrapItems.css({
        transform: `translate3d(${-itemWidth * _this.currentIndex}%,0,0)`,
      });

      setTimeout(() => {
        sliding = false;
        _this.currentIndex = 0;
        wrapItems.removeClass("animating");
        wrapItems.css({
          transform: `translate3d(0,0,0)`,
        });
      }, 480);
    });

    calendarContainer.on("click", ".bk__calendar-item", function (e) {
      if (sliding === true) return;
      const daySelected = moment(
        _this.calendar.selected,
        _this.calendar.currentLocale.locale.format
      );

      if (
        daySelected.isBefore(today) ||
        daySelected.isSame(today) ||
        _this.currentIndex === -1
      )
        return;

      const item = e.target.closest(".bk__calendar-item");
      const itemIndex = $(item).data("index");
      const dateValue = $(item).data("value");
      const dateValueChose = moment(
        dateValue,
        _this.calendar.currentLocale.locale.format
      );
      if (dateValueChose.isBefore(today) || _this.currentIndex === -1) return;

      wrapItems.addClass("animating");
      wrapItems.css({
        transform: `translate3d(${-itemWidth * itemIndex}%,0,0)`,
      });

      setTimeout(() => {
        sliding = false;
        _this.currentIndex = 0;
        wrapItems.removeClass("animating");
        wrapItems.css({
          transform: `translate3d(0,0,0)`,
        });
        _this.updateView("changeByDate", dateValue, itemIndex);
      }, 480);
    });
  },
};
Bkcalendar.init(constants.LOCALE_VI);
