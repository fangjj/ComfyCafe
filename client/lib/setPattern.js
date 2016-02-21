setPattern = function (str) {
  var pattern = GeoPattern.generate(str);

  $("body").css("background-image", pattern.toDataUrl());

  var color = tinycolor(pattern.color);
  $(".topNav").css("background-color", color.desaturate(5).darken(15));
};
