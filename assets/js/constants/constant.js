export const config = {
  PAXLIMIT: 9,
  ADULT_MINIMUN: 1,
  CHILDREN_MINIMUN: 0,
  INFANT_MINIMUN: 0,
};
export const constants = {
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
  DIRECT: "direct",
  ONE_STOP: "one-stop",
  DEPARTURE: "departure",
  RETURN: "return",
};
export const status = {
  SUCCESS: "success",
  FAILED: "failed",
  PENDING: "pending",
  LOADING: "loading",
};
export const actions = {
  ADD: "add",
  REMOVE: "remove",
  DELETE: "delete",
  EDIT: "edit",
  UPDATE: "update",
  CREATE: "create",
};
export const bkInforKey = {
  TripType: "tripType",
  Depart: "departCode",
  Return: "returnCode",
  DepartDate: "departDate",
  ReturnDate: "returnDate",
  Passenngers: "passenngers",
  CurrentSelect: "currentSelect",
  Promotion: "promoCode",
  Locale: "locale",
  TravelOption: "travelOption",
  DepartureSelected: "departureSelected",
  ReturnSelected: "returnSelected",
  Adult: "adult",
  Children: "children",
  Infant: "infant",
  SessionExpIn: "sessionExpIn",
  SessionId: "sessionId",
  DateLocale: "dateLocale",
};

export const bookingInformation = {
  tripType: constants.RETURN,
  departure: {},
  return: {},
  departDate: {
    value: "",
    alt: "",
  },
  returnDate: {
    value: "",
    alt: "",
  },
  passengers: {
    adult: 1,
    children: 0,
    infant: 0,
  },
  currentSelect: "",
  locale: "",
  dateLocale: {},
  promoCode: "",
  sessionId: "",
  sessionExpIn: "",
  travelOption: {},
  returnSelected: {
    index: "",
    journey: "",
    flight: [],
  },
  departureSelected: {
    index: "",
    journey: "",
    flight: [],
  },
};

export const airportDataGroup = [];
