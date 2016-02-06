Template.search.onCreated(function () {
  var self = this;
	self.autorun(function () {
		self.subscribe("searchPosts", tagStrFromUrl(FlowRouter.getParam("rawTagStr")));
	});
});

Template.search.helpers({
  posts: function () {
    var tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
    return queryTags(tagStr);
  }
});
