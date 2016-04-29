const base = "/gridfs/media/";

function queryBuilder(str, size) {
  if (typeof size !== "undefined") {
    return str + "?size=" + size;
  } return str;
}

function getMediaUrlMD5(md5) {
  return base + md5;
}

function getMediaUrlID(id, size) {
  return queryBuilder(base + "id/" + id, size);
}

function getMediaUrlPost(postId, size) {
  return queryBuilder(base + "post/" + postId, size);
}

function getMediaUrlAvatar(userId, avatarId, size) {
  return queryBuilder(base + "user/" + userId + "/" + avatarId, size);
}

function getMediaUrlDjent(userId) {
  return base + "djent/" + userId;
}

export {
  getMediaUrlMD5,
  getMediaUrlID,
  getMediaUrlPost,
  getMediaUrlAvatar,
  getMediaUrlDjent
};
