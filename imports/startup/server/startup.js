Meteor.startup(function () {
  const timeInMillis = 1000 * 10; // 10 secs
  FlowRouter.setPageCacheTimeout(timeInMillis);
  FlowRouter.setDeferScriptLoading(true);
});
