import _ from "lodash";

import mongoid from "/imports/api/common/mongoid";

const base = "/gridfs/media/";

function daysToSeconds(d) {
  // This constant isn't a perfect representation, but it's a highly suitable representation.
  // 86400 = 24 * 60 * 60
  return d * 86400;
}

const oneMonth = daysToSeconds(30);

function queryBuilder(str, params) {
  if (params && ! _.isEmpty(params)) {
    str += "?" + _.reduce(params, (result, v, k) => {
      if (result) {
        result += "&";
      }
      return result + k + "=" + v;
    }, "");
  } return str;
}

function getMediaUrlMD5(md5) {
  return queryBuilder(base + md5, {
    cache: oneMonth
  });
}

function getMediaUrlID(id, size) {
  return queryBuilder(base + "id/" + id, {
    size,
    cache: oneMonth
  });
}

function getMediaUrlPost(postId, size) {
  return queryBuilder(base + "post/" + postId, {
    size,
    cache: daysToSeconds(1)
  });
}

function getMediaUrlAvatar(userId, avatarId, size) {
  return queryBuilder(base + "user/" + userId + "/" + mongoid.str(avatarId), {
    size,
    cache: oneMonth
  });
}

function getMediaUrlDjent(userId) {
  return queryBuilder(base + "djent/" + userId, {
    cache: oneMonth
  });
}

export {
  getMediaUrlMD5,
  getMediaUrlID,
  getMediaUrlPost,
  getMediaUrlAvatar,
  getMediaUrlDjent
};
