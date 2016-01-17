Template.avatar.helpers({
	hasAvatar: function () {
		return _.has(this.profile, "avatar");
	}
});
