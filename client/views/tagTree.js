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

var removeNewTags = function (template) {
  template.$(".new, .dynamic").remove();
};

Template.tagTree.events({
  "click .addAdj": function (event, template) {
    $(event.currentTarget).after('<a class="taglet adj new" data-placeholder="adj" contenteditable></a>');
  },
  "click .addNoun": function (event, template) {
    // Remember when logic and views were truly separate?
    // Because I don't.
    $(event.currentTarget).parent().before('' +
      '<li class="descriptor new">' +
        '<a class="taglet adj addAdj dynamic" title="Add adjective"><i class="material-icons">add</i></a>' +
        '<a class="taglet adj new" data-placeholder="adj" contenteditable></a>' +
        '<a class="taglet noun new" data-placeholder="noun" contenteditable></a>' +
      '</li>'
    );
  },
  "click .addRootNoun": function (event, template) {
    // And it gets worse. Might ReactJS give us a better time for our view layer?
    $(event.currentTarget).parent().parent().before('' +
      '<li class="new">' +
        '<span class="root">' +
          '<a class="taglet adj addAdj dynamic" title="Add adjective"><i class="material-icons">add</i></a>' +
          '<a class="taglet adj new" data-placeholder="adj" contenteditable></a>' +
          '<a class="taglet noun new" data-placeholder="noun" contenteditable></a>' +
        '</span>' +
        '<ul>' +
          '<li class="descriptor">' +
            '<a class="taglet noun addNoun dynamic" title="Add noun"><i class="material-icons">add</i></a>' +
          '</li>' +
        '</ul>' +
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
      removeNewTags(template);
    });
  },
  "click .cancel": function (event, template) {
    template.isEditing.set(false);
    removeNewTags(template);
  }
});
