Template.reactiveAvatar.helpers({
	hasAvatars: function () {
		return _.has(this.profile, "avatars");
	},
	md5: function () {
		return (this.profile.avatars[this.class] || this.profile.avatars.fullsize).md5;
	}
});
