Template.tagTree.onCreated(function () {
  this.isEditing = new ReactiveVar(false);
  this.newAdjectives = new ReactiveArray();
  this.newDescriptors = new ReactiveArray();
});

Template.tagTree.onRendered(function () {
});

Template.tagTree.helpers({
  isEditing: function () {
		return Template.instance().isEditing.get();
	},
  newAdjectives: function () {
		return Template.instance().newAdjectives.list();
	},
  newDescriptors: function () {
		return Template.instance().newDescriptors.list();
	}
});

Template.tagTree.events({
  "click .addTag": function (event, template) {
    var self = this;

    template.isEditing.set(true);
    template.newAdjectives.push({
      name: "gay",
      definition: "u kno boi"
    });
    template.newDescriptors.push({
      "name": "pants",
      "type": "generic",
      "definition": "stubbed",
      "adjectives": [
        {
          "name": "rainbow",
          "definition": "stubbed"
        },
        {
          "name": "parachute",
          "definition": "stubbed"
        }
      ]
    });
  }
});
