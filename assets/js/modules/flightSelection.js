import { bookingInformation, bkInforKey } from "../constants/constant.js";
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
    const tripType = bookingFlightForm.find('input[name="tripType"]');
    const departCode = bookingFlightForm.find('input[name="depatureCode"]');
    const returnCode = bookingFlightForm.find('input[name="returnCode"]');
    const departDate = bookingFlightForm.find('input[name="departDate"]');
    const returnDate = bookingFlightForm.find('input[name="returnDate"]');
    const adult = bookingFlightForm.find('input[name="adult"]');
    const children = bookingFlightForm.find('input[name="children"]');
    const infant = bookingFlightForm.find('input[name="infant"]');
    const promoCode = bookingFlightForm.find('input[name="promoCode"]');

    isExistsInput(tripType) && this.setBookingValue("tripType", tripType.val());

    isExistsInput(departCode) &&
      this.setBookingValue("departCode", departCode.val());
    isExistsInput(returnCode) &&
      this.setBookingValue("returnCode", returnCode.val());
    isExistsInput(departDate) &&
      this.setBookingValue("departDate", departDate.val());
    isExistsInput(returnDate) &&
      this.setBookingValue("returnDate", returnDate.val());

    isExistsInput(adult) && this.setBookingValue("adult", adult.val());
    isExistsInput(children) && this.setBookingValue("children", children.val());
    isExistsInput(infant) && this.setBookingValue("infant", infant.val());

    isExistsInput(promoCode) &&
      this.setBookingValue("promoCode", promoCode.val());

    // console.log(bookingInformation);
  },
  setBookingValue: function (key, value) {
    // Object.hasOwnProperty.call(bkInforKey, key){

    // }
    if (key === bkInforKey.DepartDate || key === bkInforKey.ReturnDate) {
      this.bookingInformation[key].value = value;
    } else if (
      key === bkInforKey.Adult ||
      key === bkInforKey.Children ||
      key === bkInforKey.Infant
    ) {
      this.bookingInformation.passenngers[key] = value;
    } else {
      this.bookingInformation[key] = value;
    }
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
      calendarDepart
        .sliderCalendar({
          selected: _this.bookingDepartDate,
          locale: _this.bookingInformation.locale,
        })
        .getData((calendar) => {
          const currentDepartDate = calendar.selected;
          console.log(currentDepartDate);
          _this.setBookingValue("departDate", currentDepartDate);
        });
    // handle return select flights
    calendarReturn.length > 0 &&
      calendarReturn
        .sliderCalendar({
          selected: _this.bookingreturnDate,
          locale: _this.bookingInformation.locale,
        })
        .getData((calendar) => {
          const returnCalendar = calendar.selected;
          console.log(returnCalendar);
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
