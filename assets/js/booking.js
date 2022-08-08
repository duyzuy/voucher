import { constants } from "./constant.js";
import config, { baseURL, languageId } from "./config.js";
import { bookingFormText, dateLocale } from "./translate.js";

const tripDeparture = $("#trip__departure");
const tripReturn = $("#trip__return");
const tripDate = $("#trip__date");
const tripDateDepart = $("#trip__date--depart");
const tripDatereturn = $("#trip__date--return");
const tripType = $("#trip__type--oneway, #trip__type--return");
const tripPassenger = $("#trip__passenger");
const bookingForm = $("#booking__form");
const quantityControl = $(".booking__quantity--control");
const searchFlightBtn = $("#booking__searchflight");

const app = {
  bookingInform: {
    tripType: constants.RETURN,
    departLocation: "",
    returnLocation: "",
    departDate: {
      value: "",
      alt: "",
    },
    returnDate: {
      value: "",
      alt: "",
    },
    passenngers: {
      adult: 1,
      children: 0,
      infant: 0,
    },
    currentSelect: "",
    locale: "",
    promoCode: "",
  },
  init({ locale }) {
    //set locale for booking form
    this.setLocale(locale);
    //handle all event for booking flow
    this.handleEvents();

    this.renderAlert();
  },
  setLocale: function (locale) {
    this.bookingInform.locale = locale;
  },
  handleEvents: function () {
    this.onSelectTripType();
    this.onSelectDeparture();
    this.onSelectReturn();
    this.onSelectDate();
    this.onSelectPassenger();
    this.onChangePromoCode();
    this.onSearchFlight();

    this.paxSelectDropdown();
  },
  onSelectTripType: function () {
    const _this = this;

    tripType.on("change", (e) => {
      _this.bookingInform.tripType = e.target.value;

      _this.updateDateSelecting({
        departDate: _this.bookingInform.departDate,
        returnDate: _this.bookingInform.returnDate,
        tripType: _this.bookingInform.tripType,
      });
      tripDate.data("daterangepicker").setSingleDate(e.target.value);
    });
  },
  onSelectDeparture: function () {
    const _this = this;
    // tripDeparture.val(_this.bookingInform.departDate).trigger("change");

    tripDeparture
      .select2({
        ajax: _this.ajaxAirportData(constants.DEPART_LOCATION),
        placeholder: "Departure",
        templateResult: _this.renderCityAirportResult,
        templateSelection: (data) =>
          _this.renderCityAirportSelection(data, {
            type: constants.DEPART_LOCATION,
            locale: _this.bookingInform.locale,
          }),
        dropdownCssClass: "booking__form__dropdown",
        // dropdownParent: $("#dropdown__citypare--departure"),
        width: "resolve",
      })
      .on("select2:select", function (e) {
        _this.bookingInform.departLocation = e.params.data.id;
        tripReturn.val(null).trigger("change");
        tripReturn.select2("open");
      });
  },
  onSelectReturn: function () {
    const _this = this;

    tripReturn
      .select2({
        ajax: _this.ajaxAirportData(constants.RETURN_LOCATION),
        placeholder: "Return",
        templateResult: _this.renderCityAirportResult,
        templateSelection: (data) =>
          _this.renderCityAirportSelection(data, {
            type: constants.RETURN_LOCATION,
            locale: _this.bookingInform.locale,
          }),
        dropdownCssClass: "booking__form__dropdown",
        // dropdownParent: $("#dropdown__citypare--return"),
        width: "resolve",
      })
      .on("select2:select", function (e) {
        _this.bookingInform.returnLocation = e.params.data.id;
        $(this).val(_this.bookingInform.returnLocation).trigger("change");
        if (_this.bookingInform.departLocation !== "") {
          setTimeout(() => {
            bookingForm.addClass("expanded");
            tripDate.data("daterangepicker").show();
          }, 200);
        }
      });
  },
  onSelectDate: function () {
    const _this = this;
    const currentLocale = dateLocale.find((item) => {
      return item.lang === _this.bookingInform.locale;
    });
    const currentDate = new Date();
    tripDate
      .daterangepicker({
        // autoApply: true,
        autoApplyByStep: true,
        singleDatePicker:
          _this.bookingInform.tripType === constants.ONEWAY ? true : false,
        minDate: currentDate,
        opens: "left",
        locale: { ...currentLocale.locale },
        parentEl: "#trip__date--dropdown",
      })
      .on("show.daterangepicker", function (ev, picker) {
        $(".drp-calendar.right").show();
        if (picker.currentStep === "start" || picker.doneSelect) {
          tripDateDepart.addClass("selecting");
          tripDate.data("daterangepicker").setMinDate(currentDate);
        }

        _this.bookingInform.currentSelect = "departDate";
      })
      .on("hide.daterangepicker", function (ev, picker) {
        if (picker.doneSelect) {
          if (picker.currentStep === "start") {
            const startDateAlt = picker.startDate
              .locale(currentLocale.lang)
              .format(currentLocale.locale.formatText);
            const starDateValue = picker.startDate.format(
              currentLocale.locale.format
            );

            _this.bookingInform.departDate.value = starDateValue;
            _this.bookingInform.departDate.alt = startDateAlt;
          }
          _this.updateDateSelecting({
            departDate: _this.bookingInform.departDate,
            returnDate: _this.bookingInform.returnDate,
            tripType: _this.bookingInform.tripType,
          });
        }
        _this.bookingInform.currentSelect = "";
        tripDateDepart.removeClass("selecting");
        tripDatereturn.removeClass("selecting");
      })
      .on("apply.daterangepicker", function (ev, picker) {
        if (picker.currentStep === "start") {
          const startDateAlt = picker.startDate
            .locale(currentLocale.lang)
            .format(currentLocale.locale.formatText);
          const starDateValue = picker.startDate.format(
            currentLocale.locale.format
          );

          _this.bookingInform = {
            ..._this.bookingInform,
            currentSelect: "departDate",
            departDate: {
              value: starDateValue,
              alt: startDateAlt,
            },
          };

          tripDateDepart.addClass("selected");
          tripDateDepart.removeClass("selecting");
          tripDatereturn.addClass("selecting");

          _this.bookingInform.tripType === constants.ONEWAY &&
            _this.paxSelectDropdown().open();
          // _this.bookingInform.tripType === constants.RETURN &&
          //   tripDate.data("daterangepicker").setMinDate(picker.startDate);
        }
        if (picker.currentStep === "end") {
          const endDateAlt = picker.endDate
            .locale(currentLocale.lang)
            .format(currentLocale.locale.formatText);
          const endDateValue = picker.endDate.format(
            currentLocale.locale.format
          );

          _this.bookingInform = {
            ..._this.bookingInform,
            currentSelect: "returnDate",
            returnDate: {
              value: endDateValue,
              alt: endDateAlt,
            },
          };

          tripDatereturn.removeClass("selecting");
          tripDatereturn.addClass("selected");
          _this.paxSelectDropdown().open();
        }
        _this.updateDateSelecting({
          departDate: _this.bookingInform.departDate,
          returnDate: _this.bookingInform.returnDate,
          tripType: _this.bookingInform.tripType,
        });
      });
  },
  onSelectPassenger: function () {
    const _this = this;
    const locale = _this.bookingInform.locale;

    tripPassenger.on("click", function (e) {
      $("#booking__form--passenger--inner").toggleClass("open");
    });

    _this.renderPaxHtml(
      {
        adult: _this.bookingInform.passenngers.adult,
        children: _this.bookingInform.passenngers.children,
        infant: _this.bookingInform.passenngers.infant,
      },
      locale
    );

    quantityControl.click(function (e) {
      const parentQuantity = $(this).context.parentNode.parentNode;
      const passengerType = $(parentQuantity).data("type");
      const actionType = $(this).data("type");
      const quantityValue = $(parentQuantity).find(".booking__quantity--value");
      let paxNumber = Number($(quantityValue).text());

      if (actionType === constants.INCREATE) {
        paxNumber++;
      } else {
        paxNumber--;
      }

      // .context.parentNode("div.booking__quantity")

      switch (passengerType) {
        case constants.ADULT: {
          if (
            (actionType === constants.INCREATE &&
              paxNumber >
                config.PAXLIMIT - _this.bookingInform.passenngers.children) ||
            (actionType === constants.DECREATE &&
              _this.bookingInform.passenngers.adult === config.ADULT_MINIMUN)
          ) {
            return;
          }
          if (
            actionType === constants.DECREATE &&
            _this.bookingInform.passenngers.adult ===
              _this.bookingInform.passenngers.infant
          ) {
            _this.bookingInform.passenngers.infant = paxNumber;
            $("#infantInput").find(".booking__quantity--value").text(paxNumber);
          }
          _this.bookingInform.passenngers.adult = paxNumber;

          break;
        }
        case constants.CHILDREN: {
          if (
            (actionType === constants.INCREATE &&
              paxNumber >
                config.PAXLIMIT - _this.bookingInform.passenngers.adult) ||
            (actionType === constants.DECREATE &&
              _this.bookingInform.passenngers.children ===
                config.CHILDREN_MINIMUN)
          ) {
            return;
          }
          _this.bookingInform.passenngers.children = paxNumber;

          break;
        }
        case constants.INFANT: {
          if (
            (actionType === constants.INCREATE &&
              paxNumber > _this.bookingInform.passenngers.adult) ||
            (actionType === constants.DECREATE &&
              _this.bookingInform.passenngers.infant === config.INFANT_MINIMUN)
          ) {
            return;
          }
          _this.bookingInform.passenngers.infant = paxNumber;

          break;
        }
        default: {
          return null;
        }
      }

      $(quantityValue).text(paxNumber);

      _this.renderPaxHtml(
        {
          adult: _this.bookingInform.passenngers.adult,
          children: _this.bookingInform.passenngers.children,
          infant: _this.bookingInform.passenngers.infant,
        },
        locale
      );
    });
  },
  onChangePromoCode: function () {
    const promoCode = bookingForm.find(`input[name="promocode"]`);

    const _this = this;
    promoCode.on("input", function (e) {
      _this.bookingInform.promoCode = e.target.value;
      console.log(_this.bookingInform);
    });
  },
  onSearchFlight: function () {
    const _this = this;
    searchFlightBtn.on("click", function (e) {
      e.preventDefault();
      const searching = {
        ..._this.bookingInform,
      };
      console.log(searching);
      if (
        _this.bookingInform.departDate === "" ||
        _this.bookingInform.departDate === "" ||
        _this.bookingInform.departLocation === ""
      ) {
        _this.renderAlert().showPopup({
          type: "error",
          title: "Tìm chuyến bay",
          content: "Vui lòng điền đầy đủ thông tin trước khi đặt vé",
        });
        return;
      } else {
        if (_this.bookingInform.tripType === constants.RETURN) {
          if (_this.bookingInform.returnDate === "") {
            _this.renderAlert().showPopup({
              type: "error",
              title: "Tìm chuyến bay",
              content: "Vui lòng điền đầy đủ thông tin trước khi đặt vé",
            });
            return;
          }
        }
      }

      window.location = "flights-option.html";
    });

    const searching = () => {};
  },
  renderCityAirportResult: function (data) {
    if (!data.name) {
      return null;
    }
    var htmlTemplate = $(
      `<div class="citypare citypare--result ${
        data.isParent ? "parent" : "children"
      }">
        ${
          data.isParent
            ? `<p class="citypare__name citypare__name--group"><i class="bi bi-building"></i>${data.name} <span class="count">(${data.total})</span></p>`
            : `<p class="citypare__name citypare__name--item"><span class="province--name">${data.provinceName}</span><span class="citypare--name">${data.name}</span></p><span class="citypare__code">${data.code}</span>`
        }
      </div>`
    );
    return htmlTemplate;
  },
  renderCityAirportSelection: function (data, options) {
    const formText = bookingFormText.find((item) => {
      return item.lang === options.locale;
    });

    if (!data.name) {
      return options.type === constants.DEPART_LOCATION
        ? formText.departure
        : formText.return;
    }
    const htmlTemplate = $(
      `<span class="select2-selection__placeholder selected">${
        constants.DEPART_LOCATION ? formText.departure : formText.return
      }</span><div class="citypare citypare--selection ${
        data.isParent ? "parent" : "children"
      }">
            <p class="citypare__name">${data.provinceName}
            </p>${
              data.isParent
                ? ""
                : '<span class="citypare__code">' + data.code + "</span>"
            }</div>`
    );
    return htmlTemplate;
  },
  ajaxAirportData: function (type) {
    const _this = this;
    const processAirportData = (data, params, locale) => {
      let airports = [];
      let filterAirport = [];

      data.airportGroups.forEach((group, groupInd) => {
        let airport = [];
        group.airports.forEach((item, itemInd) => {
          airport.push({
            id: item.code,
            name: locale === constants.LOCALE_VI ? item.name : item.engName,
            provinceName:
              locale === constants.LOCALE_VI
                ? item.province.provinceName
                : item.province.provinceEngName,
            provinceEngName: item.province.provinceEngName,
            code: item.code,
            engName: item.engName,
          });
        });

        if (params.term) {
          $.each(airport, function (idx, child) {
            if (
              child.provinceEngName
                .toUpperCase()
                .indexOf(params.term.toUpperCase()) == 0 ||
              child.engName.toUpperCase().indexOf(params.term.toUpperCase()) ==
                0 ||
              child.code.toUpperCase().indexOf(params.term.toUpperCase()) == 0
            ) {
              filterAirport.push(child);
            }
          });
        }

        airports[groupInd] = {
          name: locale === constants.LOCALE_VI ? group.name : group.engName,
          children: airport,
          isParent: true,
          total: group.total,
        };
      });
      if (filterAirport.length > 0) {
        return {
          results: filterAirport,
        };
      }
      return {
        results: airports,
      };
    };
    return {
      url: () => {
        let ajaxURL;
        if (type === constants.RETURN_LOCATION) {
          let departLocation = _this.bookingInform.departLocation;
          ajaxURL =
            baseURL +
            (departLocation !== ""
              ? "?departureCode=" + departLocation + "&languageId="
              : "?languageId=") +
            languageId[_this.bookingInform.locale];
        } else {
          ajaxURL =
            baseURL + "?languageId=" + languageId[_this.bookingInform.locale];
        }

        return ajaxURL;
      },
      dataType: "json",
      data: function (params) {
        return {
          q: params.term, // search term
        };
      },
      processResults: (data, params) => {
        return processAirportData(data, params, _this.bookingInform.locale);
      },
      cache: true,
    };
  },
  updateDateSelecting: function (data) {
    if (data.tripType === constants.RETURN) {
      tripDate.addClass("return");
      tripDate.removeClass("oneway");
    } else {
      tripDate.removeClass("return");
      tripDate.addClass("oneway");
    }

    tripDateDepart.find(".booking__date--value").text(data.departDate.alt);
    tripDateDepart.find('input[name="departDate"]').val(data.departDate.value);

    tripDatereturn.find(".booking__date--value").text(data.returnDate.alt);
    tripDatereturn.find('input[name="returnDate"]').val(data.returnDate.value);
  },
  renderPaxHtml: function (data, locale) {
    const localText = bookingFormText.find((item) => item.lang === locale);

    let paxHtml = `${data.adult} ${localText.adults}, ${data.children} ${localText.children}, ${data.infant} ${localText.infant}`;
    $(".passenger--value").text(paxHtml);
    $("#adultInput").find("input").val(data.adult);
    $("#childrenInput").find("input").val(data.children);
    $("#infantInput").find("input").val(data.infant);
  },
  paxSelectDropdown: function () {
    const boxDropdown = tripPassenger.parent(
      ".booking__form--passenger--inner"
    );

    const close = () => {
      if (boxDropdown.hasClass("open")) {
        boxDropdown.removeClass("open");
      }
      return;
    };
    const open = () => {
      if (!boxDropdown.hasClass("open")) {
        boxDropdown.addClass("open");
      }
      return;
    };
    const clickOutside = () => {
      $(window).on("click", function (e) {
        if (
          document.getElementById("booking__form--passenger--inner") &&
          document
            .getElementById("booking__form--passenger--inner")
            .contains(e.target)
        ) {
          return;
        } else {
          if (boxDropdown.hasClass("open")) {
            boxDropdown.removeClass("open");
          }
        }
      });
    };

    clickOutside();
    return {
      close,
      open,
    };
  },
  renderAlert: function () {
    $(window).on("click", function (e) {
      if ($(e.target).hasClass("popup__overlay")) {
        if ($("#booking__popup")) {
          $("#booking__popup").remove();
        }
      }
    });

    function closePopup() {
      $("#booking__popup").remove();
    }

    const renderHtml = ({ type, title, content }) => {
      return `<div id="booking__popup" class="booking__popup">
      <div class="popup__overlay"></div>
      <div class="popup__container">
        <div class="popup__content">
        ${
          type === "error"
            ? `<p class="icon error"><i class="bi bi-exclamation-circle-fill"></i></p>`
            : `<p class="icon success"><i class="bi bi-check-circle-fill"></i></p>`
        }
            ${title ? `<p class="label">${title}</p>` : ""}
            ${content ? `<p class="content">${content}</p>` : ""}
        </div>
      </div>
    </div>`;
    };

    const showPopup = ({ type, title, content }) => {
      $("body").append(renderHtml({ type, title, content }));
    };

    return {
      showPopup,
      closePopup,
    };
  },
};

app.init({ locale: constants.LOCALE_VI });
