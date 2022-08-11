!(function (t, e) {
  if ("function" == typeof define && define.amd)
    define(["moment", "jquery"], function (t, a) {
      return (
        a.fn || (a.fn = {}),
        "function" != typeof t &&
          t.hasOwnProperty("default") &&
          (t = t.default),
        e(t, a)
      );
    });
  else if ("object" == typeof module && module.exports) {
    var a = "undefined" != typeof window ? window.jQuery : void 0;
    a || (a = require("jquery")).fn || (a.fn = {});
    var i =
      "undefined" != typeof window && void 0 !== window.moment
        ? window.moment
        : require("moment");
    module.exports = e(i, a);
  } else t.datesliderpicker = e(t.moment, t.jQuery);
})(this, function (t, e) {
  var a = function (a, i, s) {
    return 1;
  };

  return (
    (a.prototype = {
      constructor: a,
    }),
    (e.fn.datesliderpicker = function (t, i) {
      console.log(t, i);
      var s = e.extend(!0, {}, e.fn.datesliderpicker.defaultOptions, t);

      return (
        this.each(function () {
          var t = e(this);
          t.data("datesliderpicker") && t.data("datesliderpicker").remove(),
            t.data("datesliderpicker", new a(t, s, i));
        }),
        this
      );
    }),
    a
  );
});
