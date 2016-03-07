generateRoom = function () {
  var adj1 = _.sample(roomAdjs1);
  var adj2 = _.sample(roomAdjs2);
  var thing = _.sample(roomThings);

  return [adj1, adj2, thing].join(" ");
};
