Template.reactiveAvatar.helpers({
	hasAvatars: function () {
		return Boolean(this.avatars);
	},
	md5: function () {
		return (this.avatars[this.class] || this.avatars.fullsize).md5;
	}
});
