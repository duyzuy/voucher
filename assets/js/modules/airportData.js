import config, { baseURL, languageId } from "../config.js";
import { airportDataGroup } from "../constants/constant.js";

import { client } from "../api/client.js";
export const getAirportData = async function (lang = "vi") {
  let data = {};
  const ajaxUrl = baseURL + "?languageId=" + languageId[lang];

  const airportData = client.get(ajaxUrl);

  data = await airportData;
  return {
    airportGroups: data.airportGroups,
  };
};
