Meteor.methods({
	addTag: function (data) {
		check(data, {
			name: String,
      definition: String,
      implications: String
		});

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

    // Keep tag name legal.
    var name = data.name.toLower().replace(" ", "-");

    // Name must be unique!
    if (Tags.findOne({ name: name })) {
      throw new Meteor.Error("tag-name-exists");
    }

    Tags.insert(
      {
        name: name,
        definition: data.definition,
        implications: parseTagStr(data.implications)
      }
    );
  }
});
