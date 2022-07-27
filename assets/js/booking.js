const baseURL = "https://vietjetcms-api.vietjetair.com/api/v1/airport";
const languageId = "a6ca5a9f-6a9c-4f35-bf1c-c42ea3d62f14";
const tripDeparture = $("#trip__departure");
const tripReturn = $("#trip__return");
const tripDate = $("#trip__date");
const constants = {
  DEPART_LOCATION: "departLocation",
  RETURN_LOCATION: "returnLocation",
  ONEWAY: "oneway",
  RETURN: "return",
  DATE_FORMAT: "YYYY-MM-DD",
  LOCALE_EN: "en",
  LOCALE_VI: "vi",
};
const dateLocale = [
  {
    lang: "en",
    departText: "Depart date",
    returnText: "Return date",
    locale: {
      format: "MM-DD-YYYY",
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
      format: "DD-MM-YYYY",
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

const tripType = $("#trip__type--oneway, #trip__type--return");
const app = {
  bookingInform: {
    tripType: constants.RETURN,
    departLocation: "",
    returnLocation: "",
    departDate: "",
    returnDate: "",
    passenngers: {
      adults: 1,
      children: 0,
      infant: 0,
    },
    currentSelect: "",
    locale: constants.LOCALE_VI,
  },
  init() {
    this.onSelectTripType();
    this.onSelectDeparture();
    this.onSelectReturn();
    this.onSelectDate();
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
            const ajaxURL = baseURL + "?languageId=" + languageId;
            return ajaxURL;
          },
          dataType: "json",
          data: function (params) {
            return {
              q: params.term,
            };
          },
          processResults: _this.onProcessResults,
          cache: true,
        },

        placeholder: "Departure",
        templateResult: _this.customTemplateResult,
        templateSelection: (data) =>
          _this.customTemplateSelection(data, {
            type: constants.DEPART_LOCATION,
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
              languageId;
            return ajaxURL;
          },
          dataType: "json",
          data: function (params) {
            return {
              q: params.term, // search term
            };
          },
          processResults: _this.onProcessResults,
          cache: true,
        },
        placeholder: "Return",
        templateResult: _this.customTemplateResult,
        templateSelection: (data) =>
          _this.customTemplateSelection(data, {
            type: constants.RETURN_LOCATION,
          }),
        dropdownCssClass: "booking__form__dropdown",
        // dropdownParent: $("#dropdown__citypare--return"),
        width: "resolve",
      })
      .on("select2:select", function (e) {
        _this.bookingInform.returnLocation = e.params.data.id;
        $(this).val(_this.bookingInform.returnLocation).trigger("change");
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
      },
      returnDate: {
        text: currentLocale.returnText,
        value: _this.bookingInform.returnDate,
      },
      tripType: _this.bookingInform.tripType,
    };

    _this.renderDatePickerTemplate(data);

    tripDate.daterangepicker(
      {
        autoApply: true,
        singleDatePicker: false,
        minDate: new Date(),
      },
      function (start, end, label) {
        _this.bookingInform.departDate = start.format(constants.DATE_FORMAT);
        _this.bookingInform.returnDate = end.format(constants.DATE_FORMAT);

        data.departDate.value = start.format(constants.DATE_FORMAT);
        data.returnDate.value = end.format(constants.DATE_FORMAT);
        _this.renderDatePickerTemplate(data);
      }
    );
  },
  customTemplateResult(data) {
    if (!data.name) {
      return null;
    }
    var htmlTemplate = $(
      `<div class="citypare citypare--result ${
        data.isParent ? "parent" : "children"
      }">
        <p class="citypare__name">${
          data.isParent
            ? '<i class="bi bi-building"></i>' + data.name
            : data.name
        }
        </p>${
          data.isParent
            ? ""
            : '<span class="citypare__code">' + data.code + "</span>"
        }</div>`
    );
    return htmlTemplate;
  },
  customTemplateSelection(data, options) {
    if (!data.name) {
      return options.type === constants.DEPART_LOCATION
        ? "Điểm khởi hành"
        : "Điểm đến";
    }
    var htmlTemplate = $(
      `<div class="citypare citypare--selection ${
        data.isParent ? "parent" : "children"
      }">
            <p class="citypare__name">${data.name}
            </p>${
              data.isParent
                ? ""
                : '<span class="citypare__code">' + data.code + "</span>"
            }</div>`
    );
    return htmlTemplate;
  },
  onProcessResults: (data, params) => {
    let airports = [];
    let filterAirport = [];

    data.airportGroups.forEach((group, groupInd) => {
      let airport = [];
      group.airports.forEach((item, itemInd) => {
        airport.push({
          id: item.code,
          name: item.name,
          provinceName: item.province.provinceName,
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
        name: group.name,
        children: airport,
        isParent: true,
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
    const classes = (type) => {
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

    let html = `<div id="trip__date--depart" class="${classes("depart")}">`;
    html += `<div class="trip__date--icon"><i class="bi bi-calendar-week"></i></div>`;
    html += `<div class="trip__date--text">`;
    html += `<span class="booking__date--text">${data.departDate.text}</span>`;
    html += `<span class="booking__date--value">${data.departDate.value}</span>`;
    html += `</div><input type="hidden" name="departDate" value="${data.departDate.value}"/></div>`;
    if (data.tripType === constants.RETURN) {
      html += `<div id="trip__date--return" class="${classes("return")}">`;
      html += `<div class="trip__date--icon"><i class="bi bi-calendar-week"></i></div>`;
      html += `<div class="trip__date--text">`;
      html += `<span class="booking__date--text">${data.returnDate.text}</span>`;
      html += `<span class="booking__date--value">${data.returnDate.value}</span>`;
      html += `</div><input type="hidden" name="returnDate" value="${data.returnDate.value}"/></div>`;
    }

    $("#trip__date").html(html);
  },
};

app.init();
