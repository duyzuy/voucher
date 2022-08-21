import { loadingTemplate } from "../components/loading.js";
import { noFlight } from "../components/noFlight.js";
import {
  bookingInformation,
  bkInforKey,
  constants,
} from "../constants/constant.js";
import config, { baseURL, languageId } from "../config.js";
import { isExistsInput, dateFormat, getScheduleTime } from "../utils/helper.js";
import { dateLocale } from "../translate.js";
import { client } from "../api/client.js";

const calendarDepart = $("#bk__calendar--depart");
const calendarReturn = $("#bk__calendar--return");
const bookingFlightForm = $("#bookingFlightForm");

const flightOptionsDepart = $("#booking__layout--flights--depart");
const flightOptionsReturn = $("#booking__layout--flights--return");

const flightSelection = {
  bookingInformation: bookingInformation,
  airportGroups: [],
  isSuccess: !1,
  isDepartSuccess: !1,
  isReturnSuccess: !1,
  asyncStatus: {
    airports: !1,
    flightOptions: !1,
  },
  currentStack: "",
  constant: constants,
  start: function (locale) {
    const _this = this;
    this.setDefault(locale);
    //load data airport
    this.defineProperties();
    this.flightOptionSelection(
      {
        lang: locale.locale,
      },
      (lc) => _this.handleAsyncData(lc)
    );

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
    const tripDepartInput = bookingFlightForm.find(
      'input[name="tripDeparture"]'
    );
    const tripReturnInput = bookingFlightForm.find('input[name="tripReturn"]');
    const adultInput = bookingFlightForm.find('input[name="adult"]');
    const childrenInput = bookingFlightForm.find('input[name="children"]');
    const infantInput = bookingFlightForm.find('input[name="infant"]');
    const promoCodeInput = bookingFlightForm.find('input[name="promoCode"]');

    isExistsInput(tripType) && this.setBookingValue("tripType", tripType.val());

    isExistsInput(departCodeInput) &&
      this.setBookingValue("depart", departCodeInput.val());
    isExistsInput(returnCodeInput) &&
      this.setBookingValue("return", returnCodeInput.val());
    isExistsInput(departDateInput) &&
      this.setBookingValue("departDate", departDateInput.val());
    isExistsInput(returnDateInput) &&
      this.setBookingValue("returnDate", returnDateInput.val());

    isExistsInput(tripDepartInput) &&
      this.setBookingValue("departure", JSON.parse(tripDepartInput.val()));
    isExistsInput(tripReturnInput) &&
      this.setBookingValue("return", JSON.parse(tripReturnInput.val()));

    isExistsInput(adultInput) &&
      this.setBookingValue(bkInforKey.Adult, adultInput.val());

    isExistsInput(childrenInput) &&
      this.setBookingValue("children", childrenInput.val());
    isExistsInput(infantInput) &&
      this.setBookingValue("infant", infantInput.val());

    isExistsInput(promoCodeInput) &&
      this.setBookingValue("promoCode", promoCodeInput.val());
  },
  setBookingValue: function (key, value) {
    if (key === bkInforKey.DepartDate || key === bkInforKey.ReturnDate) {
      this.bookingInformation[key].value = value;
    } else if (
      key === bkInforKey.Adult ||
      key === bkInforKey.Children ||
      key === bkInforKey.Infant
    ) {
      this.bookingInformation.passengers[key] = value;
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
  flightOptionSelection: async function ({ lang }, asyncData) {
    const _this = this;

    calendarDepart.length > 0 &&
      calendarDepart
        .sliderCalendar({
          selected: _this.bookingDepartDate,
          locale: _this.bookingInformation.locale,
        })
        .on("select.calendar", async function (e, slider) {
          const { calendar } = slider;

          const departureDate = calendar.selected;
          const departTripCode = `${_this.bookingInformation.departure.code}-${_this.bookingInformation.return.code}`;

          _this.setBookingValue(bkInforKey.DepartDate, departureDate);
          let airportDepart = {
            group: {},
            airport: {},
          };
          try {
            slider.setLoading(true);
            flightOptionsDepart
              .find(".booking__layout--flights")
              .html(loadingTemplate());
            const [airportData, flightOptions] = await asyncData(lang);

            airportData && airportData.status === true
              ? (_this.asyncStatus.airports = true)
              : (_this.asyncStatus.airports = false);

            flightOptions && flightOptions.status === true
              ? (_this.asyncStatus.flightOptions = true)
              : (_this.asyncStatus.flightOptions = false);

            Object.values(_this.asyncStatus).some((key) => key === false) ===
            true
              ? (_this.isDepartSuccess = false)
              : (_this.isDepartSuccess = true);

            _this.airportGroups = airportData.airportGroups;
            _this.bookingInformation.travelOption = flightOptions.travelOption;
            //set flights if success get full data
          } catch (error) {
            _this.isDepartSuccess = false;
          } finally {
            slider.setLoading(false);
          }

          if (_this.isDepartSuccess === true) {
            _this.setBookingValue(
              bkInforKey.SessionId,
              _this.bookingInformation.sessionId
            );
            _this.setBookingValue(
              bkInforKey.SessionExpIn,
              _this.bookingInformation.sessionExpIn
            );
            _this.setBookingValue(
              bkInforKey.TravelOption,
              _this.bookingInformation.travelOption
            );
            const flightList = _this.flightItemsOptions(
              _this.bookingInformation.travelOption[departTripCode],
              _this.airportGroups
            );
            flightOptionsDepart.find(".booking__layout--flights").html("");
            for (const fl of flightList) {
              flightOptionsDepart.find(".booking__layout--flights").append(fl);
            }
          }
        });

    //handle return select flights
    calendarReturn.length > 0 &&
      calendarReturn
        .sliderCalendar({
          selected: _this.bookingreturnDate,
          locale: _this.bookingInformation.locale,
          // minimumDate: _this.bookingDepartDate,
        })
        .on("select.calendar", async function (e, slider) {
          const { calendar } = slider;

          const returnDate = calendar.selected;
          const returnTripCode = `${_this.bookingInformation.return.code}-${_this.bookingInformation.departure.code}`;

          _this.setBookingValue(bkInforKey.returnDate, returnDate);
          let airportReturn = {
            group: {},
            airport: {},
          };

          try {
            slider.setLoading(true);
            flightOptionsReturn
              .find(".booking__layout--flights")
              .html(loadingTemplate());
            const [airportData, flightOptions] = await asyncData(lang);

            airportData && airportData.status === true
              ? (_this.asyncStatus.airports = true)
              : (_this.asyncStatus.airports = false);

            flightOptions && flightOptions.status === true
              ? (_this.asyncStatus.flightOptions = true)
              : (_this.asyncStatus.flightOptions = false);

            Object.values(_this.asyncStatus).some((key) => key === false) ===
            true
              ? (_this.isDepartSuccess = false)
              : (_this.isDepartSuccess = true);

            _this.airportGroups = airportData.airportGroups;
            _this.bookingInformation.travelOption = flightOptions.travelOption;
            //set flights if success get full data
          } catch (error) {
            console.log(error);
            _this.isDepartSuccess = false;
          } finally {
            slider.setLoading(false);
          }

          if (_this.isDepartSuccess === true) {
            _this.setBookingValue(
              bkInforKey.SessionId,
              _this.bookingInformation.sessionId
            );
            _this.setBookingValue(
              bkInforKey.SessionExpIn,
              _this.bookingInformation.sessionExpIn
            );
            _this.setBookingValue(
              bkInforKey.TravelOption,
              _this.bookingInformation.travelOption
            );
            const flightList = _this.flightItemsOptions(
              _this.bookingInformation.travelOption[returnTripCode],
              _this.airportGroups
            );
            flightOptionsReturn.find(".booking__layout--flights").html("");
            for (const fl of flightList) {
              flightOptionsReturn.find(".booking__layout--flights").append(fl);
            }
            // _this.viewScrollShowing();
          }
        });
  },
  flightItemsOptions: function (flightOptions, airportData) {
    let type;
    let departDate,
      promoCodeApplicability,
      durationTime,
      href,
      key,
      numberOfChanges,
      numberOfStops;

    let flightListHtml = [];
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
      numberOfChanges = fl.numberOfChanges;
      numberOfStops = fl.numberOfStops;
      //set template html
      flightListHtml.push(
        this.flightItem({
          classes,
          departDate,
          type,
          flights,
        })
      );
    });

    return flightListHtml;
  },
  flightItem: function (data) {
    const flightOptionItem = document.createElement("div");
    flightOptionItem.classList.add("flight-option-item");

    const flightOptionBar = document.createElement("div");
    flightOptionBar.classList.add("flight-option-bar");

    const flightOptionDropdown = document.createElement("div");
    flightOptionDropdown.classList.add("flight-option-dropdown");

    const iconFlight = `<span class="icon-flight"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.2 1.56283L9.6 1.56283L15.6 10.3152L22.2 10.3152C22.6774 10.3152 23.1352 10.4881 23.4728 10.7958C23.8104 11.1036 24 11.521 24 11.9562C24 12.3915 23.8104 12.8089 23.4728 13.1166C23.1352 13.4244 22.6774 13.5973 22.2 13.5973L15.6 13.5973L9.6 22.3496L7.2 22.3496L10.2 13.5973L3.6 13.5973L1.8 15.7854L1.59677e-06 15.7854L1.2 11.9562L1.23442e-06 8.12707L1.8 8.12707L3.6 10.3152L10.2 10.3152L7.2 1.56283Z"></path>
</svg></span>`;

    let flightOptionTop = `<div class="flight-option-top">`;
    if (data.type === constants.DIRECT) {
      data.flights.forEach((flight) => {
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
      data.flights.forEach((flight) => {
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
      });
    }
    flightOptionTop += "</div>";
    let flightOftionInfor = `<div class="flight-option-infor">
        <ul>
          <li>
            <p class="duration-label">Thời gian bay</p>
            <p class="duration-time">2 giờ 15 phút</p>
          </li>
          <li>
            <button class="btn btn-flight-option-detail" type="button">
              Chi tiết <i class="bi bi-chevron-down"></i>
            </button>
          </li>
        </ul>
      </div>`;
    let flightOftionPrice = `<div class="flight-option-price"><span class="line"></span><div class="flight-option-price-wrap">
      <div class="flight-option-price--inner">
        <p class="price">
          <ins>850,000<span class="currency-symbol">VND</span></ins>
        </p>
      </div>
      <div class="flight-option-btns">
        <button class="btn btn-booking-selecting" type="button">
          Chọn
        </button>
      </div>
      </div>
    </div>`;

    let flightDropdownInnerDirect = `<div class="dropdown-inner">
    <div class="flight-option-detail">
      <div class="flight-option-detail-inner">
        <div class="flight-option-depart depart-last">
          <div class="option-detail-flight-code">
            <div class="option-detail-icon">
              <span class="icon-flight"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.2 1.56283L9.6 1.56283L15.6 10.3152L22.2 10.3152C22.6774 10.3152 23.1352 10.4881 23.4728 10.7958C23.8104 11.1036 24 11.521 24 11.9562C24 12.3915 23.8104 12.8089 23.4728 13.1166C23.1352 13.4244 22.6774 13.5973 22.2 13.5973L15.6 13.5973L9.6 22.3496L7.2 22.3496L10.2 13.5973L3.6 13.5973L1.8 15.7854L1.59677e-06 15.7854L1.2 11.9562L1.23442e-06 8.12707L1.8 8.12707L3.6 10.3152L10.2 10.3152L7.2 1.56283Z">
                  </path>
                </svg>
              </span>
            </div>
            <div class="option-detail-content">
              <div class="option-label">
                Số hiệu chuyến bay:
              </div>
              <div class="option-value">
                <p class="flight-code">VJ142</p>
              </div>
            </div>
          </div>
          <div class="option-detail-flight-city-airport">
            <div class="option-detail-content">
              <p class="option-label">Khởi hành:</p>
              <div class="option-value">
                <ul>
                  <li class="city">
                    Đà Nẵng (DAD) - Sân bay Đà Nẵng
                  </li>
                  <li class="time">
                    06:50, 17/08/2022 (Giờ địa phương)
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="option-detail-flight-city-airport">
            <div class="option-detail-icon bottom">
              <i class="bi bi-geo-alt-fill"></i>
            </div>
            <div class="option-detail-content">
              <div class="option-label">
                <p>Đến:</p>
              </div>
              <div class="option-value">
                <ul>
                  <li class="city">
                    Tp. Hồ Chí Minh (SGN) - Sân bay Quốc
                    tế Tân sơn nhất
                  </li>
                  <li class="time">
                    06:50, 17/08/2022 (Giờ địa phương)
                  </li>
                  <li class="aircraft">
                    <p>Thời gian: 2 giờ 05 phút</p>
                    <p>Máy bay: A320</p>
                    <p>Hãng khai thác: Vietjet</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

    let flightDropdownOneStop = `<div class="dropdown-inner">
  <div class="flight-option-detail">
    <div class="flight-option-detail-inner">
      <div class="flight-option-depart">
        <div class="option-detail-flight-code">
          <div class="option-detail-icon">
            <span class="icon-flight"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.2 1.56283L9.6 1.56283L15.6 10.3152L22.2 10.3152C22.6774 10.3152 23.1352 10.4881 23.4728 10.7958C23.8104 11.1036 24 11.521 24 11.9562C24 12.3915 23.8104 12.8089 23.4728 13.1166C23.1352 13.4244 22.6774 13.5973 22.2 13.5973L15.6 13.5973L9.6 22.3496L7.2 22.3496L10.2 13.5973L3.6 13.5973L1.8 15.7854L1.59677e-06 15.7854L1.2 11.9562L1.23442e-06 8.12707L1.8 8.12707L3.6 10.3152L10.2 10.3152L7.2 1.56283Z">
                </path>
              </svg>
            </span>
          </div>
          <div class="option-detail-content">
            <div class="option-label">
              <p>Số hiệu chuyến bay:</p>
            </div>
            <div class="option-value">
              <p class="flight-code">VJ142</p>
            </div>
          </div>
        </div>
        <div class="option-detail-flight-city-airport">
          <div class="option-detail-content">
            <div class="option-label">
              <p>Khởi hành:</p>
            </div>
            <div class="option-value">
              <ul>
                <li class="city">
                  Hà Nội (HAN) - Sân bay Nội Bài
                </li>
                <li class="time">
                  06:50, 17/08/2022 (Giờ địa phương)
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="option-detail-flight-city-airport">
          <div class="option-detail-content">
            <div class="option-label">
              <p>Đến:</p>
            </div>
            <div class="option-value">
              <ul>
                <li class="city">
                  Đà Nẵng (DAD) - Sân bay Đà Nẵng
                </li>
                <li class="time">
                  06:50, 17/08/2022 (Giờ địa phương)
                </li>
                <li class="aircraft">
                  <p>Thời gian: 2 giờ 05 phút</p>
                  <p>Máy bay: A320</p>
                  <p>Hãng khai thác: Vietjet</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="flight-option-onstop">
        <div class="option-detail-flight-onstop">
          <div class="option-detail-icon">
            <i class="bi bi-clock"></i>
          </div>
          <div class="option-detail-content">
            <p>
              Thời gian nối chuyến ở Đà Nẵng (DAD) 1
              giờ 05 phút
            </p>
          </div>
        </div>
      </div>
      <div class="flight-option-depart depart-last">
        <div class="option-detail-flight-code">
          <div class="option-detail-icon">
            <span class="icon-flight"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.2 1.56283L9.6 1.56283L15.6 10.3152L22.2 10.3152C22.6774 10.3152 23.1352 10.4881 23.4728 10.7958C23.8104 11.1036 24 11.521 24 11.9562C24 12.3915 23.8104 12.8089 23.4728 13.1166C23.1352 13.4244 22.6774 13.5973 22.2 13.5973L15.6 13.5973L9.6 22.3496L7.2 22.3496L10.2 13.5973L3.6 13.5973L1.8 15.7854L1.59677e-06 15.7854L1.2 11.9562L1.23442e-06 8.12707L1.8 8.12707L3.6 10.3152L10.2 10.3152L7.2 1.56283Z">
                </path>
              </svg>
            </span>
          </div>
          <div class="option-detail-content">
            <div class="option-label">
              Số hiệu chuyến bay:
            </div>
            <div class="option-value">
              <p class="flight-code">VJ142</p>
            </div>
          </div>
        </div>
        <div class="option-detail-flight-city-airport">
          <div class="option-detail-content">
            <p class="option-label">Khởi hành:</p>
            <div class="option-value">
              <ul>
                <li class="city">
                  Đà Nẵng (DAD) - Sân bay Đà Nẵng
                </li>
                <li class="time">
                  06:50, 17/08/2022 (Giờ địa phương)
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="option-detail-flight-city-airport">
          <div class="option-detail-icon bottom">
            <i class="bi bi-geo-alt-fill"></i>
          </div>
          <div class="option-detail-content">
            <div class="option-label">
              <p>Đến:</p>
            </div>
            <div class="option-value">
              <ul>
                <li class="city">
                  Tp. Hồ Chí Minh (SGN) - Sân bay Quốc
                  tế Tân sơn nhất
                </li>
                <li class="time">
                  06:50, 17/08/2022 (Giờ địa phương)
                </li>
                <li class="aircraft">
                  <p>Thời gian: 2 giờ 05 phút</p>
                  <p>Máy bay: A320</p>
                  <p>Hãng khai thác: Vietjet</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

    flightOptionBar.innerHTML =
      flightOptionTop + flightOftionInfor + flightOftionPrice;

    flightOptionDropdown.innerHTML = flightDropdownInnerDirect;

    flightOptionItem.append(flightOptionBar);
    flightOptionItem.append(flightOptionDropdown);
    return flightOptionItem;
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

      console.log($(this));
      if (item.hasClass("expanded")) {
        item.removeClass("expanded");
        $(dropdownItem[0]).removeAttr("style");
      } else {
        item.hasClass("expanded") && item.removeClass("expanded");
        $(item.find(".flight-option-dropdown")).removeAttr("style");
        item.addClass("expanded");
        $(dropdownItem[0]).css({ height: dropdownItem[0].scrollHeight });
      }
    };

    $(
      "#booking__layout--flights--depart .booking__layout--flights, #booking__layout--flights--return .booking__layout--flights"
    ).on("click", ".btn-flight-option-detail", toggleFlightDetail);
  },
  asyncData: function (timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("get data success");
      }, timeout);
    });
  },
  handleAsyncData: async function (lang) {
    const _this = this;

    const airportURL = baseURL + "?languageId=" + languageId[lang];
    const getAirports = await client.get(airportURL);
    const getFlightsOptions = await client.get(
      "http://127.0.0.1:5500/assets/js/data.json"
    );
    const asyncdt = await _this.asyncData(3000);
    const [airportList, flightOptions, asyncdts] = await Promise.all([
      getAirports,
      getFlightsOptions,
      asyncdt,
    ]);

    return [airportList, flightOptions, asyncdts];
  },
  viewScrollShowing: function () {
    let interSection = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting === true) {
            $(entry.target).addClass("viewing");
          } else {
            $(entry.target).removeClass("viewing");
          }
        });
        console.log(entries);
        console.log(observer);
      },
      { rootMargin: "0px 0px 0px 0px" }
    );

    $(".flight-option-item").each((index, item) => {
      interSection.observe(item);
      interSection.takeRecords(item);
    });
  },
};
export default flightSelection;
