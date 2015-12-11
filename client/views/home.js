function addFile (file, template) {
  // These aren't enforced!
	var maxFileSize = 16000000;
	var acceptFileTypes = /(\.|\/)(gif|jpe?g|png|webm|mp4|ogv)$/i;

	var reader = new FileReader();
	reader.onload = function (e) {
		var type = file.type.split("/");

		Media.insert(file, function (err, fileObj) {
      var status;
			if (err) {
        status = {
          type: "error",
          message: err
        };
			} else {
        status = {
          type: "success",
          message: "Uploaded successfully!"
        };
        Meteor.call("addPost", fileObj._id, function (err, name) {
          Router.go("post.view", {name: name});
        });
			}
		});
	};
	reader.readAsDataURL(file);
}

Template.home.events({
  "dropped .dropzone": function (event, template) {
    FS.Utility.eachFile(event, function (file) { addFile(file, template) });
  },
  "change .addFile": function (event, template) {
    FS.Utility.eachFile(event, function (file) { addFile(file, template) });
  }
});
