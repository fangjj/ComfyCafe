Template.search.onCreated(function () {
  var self = this;

  self.ready = new ReactiveVar(false);
  self.rxTagStr = new ReactiveVar();

  self.autorun(function () {
    self.ready.set(false);
    self.tagStr = tagStrFromUrl(FlowRouter.getParam("rawTagStr"));
		self.handle = self.subscribe("searchPosts", self.tagStr);
	});

  self.autorun(function () {
    if (self.handle.ready()) {
      self.rxTagStr.set(self.tagStr);
      self.ready.set(true);
    }
  });
});

Template.search.helpers({
  posts: function () {
    return queryTags(Template.instance().rxTagStr.get());
  },
  isReady: function () {
    return Template.instance().ready.get();
  }
});
