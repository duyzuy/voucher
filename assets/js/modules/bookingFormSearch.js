import { constants, bookingInformation } from "../constants/constant.js";
import { bookingFormText, dateLocale } from "../translate.js";
import config, { baseURL, languageId } from "../config.js";
import { client } from "../api/client.js";
const tripDeparture = $("#trip__departure");
const tripReturn = $("#trip__return");
const tripDate = $("#trip__date");
const tripType = $("#trip__type--oneway, #trip__type--return");
const tripPassenger = $("#trip__passenger");
const bookingForm = $("#booking__form");
const searchFlightBtn = $("#booking__searchflight");
const quantities = $(".booking__quantity");

const bookingFormSearch = {
  bookingInform: bookingInformation,
  start({ locale }) {
    //set locale for booking form

    this.setDefault(locale);
    //handle all event for booking flow
    this.handleEvents();

    this.renderAlert();
  },
  setDefault: function (locale) {
    this.bookingInform.locale = locale;
    this.bookingInform.dateLocale = dateLocale.find((lc) => lc.lang === locale);
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

    tripDeparture
      .select2({
        ajax: _this.ajaxAirportData(constants.DEPART_CODE),
        placeholder: "Departure",
        templateResult: _this.renderCityAirportResult,
        templateSelection: (data) =>
          _this.renderCityAirportSelection(data, {
            type: constants.DEPART_CODE,
            locale: _this.bookingInform.locale,
          }),
        dropdownCssClass: "booking__form__dropdown",
        width: "resolve",
      })
      .on("select2:select", function (e) {
        const { selected, ...rest } = e.params.data;
        _this.bookingInform.departure = {
          ...rest,
        };
        tripReturn.val(null).trigger("change");
        tripReturn.select2("open");
      });
  },
  onSelectReturn: function () {
    const _this = this;

    tripReturn
      .select2({
        ajax: _this.ajaxAirportData(constants.RETURN_CODE),
        placeholder: "Return",
        templateResult: _this.renderCityAirportResult,
        templateSelection: (data) =>
          _this.renderCityAirportSelection(data, {
            type: constants.RETURN_CODE,
            locale: _this.bookingInform.locale,
          }),
        dropdownCssClass: "booking__form__dropdown",
        // dropdownParent: $("#dropdown__citypare--return"),
        width: "resolve",
      })
      .on("select2:select", function (e) {
        _this.bookingInform.return = {
          ...e.params.data,
        };
        $(this).val(_this.bookingInform.return.code).trigger("change");

        if (_this.bookingInform.departure !== "") {
          setTimeout(() => {
            bookingForm.addClass("expanded");
            tripDate.data("daterangepicker").show();
          }, 200);
        }
      });
  },
  onSelectDate: function () {
    const _this = this;
    const currentLocale = this.bookingInform.dateLocale;
    const today = new Date();
    tripDate
      .daterangepicker({
        // autoApply: true,
        autoApplyByStep: true,
        singleDatePicker:
          _this.bookingInform.tripType === constants.ONEWAY ? true : false,
        minDate: today,
        opens: "left",
        locale: { ...currentLocale.locale },
        parentEl: "#trip__date--dropdown",
      })
      .on("show.daterangepicker", function (ev, picker) {
        $(".drp-calendar.right").show();
        if (picker.currentStep === "start" || picker.doneSelect) {
          tripDate.find("#trip__date--depart").addClass("selecting");
          tripDate.data("daterangepicker").setMinDate(today);
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
        tripDate.find("#trip__date--depart").removeClass("selecting");
        tripDate.find("#trip__date--return").removeClass("selecting");
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

          tripDate.find("#trip__date--depart").addClass("selected");
          tripDate.find("#trip__date--depart").removeClass("selecting");
          tripDate.find("#trip__date--return").addClass("selecting");

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

          tripDate.find("#trip__date--return").removeClass("selecting");
          tripDate.find("#trip__date--return").addClass("selected");
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
        adult: _this.bookingInform.passengers.adult,
        children: _this.bookingInform.passengers.children,
        infant: _this.bookingInform.passengers.infant,
      },
      locale
    );

    quantities.on("click", ".booking__quantity--control", function (e) {
      const parentQuantity = $(this).context.parentNode;
      const paxType = $(parentQuantity).data("type");
      const actionType = $(this).data("type");
      const quantityValue = $(parentQuantity).find(".booking__quantity--value");
      let paxNumber = Number($(quantityValue).text());

      if (actionType === constants.INCREATE) {
        paxNumber++;
      } else {
        paxNumber--;
      }

      switch (paxType) {
        case constants.ADULT: {
          if (
            (actionType === constants.INCREATE &&
              paxNumber >
                config.PAXLIMIT - _this.bookingInform.passengers.children) ||
            (actionType === constants.DECREATE &&
              _this.bookingInform.passengers.adult === config.ADULT_MINIMUN)
          ) {
            return;
          }
          if (
            actionType === constants.DECREATE &&
            _this.bookingInform.passengers.adult ===
              _this.bookingInform.passengers.infant
          ) {
            _this.bookingInform.passengers.infant = paxNumber;
            $("#infantInput").find(".booking__quantity--value").text(paxNumber);
          }
          _this.bookingInform.passengers.adult = paxNumber;

          break;
        }
        case constants.CHILDREN: {
          if (
            (actionType === constants.INCREATE &&
              paxNumber >
                config.PAXLIMIT - _this.bookingInform.passengers.adult) ||
            (actionType === constants.DECREATE &&
              _this.bookingInform.passengers.children ===
                config.CHILDREN_MINIMUN)
          ) {
            return;
          }
          _this.bookingInform.passengers.children = paxNumber;

          break;
        }
        case constants.INFANT: {
          if (
            (actionType === constants.INCREATE &&
              paxNumber > _this.bookingInform.passengers.adult) ||
            (actionType === constants.DECREATE &&
              _this.bookingInform.passengers.infant === config.INFANT_MINIMUN)
          ) {
            return;
          }
          _this.bookingInform.passengers.infant = paxNumber;

          break;
        }
        default: {
          return null;
        }
      }

      $(quantityValue).text(paxNumber);

      _this.renderPaxHtml(
        {
          adult: _this.bookingInform.passengers.adult,
          children: _this.bookingInform.passengers.children,
          infant: _this.bookingInform.passengers.infant,
        },
        locale
      );
    });
  },
  onChangePromoCode: function () {
    const promoPopupTemplate = `<div class="booking__form--promo--popup">
    <div class="overlay"></div>
    <div class="promo--popup--wrapper">
      <div class="promo--verify">
        <div class="promo--popup--header">
          <span class="promo-close"><i class="bi bi-x-lg"></i></span>
          <h3>Nhập mã khuyến mại</h3>
        </div>
        <div class="promo--popup--body">
          <div class="col-auto promo-verify-input">
            <div class="input-group has-validation mb-3">
              <label for="promoCodeInputCheck" class="form-label sr-only">Mã Khuyến mại</label>
              <input class="form-control" name="promoCodeInputCheck" id="promoCodeInputCheck" type="text" placeholder="Mã khuyến mại">
              <p class="invalid-feedback mb-0"></p>
            </div>
            <button type="button" class="btn btn-sm btn-apply-voucher">Áp
              dụng</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    const inputPromoHidden = bookingForm.find(`input[name="promoCode"]`);

    const promoCodeForm = bookingForm.find(".booking__form--promo");
    const _this = this;

    //handle on/of popup
    promoCodeForm.on("click", function (e) {
      if ($(this).hasClass("has-code")) return;

      //close and remove popup promoform
      if (!$(this).hasClass("expanded")) {
        if (e.target.closest(".removeCode")) return;
        $(this).addClass("expanded");
        promoCodeForm
          .find(".booking__form--promo--inner")
          .append(promoPopupTemplate);
        $("body").attr("style", "overflow-y: hidden");
      } else {
        if (e.target.closest(".overlay") || e.target.closest(".promo-close")) {
          $("body").removeAttr("style");
          $(this).removeClass("expanded");
          promoCodeForm.find(".booking__form--promo--popup").remove();
        }
      }
    });

    /**
     *
     * Handle async check code valid
     * @params promoCode
     *
     */

    promoCodeForm.on("click", ".btn-apply-voucher", async function (e) {
      const promoCodecheck = bookingForm.find(
        `input[name="promoCodeInputCheck"]`
      );
      if (promoCodecheck.val() === "" || promoCodecheck.val() === null) {
        promoCodecheck.addClass("is-invalid");
        promoCodeForm
          .find(".invalid-feedback")
          .text("Ma khuyen mai khong duoc de trong");
        return;
      }
      const codeCheckURL =
        baseURL + "?languageId=a6ca5a9f-6a9c-4f35-bf1c-c42ea3d62f14";

      //ajax call api check
      const promoCodeValue = promoCodecheck.val();
      try {
        const response = await client.get(codeCheckURL, {
          body: {
            promoCode: promoCodeValue,
          },
        });

        //if response code valid
        if (response.status) {
          inputPromoHidden.val(promoCodeValue);
          promoCodeForm
            .find(".promocode__mask")
            .append(
              `<span class="code-valid">${promoCodeValue} <i class="bi bi-x removeCode"></i></span>`
            );
          _this.bookingInform.promoCode = promoCodeValue;
          $("body").removeAttr("style");

          promoCodeForm.removeClass("expanded");
          promoCodeForm.addClass("has-code");
          promoCodeForm.find(".booking__form--promo--popup").remove();
        } else {
          promoCodecheck.addClass("is-invalid");
          promoCodeForm
            .find(".invalid-feedback")
            .text("Ma khuyen mai khong hop le");
        }
      } catch (error) {
        console.log(error);
      }
    });

    promoCodeForm.on("click", ".removeCode", function (e) {
      promoCodeForm.find(".promocode__mask").html("");
      promoCodeForm.removeClass("has-code");
      inputPromoHidden.val("");
    });
  },
  onSearchFlight: function () {
    const _this = this;

    searchFlightBtn.on("click", function (e) {
      e.preventDefault();

      bookingForm.submit();
      if (
        _this.bookingInform.de === "" ||
        _this.bookingInform.departDate === "" ||
        _this.bookingInform.departure === ""
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

      // window.location = "flights-option.html";
    });
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
      return options.type === constants.DEPART_CODE
        ? formText.departure
        : formText.return;
    }
    const htmlTemplate = $(
      `<span class="select2-selection__placeholder selected">${
        constants.DEPART_CODE ? formText.departure : formText.return
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
        let apGroup = {
          id: group.id,
          engName: group.engName,
          name: group.name,
        };
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
            group: apGroup,
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
        if (type === constants.RETURN_CODE) {
          let departLocation = _this.bookingInform.departure.code;
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

    tripDate
      .find("#trip__date--depart .booking__date--value")
      .text(data.departDate.alt);
    tripDate.find('input[name="departDate"]').val(data.departDate.value);

    tripDate
      .find("#trip__date--return .booking__date--value")
      .text(data.returnDate.alt);
    tripDate.find('input[name="returnDate"]').val(data.returnDate.value);
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

export default bookingFormSearch;
