Template.registerHelper("isoDate", function (date) {
  return moment(date).toISOString();
});

Template.registerHelper("prettifyDate", function (date) {
  return moment(date).fromNow();
});
