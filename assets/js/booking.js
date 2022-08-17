import { constants } from "./constants/constant.js";
import config, { baseURL, languageId } from "./config.js";
import { bookingFormText, dateLocale } from "./translate.js";

import bookingFormSearch from "./modules/bookingFormSearch.js";
import flightSelection from "./modules/flightSelection.js";
import { isLocation } from "./utils/helper.js";
const app = {
  init: function (locale) {
    //starting searching in form

    bookingFormSearch.start(locale);

    //flight options handle

    if (isLocation("flights-option")) {
      flightSelection.start(locale);
    }
  },
};

app.init({ locale: constants.LOCALE_VI });
