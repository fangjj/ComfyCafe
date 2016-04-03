import _ from "lodash";

import adjs1 from "./adjs1";
import adjs2 from "./adjs2";
import things from "./things";

function generateRoom() {
  const adj1 = _.sample(adjs1);
  const adj2 = _.sample(adjs2);
  const thing = _.sample(things);

  return [adj1, adj2, thing].join(" ");
};

export default generateRoom;
