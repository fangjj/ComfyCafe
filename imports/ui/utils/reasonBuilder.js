import _ from "lodash";

function reasonBuilder(state) {
  return _.pick(state, [ "violation", "details" ]);
}

export default reasonBuilder;
