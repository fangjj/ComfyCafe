Template.preview.onCreated(function () {

});

Template.preview.helpers({
  thumbComplete: function () {
    var medium = media.findOne(
      { _id: new Mongo.ObjectID(Template.instance().data.medium) }
    );
    return _.has(medium.metadata, "thumbComplete") && medium.metadata.thumbComplete;
  },
  thumbnail: function () {
    var thumb = media.findOne(
      { "metadata.thumbOf": new Mongo.ObjectID(this.medium) }
    );
    if (! thumb.metadata.terminated) {
      return thumb;
    }
  }
});
