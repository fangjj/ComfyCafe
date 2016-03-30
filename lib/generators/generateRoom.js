import _ from "lodash";

import roomAdjs1 from "./roomAdjs1";
import roomAdjs2 from "./roomAdjs2";
import roomThings from "./roomThings";

function generateRoom() {
  var adj1 = _.sample(roomAdjs1);
  var adj2 = _.sample(roomAdjs2);
  var thing = _.sample(roomThings);

  return [adj1, adj2, thing].join(" ");
};

export default generateRoom;
