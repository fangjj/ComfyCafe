Template.preview.onCreated(function () {

});

Template.preview.helpers({
  thumbnail: function () {
    return media.findOne({
      "metadata.thumbOf": new Mongo.ObjectID(this.medium)
    });
  }
});
