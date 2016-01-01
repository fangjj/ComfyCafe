Template.home.onCreated(function () {
	this.isUploading = new ReactiveVar(false);
});

Template.home.onRendered(function () {
	$(".tooltipped").tooltip({delay: 50});
});

Template.home.onDestroyed(function () {
	$(".tooltipped").tooltip("remove");
});

Template.home.helpers({
	isUploading: function () {
		return Template.instance().isUploading.get();
	},
	files: function () {
		return S3.collection.find();
	}
});

Template.home.events({
  "dropped .dropzone": function (event, template) {
		var uploadToggle = function (state) {
			template.isUploading.set(state);
		};

		uploadToggle(true);
		var files = getFiles(event);
		S3.upload({
      files: files,
      path: ""
    }, function (err, results) {
			uploadToggle(false);
			Meteor.call("addPost", results, function (err, name) {
				Router.go("post.view", {name: name});
			});
    });
  },
  "change .addFile": function (event, template) {
		Template.instance().isUploading.set(true);
    FS.Utility.eachFile(event, function (file) {
			addFile(file, template);
		});
  }
});
