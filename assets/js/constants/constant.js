const config = {
  PAXLIMIT: 9,
  ADULT_MINIMUN: 1,
  CHILDREN_MINIMUN: 0,
  INFANT_MINIMUN: 0,
};
const constants = {
  DEPART_CODE: "departCode",
  RETURN_CODE: "returnCode",
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

const bookingInformation = {
  tripType: constants.RETURN,
  departCode: "",
  returnCode: "",
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
  travelOption: [],
  departure: [],
  return: [],
};

export { constants, config, bookingInformation };
