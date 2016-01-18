Template.preview.onCreated(function () {

});

Template.preview.helpers({
  thumbComplete: function () {
    var thumb = media.findOne(
      {
        "metadata.thumbOf": new Mongo.ObjectID(Template.instance().data.medium),
        "metadata.sizeKey": "tn256x256"
      }
    );
    return _.has(thumb.metadata, "thumbComplete") && thumb.metadata.thumbComplete;
  },
  thumbnail: function () {
    var thumb = media.findOne(
      {
        "metadata.thumbOf": new Mongo.ObjectID(this.medium),
        "metadata.sizeKey": "tn256x256"
      }
    );
    if (thumb && ! thumb.metadata.terminated) {
      return thumb;
    }
  }
});
