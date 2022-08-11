import { data } from "../data.js";

const calendarDepart = $("#bk__calendar--depart");
const calendarReturn = $("#bk__calendar--return");
const flightItem = $(".flight-option-item");

// const calendarContainer = $("#bk__calendar__two");

// calendarContainer.sliderCalendar({
//   range: 7,
//   currentIndex: 0,
//   activeIndex: 3,
//   locale: "vi",
//   selected: "15-08-2022",
//   format: "DD-MM-YYYY",
// });

const flightSelection = {
  flights: {
    locale: "",
  },
  start: function (locale) {
    this.handleEvent();
    this.setDefault(locale);
    this.flightOptionSelection();
  },
  setDefault: function (locale) {
    this.flights.locale = locale;
  },
  flightOptionSelection: function () {
    const _this = this;
    //handle depart select
    calendarDepart.sliderCalendar();

    // handle return select
    calendarReturn.sliderCalendar();
  },
  handleEvent: function () {
    /*
     *
     *   Handle Event selected date
     *
     */

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
export default flightSelection;
