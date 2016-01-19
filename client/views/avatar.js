Template.avatar.onRendered(function () {
	if (! _.has(this.data.profile, "avatar")) {
		var size = thumbnailPolicies.avatar[this.data.class].size;
		this.$(".djentCanvas").attr({
			width: size[0],
			height: size[1]
		}).jdenticon(this.data.profile.sassyHash);
	}
});

Template.avatar.helpers({
	hasAvatar: function () {
		return _.has(this.profile, "avatar");
	},
	md5: function () {
		return (this.profile.avatars[this.class] || this.profile.avatars.fullsize).md5;
	}
});
