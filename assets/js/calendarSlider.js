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
        currentSelect: "",
        days: [],
      }),
      (this.isLoading = !1),
      (this.isSliding = !1),
      (this.viewRange = 7),
      (this.isWindowResize = !1),
      (this.actionSlider = {
        NEXT: "next",
        PREV: "prev",
        CLICK_ITEM: "clickItem",
      }),
      (this.currentLocale = this.dateLocale.find(
        (lc) => lc.lang === this.locale
      )),
      (this.today = m().format(this.currentLocale.locale.format)),
      this.defineProperties(),
      (this.currentIndex = 3),
      (this.activeIndex = 3),
      (this.template = `<div class="bk__calendar--container"><span class="bk__calendar-btn bk__calendar-prev"><i class="bi bi-arrow-left-short"></i></span><span class="bk__calendar-btn bk__calendar-next"><i class="bi bi-arrow-right-short"></i></span><div class="bk__calendar--slider"><ul class="bk__calendar-items"></ul></div></div>`),
      (this.container = $(this.template).appendTo(this.element)),
      (this.wrapItems = $(this.container).find("ul.bk__calendar-items")),
      "string" === typeof option.minimumDate &&
        (this.minimumDate = option.minimumDate),
      "string" === typeof option.selected &&
        (this.calendar.selected = option.selected),
      "function" === typeof option.ajax && (this.ajax = option.ajax),
      (this.calendar.currentSelect = m(
        this.calendar.selected,
        this.currentLocale.locale.format
      )),
      this.element
        .on("click", ".bk__calendar-prev", $.proxy(this.clickPrev, this)) // same this.clickPrev.bind(this)
        .on("click", ".bk__calendar-next", $.proxy(this.clickNext, this))
        .on("click", ".bk__calendar-item", $.proxy(this.clickItem, this));

    this.renderSlider();
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
      getDays: function (e) {
        //get midView of number view;
        const midView = Math.floor(this.viewRange / 2);

        const startDayOfRange = this.addDay(
          this.calendar.currentSelect,
          -midView
        );

        let days = [];
        for (let i = 0; i < this.viewRange; i++) {
          let nextDay = this.addDay(startDayOfRange, i);
          days[i] = this.keysOfDay({
            date: nextDay,
            locale: this.currentLocale,
            selectedDate: this.calendar.currentSelect,
            today: this.today,
          });
        }

        this.calendar.days = days;

        if (e === undefined || (e !== undefined && e.type !== "resize")) {
          this.element.trigger("select.calendar", this);
        }

        //ajax callback call after update
        this.ajax && this.ajax(this.calendar, this);

        return days;
      },
      clickNext: function (e) {
        if (this.isSliding || this.isLoading) return;

        this.setSliding(true);

        const selectedDay = this.addDay(this.calendar.currentSelect, 1);
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
            this.setSliding(false);
          },
        });
      },
      clickPrev: function (e) {
        if (this.isLoading || this.isSliding) return;
        const currentSelect = this.calendar.currentSelect;
        const todayM = m(this.today, this.currentLocale.locale.format);
        if (currentSelect.isBefore(todayM) || currentSelect.isSame(todayM))
          return;

        this.setSliding(true);
        //take array prevDay
        const selectedDay = this.addDay(this.calendar.currentSelect, -1);

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
            this.setSliding(false);
          },
        });
      },
      clickItem: function (e) {
        const item = e.target.closest(".bk__calendar-item");

        const itemIndex = $(item).attr("data-index");
        const dayValue = $(item).data("value");
        const dayMoment = m(dayValue, this.currentLocale.locale.format);
        const todayM = m(this.today, this.currentLocale.locale.format);
        if (this.isLoading || this.isSliding) return;
        if (dayValue === this.calendar.selected) return;
        if (dayMoment.isBefore(todayM)) return;
        if (
          this.calendar.currentSelect.isSame(todayM) &&
          dayMoment.isSame(todayM)
        )
          return;
        this.setSliding(true);

        const numberOfDay = itemIndex - Math.floor(this.viewRange / 2);
        const days = this.UpdateDaysAndGetNewDays({
          numberOfDay: numberOfDay,
          day:
            numberOfDay < 0
              ? this.calendar.days[0]
              : this.calendar.days[this.calendar.days.length - 1],
          selectedDay: dayMoment,
        });

        this.updateSliderItems({
          days: numberOfDay < 0 ? days.reverse() : days,
          action: this.actionSlider.CLICK_ITEM,
          numberOfDay: numberOfDay,
          selectedDay: dayMoment,
          callback: () => {
            this.wrapItems.removeClass("animating");
            this.wrapItems.css({
              transform: `translate3d(0,0,0)`,
            });
            this.setSliding(false);
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

        let newDay;

        this.calendar.selected = selectedDay.format(locale.locale.format);
        this.calendar.currentSelect = selectedDay;

        //update days after another day selected and currentSelect change
        this.getDays();

        //get the new days
        for (let i = 1; i <= Math.abs(Number(numberOfDay)); i++) {
          newDay = this.addDay(day.moment, numberOfDay < 0 ? -i : i);

          days.push(
            this.keysOfDay({
              date: newDay,
              locale,
              selectedDate: selectedDay,
              today: this.today,
            })
          );
        }

        return days;
      },
      defineProperties: function () {
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
        _this.container.find(".bk__calendar-items").css({
          width: "200%",
        });
        const reloadCalendar = function (e) {
          const calendarWidth = _this.container.width();

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

          //get new days on calendar bar
          const days = _this.getDays(e);
          //update view UI
          const items = _this.items({
            days: days,
            viewRange: _this.viewRange,
          });
          _this.container.find(".bk__calendar-items").html(items);
        };

        $(window).on("resize", reloadCalendar);
        $(window).on("load", reloadCalendar);
      },
      setLoading: function (loading) {
        this.isLoading = loading;
      },
      setSliding: function (sliding) {
        this.isSliding = sliding;
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
