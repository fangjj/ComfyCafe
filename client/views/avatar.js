Template.avatar.helpers({
	hasAvatar: function () {
		return _.has(this.profile, "avatar");
	},
	md5: function () {
		if (this.class === "fullsize") {
			return media.findOne(
				{ _id: this.profile.avatar }
			).md5;
		} else {
			return media.findOne(
				{
					"metadata.thumbOf": this.profile.avatar,
					"metadata.sizeKey": this.class
				}
			).md5;
		}
	}
});
