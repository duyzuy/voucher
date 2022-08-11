import { constants, bookingInformation } from "./constant.js";
import { bookingFormText, dateLocale } from "./translate.js";
const actionSlider = {
  NEXT: "next",
  PREV: "prev",
  CLICK_ITEM: "clickItem",
};

const calendarContainer = $("#bk__calendar");
const flightItem = $(".flight-option-item");
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
  loading: false,
  init: function (locale) {
    //set current day

    this.setDefault(locale);

    //define properties
    this.defineProperties();

    //update days on calendar
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
    Object.defineProperty(this, "startOfRangeDay", {
      get: function () {
        return this.calendar.days[0];
      },
    });
    Object.defineProperty(this, "lastOfRangeDay", {
      get: function () {
        return this.calendar.days[this.calendar.days.length - 1];
      },
    });
  },
  updateArrayDay: function () {
    const _this = this;
    //get midView of number view;
    const midView = Math.floor(_this.viewRange / 2);

    const startDayOfRange = _this.currentSelect.add(-midView, "days");
    const dayValueOfstartDayOfRange = startDayOfRange.format(
      _this.currentLocale.locale.format
    );
    let selectedDate = _this.currentSelect;
    let days = [];
    for (let i = 0; i < _this.viewRange; i++) {
      if (i === 0) {
        days[i] = _this.keysOfDay({
          date: startDayOfRange,
          locale: _this.currentLocale,
          selectedDate,
          today: _this.today,
          moment: moment(
            dayValueOfstartDayOfRange,
            _this.currentLocale.locale.format
          ),
        });
      } else {
        let nextDay = startDayOfRange.add(1, "days");
        let nextDayValue = nextDay.format(_this.currentLocale.locale.format);
        days[i] = _this.keysOfDay({
          date: nextDay,
          locale: _this.currentLocale,
          selectedDate,
          today: _this.today,
          moment: moment(nextDayValue, _this.currentLocale.locale.format),
        });
      }
    }
    _this.calendar.days = days;
    return days;
  },
  UpdateDaysAndGetNewDays: function ({ numberOfDay, day, selectedDay }) {
    if (typeof numberOfDay === "string") throw new Error("just a number");
    const _this = this;
    const locale = _this.calendar.currentLocale;
    const days = [];

    let newDay, newCurrentDate, num;

    num = numberOfDay < 0 ? -1 : 1;

    _this.calendar.selected = selectedDay.format(locale.locale.format);

    for (let i = 0; i < Math.abs(Number(numberOfDay)); i++) {
      newDay = day.moment.add(num, "days").format(locale.locale.format);
      days.push(
        _this.keysOfDay({
          date: moment(newDay, locale.locale.format),
          locale,
          selectedDate: moment(newCurrentDate, locale.locale.format),
          today: _this.today,
          moment: moment(newDay, locale.locale.format),
        })
      );
    }
    _this.updateArrayDay();
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
  updateView() {
    //update days array;
    const days = this.updateArrayDay();
    //update view UI
    const items = this.items({
      dates: days,
      viewRange: this.viewRange,
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
  handleEvents: function () {
    const _this = this;
    const today = _this.today;
    let sliding = false;
    const locale = _this.currentLocale;
    const wrapItems = calendarContainer.find(".bk__calendar-items");

    wrapItems.css({ transform: `translate3d(0, 0, 0)` });

    const updateSliderItems = ({
      days,
      action,
      numberOfDay,
      callback,
      selectedDay,
    }) => {
      const itemWidth = Math.floor((50 * 100) / _this.viewRange) / 100;
      let itemsRemove = [];
      const items = _this.items({
        dates: days,
        viewRange: _this.viewRange,
      });

      /*
       *
       *  Append/prepend item and default slide position.
       *
       */
      const actionType = numberOfDay > 0 ? "append" : "prepend";
      wrapItems[actionType](items).css({
        transform:
          numberOfDay > 0
            ? `translate3d(0,0,0)`
            : `translate3d(${-itemWidth * Math.abs(numberOfDay)}%,0,0)`,
      });

      /*
       *
       *  set point to slide.
       *
       */
      setTimeout(() => {
        wrapItems.addClass("animating");
        wrapItems.css({
          transform:
            numberOfDay > 0
              ? `translate3d(${-itemWidth * Math.abs(numberOfDay)}%,0,0)`
              : `translate3d(0,0,0)`,
        });
      });

      /*
       *
       *  Set item need to remove on slider
       *
       */
      const numberStartOfArray = 0;
      const numberlastOfArray = wrapItems.find(".bk__calendar-item").length - 1;
      const itemsDom = wrapItems.find(".bk__calendar-item");

      action === actionSlider.NEXT &&
        itemsRemove.push(itemsDom[numberStartOfArray]);

      action === actionSlider.PREV &&
        itemsRemove.push(itemsDom[numberlastOfArray]);

      if (action === actionSlider.CLICK_ITEM) {
        for (let i = 0; i < Math.abs(numberOfDay); i++) {
          numberOfDay < 0
            ? itemsRemove.push(itemsDom[numberlastOfArray - i])
            : itemsRemove.push(itemsDom[numberStartOfArray + i]);
        }
      }
      /*
       *
       *  Update index andclass Name each item
       *
       */
      const dateValue = selectedDay.format(locale.locale.format);

      setTimeout(() => {
        if (callback && typeof callback === "function") {
          callback();
        }
        itemsRemove.forEach((item) => {
          item.remove();
        });
        $(wrapItems.find(".bk__calendar-item")).each(function (index, itemDom) {
          $(itemDom).attr("data-index", index);
          $(itemDom).removeClass("selected");
          if ($(itemDom).data("value") === dateValue) {
            $(itemDom).addClass("selected");
          }
        });
      }, 480);
    };
    //handle Next slider
    calendarContainer.on("click", ".bk__calendar-next", function (e) {
      if (sliding) {
        return;
      }
      sliding = true;

      const selectedDay = _this.currentSelect.add(1, "days");
      const arrayDays = _this.UpdateDaysAndGetNewDays({
        numberOfDay: 1,
        day: _this.lastOfRangeDay,
        selectedDay,
      });

      updateSliderItems({
        days: arrayDays,
        action: actionSlider.NEXT,
        numberOfDay: 1,
        selectedDay,
        callback: () => {
          wrapItems.removeClass("animating").css({
            transform: `translate3d(0,0,0)`,
          });
          sliding = false;
        },
      });
    });
    //prev date
    calendarContainer.on("click", ".bk__calendar-prev", function (e) {
      if (sliding === true) return;
      const currentSelect = _this.currentSelect;
      if (currentSelect.isBefore(today) || currentSelect.isSame(today)) return;

      sliding = true;
      //take array prevDay
      const selectedDay = _this.currentSelect.add(-1, "days");
      const arrayDays = _this.UpdateDaysAndGetNewDays({
        numberOfDay: -1,
        day: _this.startOfRangeDay,
        selectedDay,
      });

      updateSliderItems({
        days: arrayDays,
        action: actionSlider.PREV,
        numberOfDay: -1,
        selectedDay,
        callback: () => {
          wrapItems.removeClass("animating");
          sliding = false;
        },
      });

      //ajax Data
    });
    calendarContainer.on(
      "click",
      ".bk__calendar-item:not(.not-avaiable, .selected)",
      function (e) {
        const item = e.target.closest(".bk__calendar-item");

        const itemIndex = $(item).attr("data-index");
        const dayValue = $(item).data("value");
        const dayMoment = moment(dayValue, locale.locale.format);

        if (sliding === true) return;
        if (dayValue === _this.calendar.selected) return;
        if (dayMoment.isBefore(today)) return;
        if (_this.currentSelect.isSame(today) && dayMoment.isSame(today))
          return;
        sliding = true;

        const numberOfDay = itemIndex - Math.floor(_this.viewRange / 2);
        const arrayDays = _this.UpdateDaysAndGetNewDays({
          numberOfDay: numberOfDay,
          day: numberOfDay < 0 ? _this.startOfRangeDay : _this.lastOfRangeDay,
          selectedDay: dayMoment,
        });

        updateSliderItems({
          days: numberOfDay < 0 ? arrayDays.reverse() : arrayDays,
          action: "clickItem",
          numberOfDay: numberOfDay,
          selectedDay: dayMoment,
          callback: () => {
            sliding = false;
            wrapItems.removeClass("animating");
            wrapItems.css({
              transform: `translate3d(0,0,0)`,
            });
          },
        });
      }
    );

    //handle click
    flightItem.on("click", ".btn-flight-option-detail", function (e) {
      e.preventDefault();

      const item = $(this).closest(".flight-option-item");
      const dropdownItem = item.find(".flight-option-dropdown");

      if (item.hasClass("expanded")) {
        item.removeClass("expanded");
        $(dropdownItem[0]).removeAttr("style");
      } else {
        flightItem.hasClass("expanded") && flightItem.removeClass("expanded");
        $(flightItem.find(".flight-option-dropdown")).removeAttr("style");
        item.addClass("expanded");
        $(dropdownItem[0]).css({ height: dropdownItem[0].scrollHeight });
      }
    });
  },
};
Bkcalendar.init(constants.LOCALE_VI);
