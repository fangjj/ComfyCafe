import _ from "lodash";

import mongoid from "/imports/api/common/mongoid";

const base = _.get(Meteor.settings, "public.imgUrl", "/gridfs/media/");

function daysToSeconds(d) {
  // This constant isn't a perfect representation, but it's a highly suitable representation.
  // 86400 = 24 * 60 * 60
  return d * 86400;
}

const oneMonth = daysToSeconds(30);

function addExt(str, ext) {
  if (ext) {
    return str + "." + ext;
  } return str;
}

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

function getMediaUrlMD5(md5, ext) {
  return queryBuilder(addExt(base + md5, ext), {
    cache: oneMonth
  });
}

function getMediaUrlID(id, size, ext) {
  return queryBuilder(addExt(base + "id/" + id, ext), {
    size,
    cache: oneMonth
  });
}

function getMediaUrlPost(postId, size, ext) {
  return queryBuilder(addExt(base + "post/" + postId, ext), {
    size,
    cache: daysToSeconds(1)
  });
}

function getMediaUrlAvatar(userId, avatarId, size, ext) {
  return queryBuilder(addExt(base + "user/" + userId + "/" + mongoid.str(avatarId), ext), {
    size,
    cache: oneMonth
  });
}

function getMediaUrlDjent(userId) {
  return queryBuilder(addExt(base + "djent/" + userId, "svg"), {
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
