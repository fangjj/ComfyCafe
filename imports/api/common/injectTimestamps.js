import _ from "lodash";

function injectTimestamps(doc) {
  if (! _.has(doc, "createdAt")) {
    doc.createdAt = new Date();
  }
  doc.updatedAt = new Date();
  return doc;
}

export default injectTimestamps;
