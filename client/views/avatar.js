Template.avatar.helpers({
	hasAvatar: function () {
		return _.has(this.profile, "avatar");
	},
	md5: function () {
		return (this.profile.avatars[this.class] || this.profile.avatars.fullsize).md5;
	}
});
