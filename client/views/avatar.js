Template.avatar.onRendered(function () {
	var size = thumbnailPolicies.avatar[this.data.class].size;
	this.$(".djentCanvas").attr({
		width: size[0],
		height: size[1]
	}).jdenticon(this.data.profile.sassyHash);
});

Template.avatar.helpers({
	hasAvatars: function () {
		return _.has(this.profile, "avatars");
	},
	md5: function () {
		return (this.profile.avatars[this.class] || this.profile.avatars.fullsize).md5;
	}
});
