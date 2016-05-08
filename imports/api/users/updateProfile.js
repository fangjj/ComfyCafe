import _ from "lodash";

import profileSyncList from "/imports/api/users/syncList";

function ownerPrefixer(doc) {
  return _.mapKeys(doc, (value, key) => {
    return "owner." + key;
  });
}

function updateOwnerDocs(query, update) {
  _.map(profileSyncList, (coll) => {
    coll.update(
      query,
      update,
      { multi: true }
    );
  });
}

function updateProfile(query, update) {
  Meteor.users.update(
    query,
    update,
    { multi: true }
  );

  const ownerQuery = ownerPrefixer(query);
  const ownerUpdate = _.mapValues(update, (subDoc, key) => {
    return ownerPrefixer(subDoc);
  });

  prettyPrint(ownerQuery, ownerUpdate);

  updateOwnerDocs(
    ownerQuery,
    ownerUpdate
  );
}

export {
  ownerPrefixer,
  updateOwnerDocs,
  updateProfile
};
