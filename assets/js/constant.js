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

<<<<<<< HEAD
const bookingInformation = {
  tripType: constants.RETURN,
  departLocation: "",
  returnLocation: "",
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
  flights: [],
  departure: [],
  return: [],
};
export { constants, bookingInformation, config };
=======
export { constants, config };
>>>>>>> d35df71263d633824e30375239be140dbdf5d756
