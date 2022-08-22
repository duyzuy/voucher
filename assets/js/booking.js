import { constants } from "./constants/constant.js";
import config, { baseURL, languageId } from "./config.js";
import { bookingFormText, dateLocale } from "./translate.js";

import bookingFormSearch from "./modules/bookingFormSearch.js";
import flightSelection from "./modules/flightSelection.js";
import passengers from "./modules/passengers.js";
import { isLocation } from "./utils/helper.js";
const app = {
  init: function (locale) {
    //starting searching in form

    bookingFormSearch.start(locale);

    //flight options handle

    if (isLocation("flights-option")) {
      flightSelection.start(locale);
    }

    if (isLocation("flights-passenger")) {
      passengers.start(locale);
    }
    if (isLocation("flights-payment")) {
      passengers.start(locale);
    }

    this.handleEvents();
  },
  handleEvents: function () {
    //handle summary
    $(".header__summary").on("click", function (e) {
      console.log(e.target);
      const parent = $(this).closest(".header__summary");
      if (parent.hasClass("expanded")) {
        if (
          e.target.closest(".overlay") ||
          e.target.closest(".header__summary__bar") ||
          e.target.closest(".btn__summary__close--dropdown")
        ) {
          parent.removeClass("expanded");
        }
      } else {
        parent.addClass("expanded");
      }
    });
  },
};

app.init({ locale: constants.LOCALE_VI });
