Template.tagTree.onCreated(function () {
  this.isEditing = new ReactiveVar(false);
});

Template.tagTree.onRendered(function () {
  var self = this;

  $("#fabTag").click(function () {
    self.isEditing.set(true);
  });
});

Template.tagTree.helpers({
  isEditing: function () {
		return Template.instance().isEditing.get();
	}
});

var removeNewTags = function () {
  $(".taglet.new").remove();
};

Template.tagTree.events({
  "click .addTag": function (event, template) {
    $(event.currentTarget).after('<a class="taglet adj new" data-placeholder="new" contenteditable></a>');
  },
  "click a[contenteditable=true]": function (event, template) {
    event.preventDefault();
  },
  "click .submit": function (event, template) {
    Meteor.call("addTags", this._id, tagTreeToStr(template), function () {
      template.isEditing.set(false);
      $(".taglet.new").remove();
    });
  },
  "click .cancel": function (event, template) {
    template.isEditing.set(false);
    $(".taglet.new").remove();
  }
});
