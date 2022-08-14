(function (t, e) {
  if ("function" == typeof define && define.amd)
    define(["moment", "jquery"], function (t, a) {
      return (
        a.fn || (a.fn = {}),
        "function" != typeof t &&
          t.hasOwnProperty("default") &&
          (t = t.default),
        e(t, a)
      );
    });
  else if ("object" == typeof module && module.exports) {
    var a = "undefined" != typeof window ? window.jQuery : void 0;
    a || (a = require("jquery")).fn || (a.fn = {});
    var i =
      "undefined" != typeof window && void 0 !== window.moment
        ? window.moment
        : require("moment");
    module.exports = e(i, a);
  } else t.sliderCalendar = e(t.moment, t.jQuery);
})(this, function (m, $) {
  var calendar = function (el, option, s) {
    (this.parentElement = "body"),
      (this.element = $(el)),
      (this.dateLocale = [
        {
          lang: "en",
          locale: {
            format: "MM-DD-YYYY",
            formatText: "dddd, MMM Do YYYY",
            formatTextShort: "MMM Do YYYY",
            weekLabel: "W",
            daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            daysOfWeekLongname: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            monthNames: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
          },
        },
        {
          lang: "vi",
          locale: {
            format: "DD-MM-YYYY",
            formatText: "dddd, Do MMM YYYY",
            formatTextShort: "Do MMM YYYY",
            weekLabel: "Tuần",
            daysOfWeek: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
            daysOfWeekLongname: [
              "Chủ nhật",
              "Thứ 2",
              "Thứ 3",
              "Thứ 4",
              "Thứ 5",
              "Thứ 6",
              "Thứ 7",
            ],
            monthNames: [
              "Tháng 1",
              "Tháng 2",
              "Tháng 3",
              "Tháng 4",
              "Tháng 5",
              "Tháng 6",
              "Tháng 7",
              "Tháng 8",
              "Tháng 9",
              "Tháng 10",
              "Tháng 11",
              "Tháng 12",
            ],
          },
        },
      ]),
      "string" === typeof option.locale
        ? (this.locale = "vi")
        : (this.locale = option.locale),
      (this.calendar = {
        selected: "",
        days: [],
      }),
      (this.loading = !1),
      (this.viewRange = 7),
      (this.actionSlider = {
        NEXT: "next",
        PREV: "prev",
        CLICK_ITEM: "clickItem",
      }),
      (this.currentLocale = this.dateLocale.find(
        (lc) => lc.lang === this.locale
      )),
      (this.today = m().format(this.currentLocale.locale.format)),
      // this.defineProperties(),
      (this.currentIndex = 0),
      (this.loading = false),
      (this.activeIndex = 3),
      (this.template = `<div class="bk__calendar--container"><span class="bk__calendar-btn bk__calendar-prev"><i class="bi bi-arrow-left-short"></i></span><span class="bk__calendar-btn bk__calendar-next"><i class="bi bi-arrow-right-short"></i></span><div class="bk__calendar--slider"><ul class="bk__calendar-items"></ul></div></div>`),
      (this.container = $(this.template).appendTo(this.element)),
      ((this.wrapItems = $(this.container).find("ul.bk__calendar-items")),
      (this.sliding = !1)),
      "string" === typeof option.selected &&
        (this.calendar.selected = option.selected),
      (this.currentSelect = m(
        this.calendar.selected,
        this.currentLocale.locale.format
      )),
      this.element
        .on("click", ".bk__calendar-prev", $.proxy(this.clickPrev, this))
        .on("click", ".bk__calendar-next", $.proxy(this.clickNext, this))
        .on("click", ".bk__calendar-item", $.proxy(this.clickItem, this));

    this.renderSlider();
    console.log(this);
  };
  return (
    (calendar.prototype = {
      constructor: calendar,
      setDefault: function () {
        //set config

        locale = locale ? locale : "vi";

        const currentLocale = dateLocale.find((lc) => lc.lang === locale);
        this.calendar.currentLocale = currentLocale;

        this.calendar.currentIndex =
          currentIndex === undefined
            ? Math.floor(this.viewRange / 2)
            : currentIndex;
        this.calendar.selected =
          selected === undefined ? this.calendar.today : selected;
        this.viewRange = range === undefined ? 7 : range;
      },
      addDay: function (date, number) {
        if (typeof m === "string") {
          throw new Error("just a moment object");
        }

        const cloneDate = date.clone();

        const newDay = cloneDate.add(number, "days");

        const newDayValue = newDay.format(this.currentLocale.locale.format);

        const newMDay = m(newDayValue, this.currentLocale.locale.format);
        return newMDay;
      },
      updateArrayDay: function () {
        const _this = this;
        //get midView of number view;
        const midView = Math.floor(_this.viewRange / 2);

        const startDayOfRange = this.addDay(this.currentSelect, -midView);

        let days = [];
        for (let i = 0; i < _this.viewRange; i++) {
          let nextDay = this.addDay(startDayOfRange, i);
          days[i] = _this.keysOfDay({
            date: nextDay,
            locale: _this.currentLocale,
            selectedDate: _this.currentSelect,
            today: _this.today,
          });
        }

        _this.calendar.days = days;
        return days;
      },
      updateView: function () {
        //update days array;
        const days = this.updateArrayDay();
        //update view UI
        const items = this.items({
          days: days,
          viewRange: this.viewRange,
        });
        this.container.find(".bk__calendar-items").html(items);
      },
      clickNext: function (e) {
        if (this.loading) return;

        this.loading = true;

        const selectedDay = this.addDay(this.currentSelect, 1);
        const lastOfRangeDay =
          this.calendar.days[this.calendar.days.length - 1];
        const days = this.UpdateDaysAndGetNewDays({
          numberOfDay: 1,
          day: lastOfRangeDay,
          selectedDay,
        });

        this.updateSliderItems({
          days: days,
          action: this.actionSlider.NEXT,
          numberOfDay: 1,
          selectedDay,
          callback: () => {
            this.wrapItems.removeClass("animating").css({
              transform: `translate3d(0,0,0)`,
            });
            this.loading = false;
          },
        });
      },
      clickPrev: function (e) {
        if (this.loading === true) return;
        const currentSelect = this.currentSelect;
        const todayM = m(this.today, this.currentLocale.locale.format);
        if (currentSelect.isBefore(todayM) || currentSelect.isSame(todayM))
          return;

        this.loading = true;
        //take array prevDay
        const selectedDay = this.addDay(this.currentSelect, -1);

        const days = this.UpdateDaysAndGetNewDays({
          numberOfDay: -1,
          day: this.calendar.days[0],
          selectedDay,
        });

        this.updateSliderItems({
          days: days,
          action: this.actionSlider.PREV,
          numberOfDay: -1,
          selectedDay,
          callback: () => {
            this.wrapItems.removeClass("animating");
            this.loading = false;
          },
        });
      },
      clickItem: function (e) {
        const item = e.target.closest(".bk__calendar-item");

        const itemIndex = $(item).attr("data-index");
        const dayValue = $(item).data("value");
        const dayMoment = m(dayValue, this.currentLocale.locale.format);
        const todayM = m(this.today, this.currentLocale.locale.format);
        if (this.loading === true) return;
        if (dayValue === this.calendar.selected) return;
        if (dayMoment.isBefore(todayM)) return;
        if (this.currentSelect.isSame(todayM) && dayMoment.isSame(todayM))
          return;
        this.loading = true;

        const numberOfDay = itemIndex - Math.floor(this.viewRange / 2);
        const arrayDays = this.UpdateDaysAndGetNewDays({
          numberOfDay: numberOfDay,
          day:
            numberOfDay < 0
              ? this.calendar.days[0]
              : this.calendar.days[this.calendar.days.length - 1],
          selectedDay: dayMoment,
        });

        this.updateSliderItems({
          days: numberOfDay < 0 ? arrayDays.reverse() : arrayDays,
          action: this.actionSlider.CLICK_ITEM,
          numberOfDay: numberOfDay,
          selectedDay: dayMoment,
          callback: () => {
            this.loading = false;
            this.wrapItems.removeClass("animating");
            this.wrapItems.css({
              transform: `translate3d(0,0,0)`,
            });
          },
        });
      },
      updateSliderItems: function ({
        days,
        action,
        numberOfDay,
        callback,
        selectedDay,
      }) {
        const itemWidth = Math.floor((50 * 100) / this.viewRange) / 100;
        let itemsRemove = [];
        const items = this.items({
          days: days,
          viewRange: this.viewRange,
        });

        /*
         *
         *  Append/prepend item and default slide position.
         *
         */
        const actionType = numberOfDay > 0 ? "append" : "prepend";
        this.wrapItems[actionType](items).css({
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
          this.wrapItems.addClass("animating");
          this.wrapItems.css({
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
        const numberlastOfArray =
          this.wrapItems.find(".bk__calendar-item").length - 1;
        const itemsDom = this.wrapItems.find(".bk__calendar-item");

        action === this.actionSlider.NEXT &&
          itemsRemove.push(itemsDom[numberStartOfArray]);

        action === this.actionSlider.PREV &&
          itemsRemove.push(itemsDom[numberlastOfArray]);

        if (action === this.actionSlider.CLICK_ITEM) {
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
        const dateValue = selectedDay.format(this.currentLocale.locale.format);
        $(this.wrapItems.find(".bk__calendar-item")).each(function (
          index,
          itemDom
        ) {
          $(itemDom).removeClass("selected");
        });
        setTimeout(() => {
          if (callback && typeof callback === "function") {
            callback();
          }
          itemsRemove.forEach((item) => {
            item.remove();
          });
          $(this.wrapItems.find(".bk__calendar-item")).each(function (
            index,
            itemDom
          ) {
            $(itemDom).attr("data-index", index);
            $(itemDom).removeClass("selected");
            if ($(itemDom).data("value") === dateValue) {
              $(itemDom).addClass("selected");
            }
          });
        }, 480);
      },
      items: function ({ days, viewRange }) {
        let items = "",
          itemWidth = Math.floor((50 * 100) / viewRange) / 100,
          classes;
        days.forEach((day, indx) => {
          classes = "bk__calendar-item calendar-date";
          day.inRange && (classes = classes.concat(" ", "in-range"));
          day.isSelected && (classes = classes.concat(" ", "selected"));
          day.isToday && (classes = classes.concat(" ", "today"));
          day.isNotAvaiable && (classes = classes.concat(" ", "not-avaiable"));
          items = items.concat(`
              <li data-index="${indx}" style="width: ${itemWidth}%;" class="${classes}"
              data-day="${day.day}" data-value="${day.value}" data-month="${day.month}"
              data-year="${day.year}">
              <div class="date-inner">
              <p class="name-of-day">${day.dayName}</p>
              <p class="day-format">${day.altDate}</p></div>
              </li>`);
        });
        return items;
      },
      keysOfDay: function ({ date, locale, selectedDate, today }) {
        const nToday = m(today, this.currentLocale.locale.format);
        return {
          dayName: locale.locale.daysOfWeekLongname[date.get("day") % 7],
          altDate: date
            .locale(locale.lang)
            .format(locale.locale.formatTextShort),
          day: date.get("date"),
          month: date.get("month") + 1,
          year: date.get("year"),
          value: date.format(locale.locale.format),
          moment: date,
          isSelected: date.isSame(selectedDate) ? true : false,
          isToday: date.isSame(nToday) ? true : false,
          isNotAvaiable: date.isBefore(nToday) ? true : false,
        };
      },
      UpdateDaysAndGetNewDays: function ({ numberOfDay, day, selectedDay }) {
        if (typeof numberOfDay === "string") throw new Error("just a number");

        const locale = this.currentLocale;
        const days = [];

        let newDay, num;

        num = numberOfDay < 0 ? -1 : 1;

        this.calendar.selected = selectedDay.format(locale.locale.format);
        this.currentSelect = selectedDay;
        for (let i = 0; i < Math.abs(Number(numberOfDay)); i++) {
          // newDay = this.addDay(day.moment, num);
          newDay = day.moment
            .add(num, "days")
            .format(this.currentLocale.locale.format);
          // newDay = day.moment.add(num, day);
          days.push(
            this.keysOfDay({
              date: newDay,
              locale,
              selectedDate: selectedDay,
              today: this.today,
            })
          );
        }
        this.updateArrayDay();
        return days;
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
            console.log(this);
            return moment(this.today, this.currentLocale.locale.format);
          },
        });
        Object.defineProperty(this, "currentSelect", {
          get: function () {
            return moment(
              this.calendar.selected,
              this.currentLocale.locale.format
            );
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

      renderSlider: function () {
        const _this = this;
        const reloadCalendar = function (e) {
          const calendarWidth = _this.container.width();
          _this.container.find(".bk__calendar-items").css({
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
    }),
    ($.fn.sliderCalendar = function (t, i) {
      var option = $.extend(!0, {}, $.fn.sliderCalendar.defaultOptions, t);

      return (
        this.each(function () {
          var t = $(this);

          t.data("sliderCalendar") && t.data("sliderCalendar").remove(),
            t.data("sliderCalendar", new calendar(t, option, i));
        }),
        this
      );
    }),
    calendar
  );
});

// (function ($) {
//   "use trict";

//   $.fn.sliderCalendar = function ({
//     range,
//     currentIndex,
//     activeIndex,
//     locale,
//     selected,
//     format,
//   } = {}) {
//     const element = this;
//     const dateLocale = [
//       {
//         lang: "en",
//         locale: {
//           format: "MM-DD-YYYY",
//           formatText: "dddd, MMM Do YYYY",
//           formatTextShort: "MMM Do YYYY",
//           weekLabel: "W",
//           daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
//           daysOfWeekLongname: [
//             "Sunday",
//             "Monday",
//             "Tuesday",
//             "Wednesday",
//             "Thursday",
//             "Friday",
//             "Saturday",
//           ],
//           monthNames: [
//             "January",
//             "February",
//             "March",
//             "April",
//             "May",
//             "June",
//             "July",
//             "August",
//             "September",
//             "October",
//             "November",
//             "December",
//           ],
//         },
//       },
//       {
//         lang: "vi",
//         locale: {
//           format: "DD-MM-YYYY",
//           formatText: "dddd, Do MMM YYYY",
//           formatTextShort: "Do MMM YYYY",
//           weekLabel: "Tuần",
//           daysOfWeek: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
//           daysOfWeekLongname: [
//             "Chủ nhật",
//             "Thứ 2",
//             "Thứ 3",
//             "Thứ 4",
//             "Thứ 5",
//             "Thứ 6",
//             "Thứ 7",
//           ],
//           monthNames: [
//             "Tháng 1",
//             "Tháng 2",
//             "Tháng 3",
//             "Tháng 4",
//             "Tháng 5",
//             "Tháng 6",
//             "Tháng 7",
//             "Tháng 8",
//             "Tháng 9",
//             "Tháng 10",
//             "Tháng 11",
//             "Tháng 12",
//           ],
//         },
//       },
//     ];
//     const actionSlider = {
//       NEXT: "next",
//       PREV: "prev",
//       CLICK_ITEM: "clickItem",
//     };
//     const plug = {
//       calendar: {
//         selected: "",
//         today: "",
//         days: [],
//         currentLocale: {},
//       },
//       viewRange: 7,
//       currentIndex: 0,
//       activeIndex: 3,
//       loading: false,
//       start: function () {
//         //set current day
//         this.setDefault();

//         //define properties
//         this.defineProperties();

//         //update days on calendar
//         this.updateArrayDay();
//         //render template
//         this.renderSlider();

//         this.handleEvents();

//         if (plug.prototype !== "undefined") {
//           element.bind("setlect.calendar", () => {
//             plug.prototype.getData((data) => {
//               console.log(data);
//             });
//           });
//         }
//       },

//       setDefault: function () {
//         //set config

//         locale = locale ? locale : "vi";

//         const currentLocale = dateLocale.find((lc) => lc.lang === locale);
//         this.calendar.currentLocale = currentLocale;

//         this.calendar.currentIndex =
//           currentIndex === undefined
//             ? Math.floor(this.viewRange / 2)
//             : currentIndex;
//         this.calendar.today = moment().format(currentLocale.locale.format);
//         this.calendar.selected =
//           selected === undefined ? this.calendar.today : selected;
//         this.viewRange = range === undefined ? 7 : range;
//       },
//       defineProperties: function () {
//         Object.defineProperty(this, "currentDay", {
//           get: function () {
//             return moment().get("date");
//           },
//         });

//         Object.defineProperty(this, "currentMonth", {
//           get: function () {
//             return moment().get("month") + 1;
//           },
//         });
//         Object.defineProperty(this, "currentYear", {
//           get: function () {
//             return moment().get("year");
//           },
//         });
//         Object.defineProperty(this, "startOfMonth", {
//           get: function () {
//             return moment().startOf("month");
//           },
//         });
//         Object.defineProperty(this, "endOfMonth", {
//           get: function () {
//             return moment().endOf("month");
//           },
//         });
//         Object.defineProperty(this, "today", {
//           get: function () {
//             return moment(
//               this.calendar.today,
//               this.calendar.currentLocale.locale.format
//             );
//           },
//         });
//         Object.defineProperty(this, "currentSelect", {
//           get: function () {
//             return moment(
//               this.calendar.selected,
//               this.calendar.currentLocale.locale.format
//             );
//           },
//         });
//         Object.defineProperty(this, "currentLocale", {
//           get: function () {
//             return this.calendar.currentLocale;
//           },
//         });
//         Object.defineProperty(this, "startOfRangeDay", {
//           get: function () {
//             return this.calendar.days[0];
//           },
//         });
//         Object.defineProperty(this, "lastOfRangeDay", {
//           get: function () {
//             return this.calendar.days[this.calendar.days.length - 1];
//           },
//         });
//       },
//       updateArrayDay: function () {
//         const _this = this;
//         //get midView of number view;
//         const midView = Math.floor(_this.viewRange / 2);

//         const startDayOfRange = _this.currentSelect.add(-midView, "days");
//         const dayValueOfstartDayOfRange = startDayOfRange.format(
//           _this.currentLocale.locale.format
//         );
//         let selectedDate = _this.currentSelect;
//         let days = [];
//         for (let i = 0; i < _this.viewRange; i++) {
//           if (i === 0) {
//             days[i] = _this.keysOfDay({
//               date: startDayOfRange,
//               locale: _this.currentLocale,
//               selectedDate,
//               today: _this.today,
//               moment: moment(
//                 dayValueOfstartDayOfRange,
//                 _this.currentLocale.locale.format
//               ),
//             });
//           } else {
//             let nextDay = startDayOfRange.add(1, "days");
//             let nextDayValue = nextDay.format(
//               _this.currentLocale.locale.format
//             );
//             days[i] = _this.keysOfDay({
//               date: nextDay,
//               locale: _this.currentLocale,
//               selectedDate,
//               today: _this.today,
//               moment: moment(nextDayValue, _this.currentLocale.locale.format),
//             });
//           }
//         }
//         _this.calendar.days = days;

//         element.trigger("setlect.calendar");
//         return days;
//       },
//       UpdateDaysAndGetNewDays: function ({ numberOfDay, day, selectedDay }) {
//         if (typeof numberOfDay === "string") throw new Error("just a number");
//         const _this = this;
//         const locale = _this.calendar.currentLocale;
//         const days = [];

//         let newDay, newCurrentDate, num;

//         num = numberOfDay < 0 ? -1 : 1;

//         _this.calendar.selected = selectedDay.format(locale.locale.format);

//         for (let i = 0; i < Math.abs(Number(numberOfDay)); i++) {
//           newDay = day.moment.add(num, "days").format(locale.locale.format);
//           days.push(
//             _this.keysOfDay({
//               date: moment(newDay, locale.locale.format),
//               locale,
//               selectedDate: moment(newCurrentDate, locale.locale.format),
//               today: _this.today,
//               moment: moment(newDay, locale.locale.format),
//             })
//           );
//         }
//         _this.updateArrayDay();
//         return days;
//       },
//       keysOfDay: function ({ date, locale, selectedDate, today, moment }) {
//         return {
//           dayName: locale.locale.daysOfWeekLongname[date.get("day") % 7],
//           altDate: date
//             .locale(locale.lang)
//             .format(locale.locale.formatTextShort),
//           day: date.get("date"),
//           month: date.get("month") + 1,
//           year: date.get("year"),
//           value: date.format(locale.locale.format),
//           moment,
//           selectedDay: date.isSame(selectedDate) ? true : false,
//           today: date.isSame(today) ? true : false,
//           notAvaiable: date.isBefore(today) ? true : false,
//         };
//       },
//       updateView() {
//         //update days array;
//         const days = this.updateArrayDay();
//         //update view UI
//         const items = this.items({
//           dates: days,
//           viewRange: this.viewRange,
//         });
//         element.find(".bk__calendar-items").html(items);
//       },
//       renderSlider: function () {
//         //render calendar
//         const _this = this;
//         element.append(_this.template());

//         const reloadCalendar = function (e) {
//           const calendarWidth = element.width();
//           element.find(".bk__calendar-items").css({
//             width: "200%",
//           });
//           if (calendarWidth > 1140) {
//             _this.viewRange = 7;
//           }
//           if (600 < calendarWidth && calendarWidth < 1140) {
//             _this.viewRange = 5;
//           }
//           if (calendarWidth < 600) {
//             _this.viewRange = 3;
//           }
//           _this.currentIndex = Math.floor(_this.viewRange / 2);

//           _this.updateView();
//         };
//         $(window).on("resize", reloadCalendar);
//         $(window).on("load", reloadCalendar);
//       },
//       items: function ({ dates, viewRange }) {
//         let items = "",
//           itemWidth = Math.floor((50 * 100) / viewRange) / 100,
//           classes;
//         dates.forEach((date, indx) => {
//           classes = "bk__calendar-item calendar-date";
//           date.inRange && (classes = classes.concat(" ", "in-range"));
//           date.selectedDay && (classes = classes.concat(" ", "selected"));
//           date.today && (classes = classes.concat(" ", "today"));
//           date.notAvaiable && (classes = classes.concat(" ", "not-avaiable"));
//           items += `
//               <li data-index="${indx}" style="width: ${itemWidth}%;" class="${classes}"
//               data-day="${date.day}" data-value="${date.value}" data-month="${date.month}"
//               data-year="${date.year}">
//               <div class="date-inner">
//               <p class="name-of-day">${date.dayName}</p>
//               <p class="day-format">${date.altDate}</p></div>
//               </li>`;
//         });

//         return items;
//       },
//       template: function () {
//         let template = `<div class="bk__calendar--container">
//         <span class="bk__calendar-btn bk__calendar-prev"><i class="bi bi-arrow-left-short"></i></span>
//         <span class="bk__calendar-btn bk__calendar-next"><i class="bi bi-arrow-right-short"></i></span>
//         <div class="bk__calendar--slider">
//         <ul class="bk__calendar-items"></ul></div></div>`;
//         return template;
//       },

//       handleEvents: function () {
//         const _this = this;
//         const today = _this.today;
//         let sliding = false;
//         const locale = _this.currentLocale;
//         const wrapItems = element.find(".bk__calendar-items");

//         wrapItems.css({ transform: `translate3d(0, 0, 0)` });

//         const updateSliderItems = ({
//           days,
//           action,
//           numberOfDay,
//           callback,
//           selectedDay,
//         }) => {
//           const itemWidth = Math.floor((50 * 100) / _this.viewRange) / 100;
//           let itemsRemove = [];
//           const items = _this.items({
//             dates: days,
//             viewRange: _this.viewRange,
//           });

//           /*
//            *
//            *  Append/prepend item and default slide position.
//            *
//            */
//           const actionType = numberOfDay > 0 ? "append" : "prepend";
//           wrapItems[actionType](items).css({
//             transform:
//               numberOfDay > 0
//                 ? `translate3d(0,0,0)`
//                 : `translate3d(${-itemWidth * Math.abs(numberOfDay)}%,0,0)`,
//           });

//           /*
//            *
//            *  set point to slide.
//            *
//            */
//           setTimeout(() => {
//             wrapItems.addClass("animating");
//             wrapItems.css({
//               transform:
//                 numberOfDay > 0
//                   ? `translate3d(${-itemWidth * Math.abs(numberOfDay)}%,0,0)`
//                   : `translate3d(0,0,0)`,
//             });
//           });

//           /*
//            *
//            *  Set item need to remove on slider
//            *
//            */
//           const numberStartOfArray = 0;
//           const numberlastOfArray =
//             wrapItems.find(".bk__calendar-item").length - 1;
//           const itemsDom = wrapItems.find(".bk__calendar-item");

//           action === actionSlider.NEXT &&
//             itemsRemove.push(itemsDom[numberStartOfArray]);

//           action === actionSlider.PREV &&
//             itemsRemove.push(itemsDom[numberlastOfArray]);

//           if (action === actionSlider.CLICK_ITEM) {
//             for (let i = 0; i < Math.abs(numberOfDay); i++) {
//               numberOfDay < 0
//                 ? itemsRemove.push(itemsDom[numberlastOfArray - i])
//                 : itemsRemove.push(itemsDom[numberStartOfArray + i]);
//             }
//           }
//           /*
//            *
//            *  Update index andclass Name each item
//            *
//            */
//           const dateValue = selectedDay.format(locale.locale.format);
//           $(wrapItems.find(".bk__calendar-item")).each(function (
//             index,
//             itemDom
//           ) {
//             $(itemDom).removeClass("selected");
//           });
//           setTimeout(() => {
//             if (callback && typeof callback === "function") {
//               callback();
//             }
//             itemsRemove.forEach((item) => {
//               item.remove();
//             });
//             $(wrapItems.find(".bk__calendar-item")).each(function (
//               index,
//               itemDom
//             ) {
//               $(itemDom).attr("data-index", index);
//               $(itemDom).removeClass("selected");
//               if ($(itemDom).data("value") === dateValue) {
//                 $(itemDom).addClass("selected");
//               }
//             });
//           }, 480);
//         };
//         //handle Next slider
//         const nextSlider = function (e) {
//           if (sliding) {
//             return;
//           }
//           sliding = true;

//           const selectedDay = _this.currentSelect.add(1, "days");
//           const arrayDays = _this.UpdateDaysAndGetNewDays({
//             numberOfDay: 1,
//             day: _this.lastOfRangeDay,
//             selectedDay,
//           });

//           updateSliderItems({
//             days: arrayDays,
//             action: actionSlider.NEXT,
//             numberOfDay: 1,
//             selectedDay,
//             callback: () => {
//               wrapItems.removeClass("animating").css({
//                 transform: `translate3d(0,0,0)`,
//               });
//               sliding = false;
//             },
//           });
//         };

//         const prevSlider = function (e) {
//           if (sliding === true) return;
//           const currentSelect = _this.currentSelect;
//           if (currentSelect.isBefore(today) || currentSelect.isSame(today))
//             return;

//           sliding = true;
//           //take array prevDay
//           const selectedDay = _this.currentSelect.add(-1, "days");
//           const arrayDays = _this.UpdateDaysAndGetNewDays({
//             numberOfDay: -1,
//             day: _this.startOfRangeDay,
//             selectedDay,
//           });

//           updateSliderItems({
//             days: arrayDays,
//             action: actionSlider.PREV,
//             numberOfDay: -1,
//             selectedDay,
//             callback: () => {
//               wrapItems.removeClass("animating");
//               sliding = false;
//             },
//           });
//         };
//         const itemSlider = function (e) {
//           const item = e.target.closest(".bk__calendar-item");

//           const itemIndex = $(item).attr("data-index");
//           const dayValue = $(item).data("value");
//           const dayMoment = moment(dayValue, locale.locale.format);

//           if (sliding === true) return;
//           if (dayValue === _this.calendar.selected) return;
//           if (dayMoment.isBefore(today)) return;
//           if (_this.currentSelect.isSame(today) && dayMoment.isSame(today))
//             return;
//           sliding = true;

//           const numberOfDay = itemIndex - Math.floor(_this.viewRange / 2);
//           const arrayDays = _this.UpdateDaysAndGetNewDays({
//             numberOfDay: numberOfDay,
//             day: numberOfDay < 0 ? _this.startOfRangeDay : _this.lastOfRangeDay,
//             selectedDay: dayMoment,
//           });

//           updateSliderItems({
//             days: numberOfDay < 0 ? arrayDays.reverse() : arrayDays,
//             action: "clickItem",
//             numberOfDay: numberOfDay,
//             selectedDay: dayMoment,
//             callback: () => {
//               sliding = false;
//               wrapItems.removeClass("animating");
//               wrapItems.css({
//                 transform: `translate3d(0,0,0)`,
//               });
//             },
//           });
//         };
//         element.on("click", $.proxy(_this.clickNext), _this);
//         // element.on(
//         //   "click.calendar",
//         //   ".bk__calendar-next",
//         //   $.proxy(nextSlider, this)
//         // );
//         // element.on("click", ".bk__calendar-next", nextSlider);
//         //prev date
//         element.on("click", ".bk__calendar-prev", prevSlider);

//         element.on(
//           "click",
//           ".bk__calendar-item:not(.not-avaiable, .selected)",
//           itemSlider
//         );
//       },
//     };

//     plug.start();

//     return (plug.prototype = {
//       constructor: plug,
//       clickNext: function () {
//         console.log(this);
//       },
//       getData: function (callback) {
//         console.log(plug);
//         return callback(plug.calendar);
//       },
//     });
//   };
// })(jQuery);
