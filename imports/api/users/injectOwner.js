import _ from "lodash";
function injectOwner(doc, user) {
  if (! user) { user = Meteor.user(); }
  doc.owner = _.pick(user, [ "_id", "username", "normalizedUsername", "profile" ]);
  return doc;
}

export default injectOwner;
