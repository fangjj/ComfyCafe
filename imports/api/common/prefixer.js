import _ from "lodash";

function prefixer(prefix, doc) {
  return _.mapKeys(doc, (value, key) => {
    return prefix + "." + key;
  });
}

export default prefixer;
