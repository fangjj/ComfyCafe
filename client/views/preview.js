Template.preview.onCreated(function () {
  console.log(this.data);
});

Template.preview.helpers({
  thumbComplete: function () {
    return _.has(this.medium.thumbnails, "list");
  },
  thumbnail: function () {
    return this.medium.thumbnails.list;
  }
});
