import _ from "lodash";

import injectTimestamps from "/imports/api/common/injectTimestamps";
import injectOwner from "/imports/api/users/injectOwner";

function docBuilder(baseDoc, data, opts) {
  const doc = _.defaults(baseDoc, data);
  injectTimestamps(doc);
  injectOwner(doc);
  return doc;
}

export default docBuilder;
