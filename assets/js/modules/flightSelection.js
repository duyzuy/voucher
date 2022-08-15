import {
  bookingInformation,
  bkInforKey,
  constants,
} from "../constants/constant.js";
import { isExistsInput, dateFormat, getScheduleTime } from "../utils/helper.js";
import { dateLocale } from "../translate.js";
import { getAirportData } from "./airportData.js";
import { client } from "../api/client.js";
const calendarDepart = $("#bk__calendar--depart");
const calendarReturn = $("#bk__calendar--return");
const flightItem = $(".flight-option-item");
const bookingFlightForm = $("#bookingFlightForm");

const flightOptionsDepart = $("#booking__layout--flights--depart");
const flightOptionsReturn = $("#booking__layout--flights--return");

const flightSelection = {
  bookingInformation: bookingInformation,
  airportData: {},
  start: function (locale) {
    this.setDefault(locale);
    //load data airport
    this.ajaxGetAirports();
    this.defineProperties();
    this.flightOptionSelection();

    this.handleEvent();
  },
  setDefault: function ({ locale }) {
    this.bookingInformation.locale = locale;
    this.bookingInformation.dateLocale = dateLocale.find(
      (lc) => lc.lang === locale
    );
    //get data from searchForm
    const tripType = bookingFlightForm.find('input[name="tripType"]');
    const departCodeInput = bookingFlightForm.find(
      'input[name="depatureCode"]'
    );
    const returnCodeInput = bookingFlightForm.find('input[name="returnCode"]');
    const departDateInput = bookingFlightForm.find('input[name="departDate"]');
    const returnDateInput = bookingFlightForm.find('input[name="returnDate"]');
    const adultInput = bookingFlightForm.find('input[name="adult"]');
    const childrenInput = bookingFlightForm.find('input[name="children"]');
    const infantInput = bookingFlightForm.find('input[name="infant"]');
    const promoCodeInput = bookingFlightForm.find('input[name="promoCode"]');

    isExistsInput(tripType) && this.setBookingValue("tripType", tripType.val());

    isExistsInput(departCodeInput) &&
      this.setBookingValue("departCode", departCodeInput.val());
    isExistsInput(returnCodeInput) &&
      this.setBookingValue("returnCode", returnCodeInput.val());
    isExistsInput(departDateInput) &&
      this.setBookingValue("departDate", departDateInput.val());
    isExistsInput(returnDateInput) &&
      this.setBookingValue("returnDate", returnDateInput.val());

    isExistsInput(adultInput) &&
      this.setBookingValue(bkInforKey.Adult, adultInput.val());
    isExistsInput(childrenInput) &&
      this.setBookingValue("children", childrenInput.val());
    isExistsInput(infantInput) &&
      this.setBookingValue("infant", infantInput.val());

    isExistsInput(promoCodeInput) &&
      this.setBookingValue("promoCode", promoCodeInput.val());

    console.log(bookingInformation);
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
        .on("select.calendar", async function (e, obj) {
          const { calendar } = obj;
          console.log(calendar);
          const departureDate = calendar.currentSelect.selected;

          const departTripCode = `${_this.bookingInformation.departCode}-${_this.bookingInformation.returnCode}`;

          _this.setBookingValue(bkInforKey.DepartDate, departureDate);
          const flights = client.get(
            "http://127.0.0.1:5500/assets/js/data.json"
          );
          const data = await flights;
          if (data.status === true) {
            _this.setBookingValue(bkInforKey.SessionId, data.sessionId);
            _this.setBookingValue(bkInforKey.SessionExpIn, data.sessionExpIn);
            _this.setBookingValue(bkInforKey.TravelOption, data.travelOption);
            _this.flightItemsOptions(data.travelOption[departTripCode]);
          }

          //appendto html
          // flightOptionsDepart.find(".flight-option-items").html("");
          // console.log(currentSelect, calendar.loading);
          console.log(bookingInformation);
        });

    //handle return select flights
    calendarReturn.length > 0 &&
      calendarReturn
        .sliderCalendar({
          selected: _this.bookingreturnDate,
          locale: _this.bookingInformation.locale,
          minimumDate: _this.bookingDepartDate,
        })
        .on("select.calendar", function (e, calendar) {
          const returnDate = calendar.currentSelect;
        });
  },
  flightItemsOptions: function (flightOptions) {
    let type;
    let departDate, promoCodeApplicability, durationTime, href, key;
    console.log(flightOptions[0]);

    flightOptions.forEach((fl) => {
      let classes = "";
      classes =
        fl.numberOfChanges === 0 ? constants.DIRECT : constants.ONE_STOP;
      type = fl.numberOfChanges === 0 ? constants.DIRECT : constants.ONE_STOP;
      fl.promoCodeRequested === true && (classes = classes.concat(" ", "sale"));
      departDate = dateFormat(
        fl.departureDate,
        "YYYY-MM-DD",
        this.bookingInformation.dateLocale.lang,
        this.bookingInformation.dateLocale.locale.formatTextNoYear
      );
      (promoCodeApplicability = fl.promoCodeApplicability),
        (durationTime = fl.enRouteHours);
      let flights = [];
      fl.flights.forEach((f) => {
        flights.push({
          aircraftModel: f.aircraftModel.name,
          airlineCode: f.airlineCode.code,
          arrival: {
            airport: {
              code: f.arrival.airport.code,
              name: f.arrival.airport.name,
              utcOffset: f.arrival.airport.utcOffset,
            },
            scheduledTime: getScheduleTime(
              f.arrival.scheduledTime,
              f.arrival.airport.utcOffset,
              this.bookingInformation.dateLocale
            ),
          },
          departure: {
            airport: {
              code: f.departure.airport.code,
              name: f.departure.airport.name,
              utcOffset: f.departure.airport.utcOffset,
            },
            scheduledTime: getScheduleTime(
              f.departure.scheduledTime,
              f.departure.airport.utcOffset,
              this.bookingInformation.dateLocale
            ),
          },
          flightNumber: f.flightNumber,
          href: f.href,
          key: f.key,
          operatingPartnerCarrier: f.operatingPartnerCarrier,
        });
      });
      href = fl.href;
      key = fl.key;
      //set template html
      this.flightItem({
        classes,
        departDate,
        type,
        flights,
      });
    });

    // return flights;
  },
  flightItem: function (data) {
    console.log(data);
    const flightItemTemplate = `<div class="flight-option-item"><div class="flight-option-bar"></div><div class="flight-option-dropdown"></div></div>`;
    const item = $(flightItemTemplate).closest(".flight-option-item");
    const itemBar = $(flightItemTemplate).closest(".flight-option-bar");
    const itemDropdown = $(flightItemTemplate).closest(
      ".flight-option-dropdown"
    );
    const iconFlight = `<span class="icon-flight"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.2 1.56283L9.6 1.56283L15.6 10.3152L22.2 10.3152C22.6774 10.3152 23.1352 10.4881 23.4728 10.7958C23.8104 11.1036 24 11.521 24 11.9562C24 12.3915 23.8104 12.8089 23.4728 13.1166C23.1352 13.4244 22.6774 13.5973 22.2 13.5973L15.6 13.5973L9.6 22.3496L7.2 22.3496L10.2 13.5973L3.6 13.5973L1.8 15.7854L1.59677e-06 15.7854L1.2 11.9562L1.23442e-06 8.12707L1.8 8.12707L3.6 10.3152L10.2 10.3152L7.2 1.56283Z"></path>
</svg></span>`;

    let flightOptionTop = "";
    if (data.type === constants.DIRECT) {
      data.flights.forEach((flight) => {
        flightOptionTop = `<div class="flight-option-top">`;
        flightOptionTop += `<div class="flight-option-location-time">
          <span class="flight-option-time">${flight.departure.scheduledTime.time}</span>
          <span class="flight-option-city">${flight.departure.airport.name}</span>
          <span class="flight-option-date">${flight.departure.scheduledTime.date}</span>
        </div>`;
        flightOptionTop += `<div class="flight-option-types">
          <div class="flight-option-middle-inner">
            <div class="flight-option-icon icon-flight">
              <span class="flight-code">${flight.airlineCode}${flight.flightNumber} | A${flight.aircraftModel}</span>
              ${iconFlight}
              <span class="text-label">Bay thẳng</span>
            </div>
          </div>
        </div>`;
        flightOptionTop += `<div class="flight-option-location-time">
          <span class="flight-option-time">${flight.arrival.scheduledTime.time}</span>
          <span class="flight-option-city">${flight.arrival.airport.name}</span>
          <span class="flight-option-date">${flight.arrival.scheduledTime.date}</span>
        </div>`;
      });
    } else {
      flightOptionTop = `<div class="flight-option-top">`;
      flightOptionTop += `<div class="flight-option-location-time">
          <span class="flight-option-time">${flight.departure.scheduledTime.time}</span>
          <span class="flight-option-city">${flight.departure.airport.name}</span>
          <span class="flight-option-date">${flight.departure.scheduledTime.date}</span>
        </div>`;
      flightOptionTop += `<div class="flight-option-types">
        <div class="flight-option-middle-inner">
          <div class="flight-option-icon icon-flight">
            <span class="flight-code">VJ142 | A330</span>
            ${iconFlight}
          </div>
          <div class="flight-option-stop">
            <span class="name-stop">DAD</span>
            <span class="icon-stop">
              <span class="ic-circle"></span>
            </span>
            <span class="text-label">1 điểm dừng</span>
          </div>
          <div class="flight-option-icon icon-flight">
            <span class="flight-code">VJ148 | A331</span>
            ${iconFlight}
          </div>
        </div>
      </div>`;
      flightOptionTop += `<div class="flight-option-location-time">
          <span class="flight-option-time">${flight.arrival.scheduledTime.time}</span>
          <span class="flight-option-city">${flight.arrival.airport.name}</span>
          <span class="flight-option-date">${flight.arrival.scheduledTime.date}</span>
        </div>`;
    }
    itemBar.append(flightOptionTop);
    item.append(itemBar);
  },
  handleEvent: function () {
    /*
     *
     *   Handle Event selected date
     *
     */

    const toggleFlightDetail = function (e) {
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
    };

    flightItem.on("click", ".btn-flight-option-detail", toggleFlightDetail);
  },
  ajaxGetAirports: async function () {
    const airportData = await getAirportData();

    this.airportData = airportData.airportGroups;
  },
};
export default flightSelection;
