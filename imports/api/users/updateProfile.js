import _ from "lodash";

import profileSyncList from "/imports/api/users/syncList";
import prefixer from "/imports/api/common/prefixer";
import { dmTopicSync } from "/imports/api/topics/dmTopic";

function ownerPrefixer(doc) {
  return prefixer("owner", doc);
}

function updateOwnerDocs(query, update) {
  _.map(profileSyncList, (coll) => {
    coll.update(
      query,
      update,
      { multi: true }
    );
  });
  dmTopicSync(query, update);
}

function profilePrefixer(doc) {
  return prefixer("profile", doc);
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

  updateOwnerDocs(
    ownerQuery,
    ownerUpdate
  );
}

export {
  ownerPrefixer,
  updateOwnerDocs,
  profilePrefixer,
  updateProfile
};
