import { bookingInformation } from "../constants/constant.js";
import { data } from "../data.js";
import { isExistsInput } from "../utils/helper.js";
const calendarDepart = $("#bk__calendar--depart");
const calendarReturn = $("#bk__calendar--return");
const flightItem = $(".flight-option-item");
const bookingFlightForm = $("#bookingFlightForm");

const flightSelection = {
  bookingInformation: bookingInformation,
  start: function (locale) {
    this.setDefault(locale);
    this.defineProperties();
    this.flightOptionSelection();

    this.handleEvent();
  },
  setDefault: function ({ locale }) {
    this.bookingInformation.locale = locale;

    //get data from searchForm

    const departDate = bookingFlightForm.find('input[name="departDate"]');
    const returnDate = bookingFlightForm.find('input[name="returnDate"]');
    const tripType = bookingFlightForm.find('input[name="tripType"]');
    const departCode = bookingFlightForm.find('input[name="depatureCode"]');
    const returnCode = bookingFlightForm.find('input[name="returnCode"]');
    const adult = bookingFlightForm.find('input[name="adult"]');
    const children = bookingFlightForm.find('input[name="children"]');
    const infant = bookingFlightForm.find('input[name="infant"]');
    const promoCode = bookingFlightForm.find('input[name="promoCode"]');

    if (departDate)
      isExistsInput(departDate) &&
        (this.bookingInformation.departDate.value = departDate.val());
    isExistsInput(returnDate) &&
      (this.bookingInformation.returnDate.value = returnDate.val());

    isExistsInput(departCode) &&
      (this.bookingInformation.departCode = departCode.val());
    isExistsInput(returnCode) &&
      (this.bookingInformation.returnCode = returnCode.val());

    isExistsInput(adult) &&
      (this.bookingInformation.passenngers.adult = adult.val());
    isExistsInput(children) &&
      (this.bookingInformation.passenngers.children = children.val());
    isExistsInput(infant) &&
      (this.bookingInformation.passenngers.infant = infant.val());
    isExistsInput(promoCode) &&
      (this.bookingInformation.promoCode = promoCode.val());
    isExistsInput(departDate) &&
      (this.bookingInformation.departDate.value = departDate.val());
    isExistsInput(departDate) &&
      (this.bookingInformation.departDate.value = departDate.val());

    console.log(bookingInformation);
  },
  defineProperties: function () {
    Object.defineProperty(this, "bookingDepartDate", {
      get: function () {
        return this.bookingInformation.departDate.value;
      },
    });
    Object.defineProperty(this, "bookingreturnDate", {
      get: function () {
        return this.bookingInformation.returnDate.value;
      },
    });
  },
  flightOptionSelection: function () {
    const _this = this;

    //handle depart select flights

    calendarDepart.length > 0 &&
      console.log(
        calendarDepart
          .sliderCalendar({
            selected: _this.bookingDepartDate,
            locale: _this.bookingInformation.locale,
          })
          .setStartDate("asdf")
      );

    // handle return select flights
    calendarReturn.length > 0 &&
      calendarReturn.sliderCalendar({
        selected: _this.bookingreturnDate,
        locale: _this.bookingInformation.locale,
      });
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
