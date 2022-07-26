const passengers = {
  start: function () {
    this.handleEvent();
  },
  handleEvent: function () {
    //handle dropdown passenger
    $(".pax__form--information").on(
      "click",
      ".pax__form--header",
      function (e) {
        const targetEl = e.target.closest(".pax__form--header");
        if (targetEl) {
          const parentItem = $(this).closest(".pax__form--information");
          if (parentItem.hasClass("expanded")) {
            parentItem.removeClass("expanded");
            $(this)
              .find(".pax__form-collapse-btn")
              .html(`<i class="bi bi-plus-square-dotted"></i>`);
          } else {
            parentItem.addClass("expanded");
            $(this)
              .find(".pax__form-collapse-btn")
              .html(`<i class="bi bi-dash-square-dotted"></i>`);
          }
        }
      }
    );

    $(".flight__sectors--header").on(
      "click",
      ".flight__sector--icon",
      function (e) {
        const targetEl = $(this).closest(".flight__sector--icon");
        if (targetEl) {
          const parentItem = $(this).closest(".flight__sectors");
          if (parentItem.hasClass("expanded")) {
            parentItem.removeClass("expanded");
            $(this).html(`<i class="bi bi-plus-square-dotted"></i>`);
          } else {
            parentItem.addClass("expanded");
            $(this).html(`<i class="bi bi-dash-square-dotted"></i>`);
          }
        }
      }
    );
  },
};

export default passengers;
