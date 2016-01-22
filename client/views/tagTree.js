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
  "click .addAdj": function (event, template) {
    $(event.currentTarget).after('<a class="taglet adj new" data-placeholder="new" contenteditable></a>');
  },
  "click .addNoun": function (event, template) {
    // Remember when logic and views were truly separate?
    // Because I don't.
    $(event.currentTarget).parent().before('' +
      '<li class="descriptor">' +
        '<a class="taglet adj addAdj" title="Add adjective"><i class="material-icons">add</i></a>' +
        '<a class="taglet noun new" data-placeholder="new" contenteditable></a>' +
      '</li>'
    );
  },
  "click a[contenteditable=true]": function (event, template) {
    event.preventDefault();
  },
  "click .submit": function (event, template) {
    var tagStr = tagTreeToStr(template);
    console.log(tagStr);
    Meteor.call("addTags", this._id, tagStr, function () {
      template.isEditing.set(false);
      $(".taglet.new").remove();
    });
  },
  "click .cancel": function (event, template) {
    template.isEditing.set(false);
    $(".taglet.new").remove();
  }
});
