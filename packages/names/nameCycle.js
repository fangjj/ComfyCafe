nameCycle = function (coll, nsfw, callback) {
	var name = generateName({nsfw: nsfw});
	var taken = Boolean(coll.findOne(
		{
			"owner._id": Meteor.userId(),
			name: name
		}
	));
	if (taken) {
		nameCycle(coll, nsfw, callback);
	} else {
		callback(name);
	}
};
