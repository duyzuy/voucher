const baseURL = "https://vietjetcms-api.vietjetair.com/api/v1/airport";
const languageId = {
  vi: "a6ca5a9f-6a9c-4f35-bf1c-c42ea3d62f14",
  en: "2f321ebe-16dc-4c72-ac60-08f8a4e1f4f1",
};

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
const config = {
  PAXLIMIT: 9,
  ADULT_MINIMUN: 1,
  CHILDREN_MINIMUN: 0,
  INFANT_MINIMUN: 0,
};
const constants = {
  DEPART_LOCATION: "departLocation",
  RETURN_LOCATION: "returnLocation",
  ONEWAY: "oneway",
  RETURN: "return",
  DATE_FORMAT: "MM-DD-YYYY",
  LOCALE_EN: "en",
  LOCALE_VI: "vi",
  ADULT: "adult",
  CHILDREN: "children",
  INFANT: "infant",
  INCREATE: "increate",
  DECREATE: "decreate",
};
const dateLocale = [
  {
    lang: "en",
    departText: "Depart date",
    returnText: "Return date",
    locale: {
      format: "dddd, MMM Do YYYY",
      separator: "-",
      applyLabel: "Apply",
      cancelLabel: "Cancel",
      fromLabel: "From",
      toLabel: "To",
      customRangeLabel: "Custom",
      weekLabel: "W",
      daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
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
      firstDay: 1,
    },
  },
  {
    lang: "vi",
    departText: "Ngày đi",
    returnText: "Ngày về",
    locale: {
      format: "dddd, Do MMM YYYY",
      separator: "-",
      applyLabel: "Xác nhận",
      cancelLabel: "Huỷ bỏ",
      fromLabel: "Từ",
      toLabel: "Đến",
      customRangeLabel: "Custom",
      weekLabel: "Tuần",
      daysOfWeek: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
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
      firstDay: 1,
    },
  },
];
const bookingFormText = [
  {
    lang: "en",
    departure: "Departure",
    return: "Return",
    searchFlight: "Search",
    adults: "Adults",
    children: "Children",
    infant: "Infant",
  },
  {
    lang: "vi",
    departure: "Điểm Khởi hành",
    return: "Điểm đến",
    searchFlight: "Tìm chuyến bay",
    adults: "Người lớn",
    children: "Trẻ em",
    infant: "Em bé",
  },
];

const app = {
  bookingInform: {
    tripType: constants.RETURN,
    departLocation: "",
    returnLocation: "",
    departDate: "",
    returnDate: "",
    passenngers: {
      adult: 1,
      children: 0,
      infant: 0,
    },
    currentSelect: "",
    locale: "",
  },
  init({ locale }) {
    this.setLocale(locale);
    this.onSelectTripType();
    this.onSelectDeparture();
    this.onSelectReturn();
    this.onSelectDate();
    this.onSelectPassenger();
    this.onSearchFlight();
    this.popupShowing();
    this.paxSelectDropdown();
  },
  setLocale(locale) {
    this.bookingInform.locale = locale;
  },
  onSelectTripType() {
    const _this = this;
    tripType.on("change", (e) => {
      _this.bookingInform.tripType = e.target.value;
      _this.onSelectDate();
    });
  },
  onSelectDeparture() {
    const _this = this;
    tripDeparture.val(_this.bookingInform.departDate).trigger("change");

    tripDeparture
      .select2({
        ajax: {
          url: () => {
            const ajaxURL =
              baseURL + "?languageId=" + languageId[_this.bookingInform.locale];
            return ajaxURL;
          },
          dataType: "json",
          data: function (params) {
            return {
              q: params.term,
            };
          },
          processResults: (data, params) => {
            return _this.onProcessResults(
              data,
              params,
              _this.bookingInform.locale
            );
          },
          cache: true,
        },

        placeholder: "Departure",
        templateResult: _this.customTemplateResult,
        templateSelection: (data) =>
          _this.customTemplateSelection(data, {
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
  onSelectReturn() {
    const _this = this;

    tripReturn
      .select2({
        ajax: {
          url: () => {
            let departLocation = _this.bookingInform.departLocation;

            const ajaxURL =
              baseURL +
              (departLocation !== ""
                ? "?departureCode=" + departLocation + "&languageId="
                : "?languageId=") +
              languageId[_this.bookingInform.locale];
            return ajaxURL;
          },
          dataType: "json",
          data: function (params) {
            return {
              q: params.term, // search term
            };
          },
          processResults: (data, params) => {
            return _this.onProcessResults(
              data,
              params,
              _this.bookingInform.locale
            );
          },
          cache: true,
        },
        placeholder: "Return",
        templateResult: _this.customTemplateResult,
        templateSelection: (data) =>
          _this.customTemplateSelection(data, {
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
  onSelectDate() {
    const _this = this;
    const currentLocale = dateLocale.find((item, index) => {
      return item.lang === _this.bookingInform.locale;
    });

    let data = {
      departDate: {
        text: currentLocale.departText,
        value: _this.bookingInform.departDate,
        alt: "",
      },
      returnDate: {
        text: currentLocale.returnText,
        value: _this.bookingInform.returnDate,
        alt: "",
      },
      tripType: _this.bookingInform.tripType,
    };

    _this.renderDatePickerTemplate(data);

    tripDate
      .daterangepicker(
        {
          // autoApply: true,
          singleDatePicker:
            _this.bookingInform.tripType === constants.ONEWAY ? true : false,
          minDate: new Date(),
          locale: { ...currentLocale.locale },
          parentEl: "#trip__date--dropdown",
        },
        function (start, end, label) {
          _this.bookingInform.departDate = start.format(
            currentLocale.locale.format
          );
          _this.bookingInform.returnDate = end.format(
            currentLocale.locale.format
          );

          data.departDate.value = start.format(constants.DATE_FORMAT);
          data.returnDate.value = end.format(constants.DATE_FORMAT);

          data.departDate.alt = start
            .locale(currentLocale.lang)
            .format(currentLocale.locale.format);
          data.returnDate.alt = start
            .locale(currentLocale.lang)
            .format(currentLocale.locale.format);

          _this.renderDatePickerTemplate(data);
          _this.paxSelectDropdown().open();
        }
      )
      .on("show.daterangepicker", function (ev, picker) {
        $(".drp-calendar.right").show();
      });
  },
  onSelectPassenger() {
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
  onSearchFlight() {
    const _this = this;
    searchFlightBtn.on("click", function (e) {
      e.preventDefault();
      const searching = {
        ..._this.bookingInform,
      };

      if (
        _this.bookingInform.departDate === "" ||
        _this.bookingInform.departDate === "" ||
        _this.bookingInform.departLocation === ""
      ) {
        _this.popupShowing().showPopup({
          type: "error",
          title: "Tìm chuyến bay",
          content: "Vui lòng điền đầy đủ thông tin trước khi đặt vé",
        });
        return;
      } else {
        if (_this.bookingInform.tripType === constants.RETURN) {
          if (_this.bookingInform.returnDate === "") {
            _this.popupShowing().showPopup({
              type: "error",
              title: "Tìm chuyến bay",
              content: "Vui lòng điền đầy đủ thông tin trước khi đặt vé",
            });
            return;
          }
        }
      }

      // window.location = "selectflight.html?name=123";
    });

    const searching = () => {};
  },
  customTemplateResult(data) {
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
  customTemplateSelection(data, options) {
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
  onProcessResults: (data, params, locale) => {
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
  },
  renderDatePickerTemplate(data) {
    const cls = (type) => {
      let classes = `trip__date--wrap trip__date--${type}`;
      let keyObject = "departDate";
      if (type === "return") {
        keyObject = "returnDate";
      }
      if (data[keyObject].value !== "") {
        // classes.concat(" ", "selected");
        classes += " selected";
      }
      return classes;
    };
    let defaultClass = "return";
    let html = `<div id="trip__date--depart" class="${cls("depart")}">`;
    html += `<div class="trip__date--icon"><i class="bi bi-calendar2-week-fill"></i></div>`;
    html += `<div class="trip__date--text">`;
    html += `<span class="booking__date--text">${data.departDate.text}</span>`;
    html += `<span class="booking__date--value">${data.departDate.alt}</span>`;
    html += `</div><input type="hidden" name="departDate" value="${data.departDate.value}"/></div>`;
    if (data.tripType === constants.RETURN) {
      html += `<div id="trip__date--return" class="${cls("return")}">`;
      html += `<div class="trip__date--icon"><i class="bi bi-calendar2-week-fill"></i></div>`;
      html += `<div class="trip__date--text">`;
      html += `<span class="booking__date--text">${data.returnDate.text}</span>`;
      html += `<span class="booking__date--value">${data.returnDate.alt}</span>`;
      html += `</div><input type="hidden" name="returnDate" value="${data.returnDate.value}"/></div>`;
    }
    if (data.tripType === defaultClass) {
      $("#trip__date").addClass(defaultClass);
      $("#trip__date").removeClass("oneway");
    } else {
      $("#trip__date").removeClass(defaultClass);
      $("#trip__date").addClass(data.tripType);
    }

    defaultClass = data.tripType;

    $("#trip__date").html(html);
  },
  renderPaxHtml(data, locale) {
    const localText = bookingFormText.find((item) => item.lang === locale);

    let paxHtml = `${data.adult} ${localText.adults}, ${data.children} ${localText.children}, ${data.infant} ${localText.infant}`;
    $(".passenger--value").text(paxHtml);
    $("#adultInput").find("input").val(data.adult);
    $("#childrenInput").find("input").val(data.children);
    $("#infantInput").find("input").val(data.infant);
  },
  paxSelectDropdown() {
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
          document
            .getElementById("booking__form--passenger--inner")
            .contains(e.target) ||
          e.target.contains(
            document.getElementById("trip__date--dropdown").childNodes[0]
              .childNodes[3].childNodes[2]
          )
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
  popupShowing() {
    const _this = this;

    $(".popup__overlay").on("click", function (e) {
      if ($(e.target).hasClass("popup__overlay")) {
        $("#booking__popup").remove();
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
      _this.popupShowing();
    };

    return {
      showPopup,
      closePopup,
    };
  },
};

app.init({ locale: constants.LOCALE_VI });
