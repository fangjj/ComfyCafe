Template.medium.helpers({
  isImage: function () {
    return this.contentType.split("/")[0] === "image";
  },
  isVideo: function () {
    return this.contentType.split("/")[0] === "video";
  },
  isAudio: function () {
    return this.contentType.split("/")[0] === "audio";
  }
});
