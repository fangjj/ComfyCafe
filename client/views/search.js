Template.search.onCreated(function () {
  var self = this;
	self.autorun(function () {
		self.subscribe("searchPosts", tagStrFromUrl(FlowRouter.getParam("username")));
	});
});
