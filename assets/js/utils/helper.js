export const isExistsInput = (node) => {
  if (node.length < 0) {
    return false;
  }
  return true;
};

export const dateFormat = (date, currentFormat, lang, newFormat) => {
  const correctDate = moment(date, currentFormat);

  return correctDate.locale(lang).format(newFormat);
};

export const getScheduleTime = (scheduleTime, utcOffset, locale) => {
  const { hours, iso, minutes } = utcOffset;

  const schedule = moment(scheduleTime)
    .locale(locale.lang, { longDateFormat: { LTS: "HH:mm:ss" } })
    .clone();
  const hour = schedule.hours();
  const minute = schedule.minutes();

  const date = schedule
    .locale(locale.lang)
    .format(locale.locale.formatTextNoYear);
  const day = schedule.days();
  const dayName = locale.locale.daysOfWeekLongname[day];

  return {
    time: `${hour}:${minute}`,
    date: date,
    day: dayName,
  };
};

export const isLocation = (location) => {
  if ("string" === typeof location) {
    let pathName = window.location.pathname.trim();
    pathName = pathName.replace(".html", "").replace(/[0-9]+$/, "");

    return pathName.includes(location);
  } else {
    throw new Error("Location is invalid, must string type");
  }
};

export const inputHiddenType = (actionType, inputName, inputValue) => {
  if (inputName === null || inputName === "") return;

  typeof inputValue === "object" && (inputValue = JSON.stringify(inputValue));

  const attributeKeys = ["id", "class", "placeholder", "name", "type"];

  const hasName = (name) => {
    let isHasName = false;
    bookingForm.find("input").each((index, input) => {
      if (input.hasAttribute("name") && input.getAttribute("name") === name) {
        isHasName = true;
      }
    });
    return isHasName;
  };
  const cloneElWithNewValue = (element, valueInp) => {
    const hiddenInput = document.createElement("input");
    const attValue = document.createAttribute("value");
    for (const attr of attributeKeys) {
      if (element.hasAttribute(attr)) {
        const att = document.createAttribute(attr);
        att.value = element.getAttribute(attr);

        hiddenInput.setAttributeNode(att);
      }
    }
    attValue.value = valueInp;
    hiddenInput.setAttributeNode(attValue);
    return hiddenInput;
  };
  switch (actionType) {
    case "create": {
      if (hasName(inputName)) return;
      const inputHiddenType = document.createElement("input");
      inputHiddenType.type = "hidden";
      inputHiddenType.name = inputName;
      inputHiddenType.value = inputValue;

      bookingForm.prepend(inputHiddenType);
      break;
    }
    case "update": {
      if (!hasName(inputName)) return;
      const element = bookingForm.find(`input[name="${inputName}"]`)[0];

      const newInput = cloneElWithNewValue(element, inputValue);

      element.replaceWith(newInput);
      break;
    }
    default: {
      throw new Error("invalid action type input hidden field");
    }
  }
};

export const isEmpty = (obj) => {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true;
};
