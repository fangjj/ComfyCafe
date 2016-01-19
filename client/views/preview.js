Template.preview.helpers({
  thumbTerminated: function () {
    var med = this.medium;
    return med.thumbnails && med.thumbnails.list && med.thumbnails.list.terminated;
  },
  thumbnail: function () {
    if (this.medium.thumbnails) {
      return this.medium.thumbnails.list;
    }
  }
});
