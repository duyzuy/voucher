import { constants } from "./constant.js";
import config, { baseURL, languageId } from "./config.js";
import { bookingFormText, dateLocale } from "./translate.js";

const calendarContainer = $("#bk__calendar");
const Bkcalendar = {
  calendar: {
    selected: "15-08-2022",
    today: "",
    days: [],
    currentLocale: {},
  },
  viewRange: 7,
  currentIndex: 0,
  activeIndex: 3,
  init: function (locale) {
    //set current day

    this.setDefault(locale);

    //define properties
    this.defineProperties();
    this.updateArrayDay();
    //render template
    this.renderSlider();

    this.handleEvents();
  },
  setDefault: function (locale) {
    const currentLocale = dateLocale.find((lc) => lc.lang === locale);
    this.calendar.currentLocale = currentLocale;
    this.currentIndex = Math.floor(this.viewRange / 2);
    this.calendar.today = moment().format(currentLocale.locale.format);
  },
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

    const startDayOfRange = _this.currentSelect.add(-midView, "days");

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
          moment: moment(
            `${startDayOfRange.get("date")}-${
              startDayOfRange.get("month") + 1
            }-${startDayOfRange.get("year")}`,
            _this.currentLocale.locale.format
          ),
        });
      } else {
        let nextDay = startDayOfRange.add(1, "days");
        days[i] = _this.keysOfDay({
          date: nextDay,
          locale: _this.currentLocale,
          selectedDate,
          today: _this.today,
          moment: moment(
            `${nextDay.get("date")}-${nextDay.get("month") + 1}-${nextDay.get(
              "year"
            )}`,
            _this.currentLocale.locale.format
          ),
        });
      }
    }
    _this.calendar.days = days;
    return days;
  },
  getArrayDayByNumber: function (day, num, locale, selectedDate, today) {
    if (typeof day === "string") throw new Error("just only moment");
    if (typeof num === "string") throw new Error("just a number");

    const days = [];
    let newDay;
    for (let i = 0; i < Math.abs(Number(num)); i++) {
      if (Number(num) < 0) {
        newDay = day.moment.add(-1, "days");
      } else {
        newDay = day.moment.add(1, "days");
      }
      days.push({
        dayName: locale.locale.daysOfWeekLongname[newDay.get("day") % 7],
        altDate: newDay
          .locale(locale.lang)
          .format(locale.locale.formatTextShort),
        day: newDay.get("date"),
        month: newDay.get("month") + 1,
        year: newDay.get("year"),
        value: newDay.format(locale.locale.format),
        moment: moment(
          `${newDay.get("date")}-${newDay.get("month") + 1}-${newDay.get(
            "year"
          )}`,
          locale.locale.format
        ),
        selectedDay: newDay.isSame(selectedDate) ? true : false,
        today: newDay.isSame(today) ? true : false,
        notAvaiable: newDay.isBefore(today) ? true : false,
      });
    }

    return days;
  },
  keysOfDay: function ({ date, locale, selectedDate, today, moment }) {
    return {
      dayName: locale.locale.daysOfWeekLongname[date.get("day") % 7],
      altDate: date.locale(locale.lang).format(locale.locale.formatTextShort),
      day: date.get("date"),
      month: date.get("month") + 1,
      year: date.get("year"),
      value: date.format(locale.locale.format),
      moment,
      selectedDay: date.isSame(selectedDate) ? true : false,
      today: date.isSame(today) ? true : false,
      notAvaiable: date.isBefore(today) ? true : false,
    };
  },
  updateView({ action, dateSelect, indexItem, callback } = {}) {
    const _this = this;
    const locale = _this.calendar.currentLocale;
    //update array day by next/prev or day

    let currentSelect = _this.currentSelect;

    if (action === "addOne") {
      const newSelected = currentSelect.add(1, "days");
      _this.calendar.selected = newSelected.format(locale.locale.format);
    }

    if (action === "removeOne") {
      const newSelected = currentSelect.add(-1, "days");
      _this.calendar.selected = newSelected.format(locale.locale.format);
    }

    if (action === "changeByDate") {
      _this.calendar.selected = dateSelect;
    }
    //update days array;
    const days = _this.updateArrayDay();
    //update view UI
    const items = _this.items({
      dates: days,
      viewRange: _this.viewRange,
    });
    calendarContainer.find("#bk__calendar-items").html(items);
  },
  renderSlider: function () {
    //render calendar
    const _this = this;
    calendarContainer.append(_this.template());

    const reloadCalendar = function (e) {
      const calendarWidth = calendarContainer.width();
      calendarContainer.find("#bk__calendar-items").css({
        width: "200%",
      });
      if (calendarWidth > 1140) {
        _this.viewRange = 7;
      }
      if (600 < calendarWidth && calendarWidth < 1140) {
        _this.viewRange = 5;
      }
      if (calendarWidth < 600) {
        _this.viewRange = 3;
      }
      _this.currentIndex = Math.floor(_this.viewRange / 2);

      _this.updateView();
    };
    $(window).on("resize", reloadCalendar);
    $(window).on("load", reloadCalendar);
  },
  items: function ({ dates, viewRange }) {
    let items = "",
      itemWidth = Math.floor((50 * 100) / viewRange) / 100,
      classes;
    dates.forEach((date, indx) => {
      classes = "bk__calendar-item calendar-date";
      date.inRange && (classes = classes.concat(" ", "in-range"));
      date.selectedDay && (classes = classes.concat(" ", "selected"));
      date.today && (classes = classes.concat(" ", "today"));
      date.notAvaiable && (classes = classes.concat(" ", "not-avaiable"));
      items += `
          <li data-index="${indx}" style="width: ${itemWidth}%;" class="${classes}"
          data-day="${date.day}" data-value="${date.value}" data-month="${date.month}"
          data-year="${date.year}">
          <div class="date-inner">
          <p class="name-of-day">${date.dayName}</p>
          <p class="day-format">${date.altDate}</p></div>
          </li>`;
    });

    return items;
  },
  template: function () {
    let template = `<div id="bk__calendar--container" class="bk__calendar--container">
    <span class="bk__calendar-btn bk__calendar-prev"><i class="bi bi-arrow-left-short"></i></span>
    <span class="bk__calendar-btn bk__calendar-next"><i class="bi bi-arrow-right-short"></i></span>
    <div id="bk__calendar--slider" class="bk__calendar--slider">
    <ul id="bk__calendar-items" class="bk__calendar-items"></ul></div></div>`;
    return template;
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
    const today = _this.today;

    let sliding = false;
    const containerWidth = calendarContainer.width();

    const wrapItems = calendarContainer.find(".bk__calendar-items");

    wrapItems.css({ transform: `translate3d(0, 0, 0)` });

    //handle Next slider
    calendarContainer.on("click", ".bk__calendar-next", function (e) {
      if (sliding) {
        return;
      }
      sliding = true;

      const lastOfRange = _this.calendar.days[_this.calendar.days.length - 1];
      const daySelected = _this.currentSelect;
      const arrayDays = _this.getArrayDayByNumber(
        lastOfRange,
        1,
        _this.calendar.currentLocale,
        daySelected,
        today
      );
      const itemWidth = Math.floor((50 * 100) / _this.viewRange) / 100;
      const items = _this.items({
        dates: arrayDays,
        viewRange: _this.viewRange,
      });

      wrapItems.append(items).css({
        transform: `translate3d(0,0,0)`,
      });

      setTimeout(() => {
        wrapItems.addClass("animating");
        wrapItems.css({
          transform: `translate3d(${-itemWidth}%,0,0)`,
        });
      });

      setTimeout(() => {
        _this.updateView({
          action: "addOne",
        });
        wrapItems.removeClass("animating").css({
          transform: `translate3d(0,0,0)`,
        });
        sliding = false;
      }, 480);
    });
    //prev date

    calendarContainer.on("click", ".bk__calendar-prev", function (e) {
      if (sliding === true) return;
      const daySelected = _this.currentSelect;
      if (daySelected.isBefore(today) || daySelected.isSame(today)) return;

      sliding = true;
      const firstOfRange = _this.calendar.days[0];
      const itemWidth = Math.floor((50 * 100) / _this.viewRange) / 100;
      const arrayDays = _this.getArrayDayByNumber(
        firstOfRange,
        -1,
        _this.calendar.currentLocale,
        daySelected,
        today
      );

      const items = _this.items({
        dates: arrayDays,
        viewRange: _this.viewRange,
      });

      wrapItems.prepend(items).css({
        transform: `translate3d(${-itemWidth}%,0,0)`,
      });

      setTimeout(() => {
        wrapItems.addClass("animating");
        wrapItems.css({
          transform: `translate3d(0,0,0)`,
        });
      });

      setTimeout(() => {
        _this.updateView({
          action: "removeOne",
        });

        wrapItems.removeClass("animating");
        sliding = false;
      }, 480);
    });

    calendarContainer.on(
      "click",
      ".bk__calendar-item:not(.not-avaiable)",
      function (e) {
        const item = e.target.closest(".bk__calendar-item");
        const itemIndex = $(item).data("index");
        const dayValue = $(item).data("value");
        const dayClick = _this.calendar.days.find(
          (day) => day.value === dayValue
        );
        const itemWidth = Math.floor((50 * 100) / _this.viewRange) / 100;
        if (sliding === true) return;

        if (dayClick.moment.isBefore(today)) return;
        if (_this.currentSelect.isSame(today) && dayClick.moment.isSame(today))
          return;
        sliding = true;

        const daySelected = _this.currentSelect;
        const arrayDays = _this.getArrayDayByNumber(
          Number(itemIndex - _this.currentIndex) < 0
            ? _this.calendar.days[0]
            : _this.calendar.days[_this.calendar.days.length - 1],
          itemIndex - _this.currentIndex,
          _this.calendar.currentLocale,
          daySelected,
          today
        );

        let items;

        if (Number(itemIndex - _this.currentIndex) < 0) {
          items = _this.items({
            dates: arrayDays.reverse(),
            viewRange: _this.viewRange,
          });

          wrapItems.prepend(items).css({
            transform: `translate3d(${
              itemWidth * (itemIndex - _this.currentIndex)
            }%,0,0)`,
          });
        } else {
          items = _this.items({
            dates: arrayDays,
            viewRange: _this.viewRange,
          });
          wrapItems.append(items).css({
            transform: `translate3d(0,0,0)`,
          });
        }

        setTimeout(() => {
          wrapItems.addClass("animating");
          if (Number(itemIndex - _this.currentIndex) < 0) {
            wrapItems.css({
              transform: `translate3d(0,0,0)`,
            });
          } else {
            wrapItems.css({
              transform: `translate3d(${
                -itemWidth * (itemIndex - _this.currentIndex)
              }%,0,0)`,
            });
          }
        });

        setTimeout(() => {
          sliding = false;
          wrapItems.removeClass("animating");
          wrapItems.css({
            transform: `translate3d(0,0,0)`,
          });
          _this.updateView({
            action: "changeByDate",
            dateSelect: dayValue,
            indexItem: itemIndex,
          });
        }, 480);
      }
    );

    //handle click detail
    $(".flight-option-item").on(
      "click",
      ".btn-flight-option-detail",
      function (e) {
        const item = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent();
        $(".flight-option-item").removeClass("expanded");
        if (item.hasClass("expanded")) {
          item.removeClass("expanded");
        } else {
          item.addClass("expanded");
        }
      }
    );
  },
};
Bkcalendar.init(constants.LOCALE_VI);
