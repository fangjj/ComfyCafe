Template.avatar.helpers({
	hasAvatar: function () {
		return _.has(this.profile, "avatar");
	},
	md5: function () {
		var sizeKey = {
			"topBar": "topBar"
		}[this.class];

		if (! sizeKey) {
			return media.findOne(
				{ _id: this.profile.avatar }
			).md5;
		} else {
			return media.findOne(
				{
					"metadata.thumbOf": this.profile.avatar,
					"metadata.sizeKey": sizeKey
				}
			).md5;
		}
	}
});
