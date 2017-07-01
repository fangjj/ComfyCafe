import _ from "lodash";

import mongoid from "/imports/api/common/mongoid";

const base = _.get(Meteor.settings, "public.imgUrl", "/gridfs/media/");

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
  return queryBuilder(addExt(base + md5, ext));
}

function getMediaUrlID(id, size, ext) {
  return queryBuilder(addExt(base + "id/" + id, ext), { size });
}

function getMediaUrlPost(postId, size, ext) {
  return queryBuilder(addExt(base + "post/" + postId, ext), { size });
}

function getMediaUrlAvatar(userId, avatarId, size, ext) {
  return queryBuilder(addExt(base + "user/" + userId + "/" + mongoid.str(avatarId), ext), { size });
}

function getMediaUrlDjent(userId) {
  return queryBuilder(addExt(base + "djent/" + userId, "svg"));
}

export {
  getMediaUrlMD5,
  getMediaUrlID,
  getMediaUrlPost,
  getMediaUrlAvatar,
  getMediaUrlDjent
};
