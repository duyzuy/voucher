import { baseURL, languageId } from "../config.js";

import { client } from "../api/client.js";
export const airportLists = async function (lang = "vi") {
  let data = {};
  const ajaxUrl = baseURL + "?languageId=" + languageId[lang];

  const airportData = client.get(ajaxUrl);

  const response = await airportData;

  if (response.status === true) {
    data = response.airportGroups;
    return {
      airportGroups: data,
    };
  }

  return {
    message: "can't get data",
  };
};
