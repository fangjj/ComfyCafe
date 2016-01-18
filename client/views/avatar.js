Template.avatar.helpers({
	hasAvatar: function () {
		return _.has(this.profile, "avatar");
	},
	md5: function () {
		// While we're presently using fullsize for center, that will change in the future...
		if (this.class === "center") {
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
