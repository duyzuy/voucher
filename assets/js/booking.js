const baseURL = "https://vietjetcms-api.vietjetair.com/api/v1/airport";
const languageId = "a6ca5a9f-6a9c-4f35-bf1c-c42ea3d62f14";
const tripDeparture = $("#trip__departure");
const tripReturn = $("#trip__return");
const tripDate = $("#trip__date");
const app = {
  init() {
    this.onSelectDeparture();
    this.onSelectReturn();
    this.onSelectDate();
  },
  onSelectDeparture() {
    const _this = this;
    tripDeparture
      .select2({
        ajax: {
          url: baseURL + "?languageId=" + languageId,
          dataType: "json",
          delay: 250,
          data: function (params) {
            return {
              q: params.term, // search term
            };
          },
          processResults: function (data, params) {
            let airports = [];
            data.airportGroups.forEach((group, groupInd) => {
              let airport = [];
              group.airports.forEach((item, itemInd) => {
                airport.push({
                  id: item.code,
                  name: item.name,
                  code: item.code,
                  engName: item.engName,
                });
              });
              if (params.term) {
                airport = airport.filter((item, index) => {
                  return item.engName
                    .toLowerCase()
                    .includes(params.term.toLowerCase());
                });
              }
              airports[groupInd] = {
                name: group.name,
                children: airport,
                isParent: true,
              };
            });

            return {
              results: airports,
            };
          },
          cache: true,
        },
        multiple: false,
        maximumSelectionSize: 1,
        placeholder: "Departure",
        templateResult: this.customTemplateResult,
        templateSelection: this.customTemplateSelection,
        dropdownCssClass: "booking__form__dropdown",
        multiple: true,
        maximumSelectionLength: 2,
        theme: "classic",
      })
      .on("select2:select", function (e) {
        $(this).val([]).trigger("change");
        $(this).val([e.params.data.id]).trigger("change");
        _this.onSelectReturn(e.params.data.id);
      });
  },
  onSelectReturn(apCode = null) {
    const url =
      baseURL +
      (apCode ? "?departureCode=" + apCode + "&languageId=" : "?languageId=") +
      languageId;
    const _this = this;
    tripReturn
      .select2({
        ajax: {
          url,
          dataType: "json",
          delay: 250,
          data: function (params) {
            return {
              q: params.term, // search term
            };
          },
          processResults: function (data, params) {
            let airports = [];
            data.airportGroups.forEach((group, groupInd) => {
              let airport = [];
              group.airports.forEach((item, itemInd) => {
                airport.push({
                  id: item.code,
                  name: item.name,
                  code: item.code,
                  engName: item.engName,
                });
              });
              if (params.term) {
                airport = airport.filter((item, index) => {
                  return item.engName
                    .toLowerCase()
                    .includes(params.term.toLowerCase());
                });
              }
              airports[groupInd] = {
                name: group.name,
                children: airport,
                isParent: true,
              };
            });

            return {
              results: airports,
            };
          },
          cache: true,
        },
        multiple: false,
        maximumSelectionSize: 1,
        placeholder: "Return",
        templateResult: this.customTemplateResult,
        templateSelection: this.customTemplateSelection,
        dropdownCssClass: "booking__form__dropdown",
        multiple: true,
      })
      .on("select2:select", function (e) {
        $(this).val([]).trigger("change");
        $(this).val([e.params.data.id]).trigger("change");
        _this.onSelectDeparture(e.params.data.id);
      });
  },
  onSelectDate() {
    tripDate.daterangepicker(
      {
        autoApply: true,
        singleDatePicker: false,
      },
      function (start, end, label) {
        console.log(
          "New date range selected: " +
            start.format("YYYY-MM-DD") +
            " to " +
            end.format("YYYY-MM-DD") +
            " (predefined range: " +
            label +
            ")"
        );
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
  customTemplateSelection(data) {
    if (!data.name) {
      return null;
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
};

app.init();

// $("#tripdate").daterangepicker(
//   {
//     showDropdowns: true,
//     autoApply: true,
//     startDate: "07/20/2022",
//     endDate: "07/26/2022",
//     minDate: "20/08/2022",
//     drops: "auto",
//   },
//   function (start, end, label) {
//     console.log(
//       "New date range selected: " +
//         start.format("YYYY-MM-DD") +
//         " to " +
//         end.format("YYYY-MM-DD") +
//         " (predefined range: " +
//         label +
//         ")"
//     );
//   }
// );
