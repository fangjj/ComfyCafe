var match = {
  name: String,
  type: String,
  definition: String,
  aliases: String,
  origin: String,
  implications: String,
  condImplications: Object
};

function aliasParser(str) {
  return str.trim().toLowerCase().split(/\s*,\s*/);
}

function implicationParser(name, str) {
  return tagParser(name + ":" + str);
}

function condImplicationParser(name, obj) {
  var formatted = {};
  _.each(obj, function (arr, key) {
    formatted[arr[0]] = implicationParser(name, arr[1]);
  });
  return formatted;
}

function syncName(oldName, newName) {
  var doc = {};
  doc["tags.subjectsFlat." + name] = { $exists: true };
  var posts = Posts.find(doc).fetch();

  _.each(posts, function (post) {
    var tags = tagRenamer(uOld, uNew, post.tags);
    Posts.update(
      { _id: post._id },
      { $set: {
        tags: tags
      } }
    );
  });
}

function syncImplications(name, uOld, uNew) {
  var doc = {};
  doc["tags.subjects." + name] = { $exists: true };
  var posts = Posts.find(doc).fetch();

  _.each(posts, function (post) {
    var tags = tagPatcherSyncImpl(uOld, uNew, post.tags);
    Posts.update(
      { _id: post._id },
      { $set: {
        tags: tags
      } }
    );
  });
}

function syncCondImplications(name, impl, condImplOld, condImplNew) {
  var doc = {};
  doc["tags.subjects." + name] = { $exists: true };
  var posts = Posts.find(doc).fetch();

  _.each(posts, function (post) {
    var tags = tagPatcherSyncCondImpl(uOld, uNew, post.tags);
    Posts.update(
      { _id: post._id },
      { $set: {
        tags: tags
      } }
    );
  });
}

Meteor.methods({
	addTag: function (data) {
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

    // Keep tag name legal.
    var name = data.name.trim().toLowerCase().replace(" ", "-");

    // Name must be unique!
    if (Tags.findOne({ name: name })) {
      throw new Meteor.Error("tag-name-exists");
    }

    var condImplications = condImplicationParser(name, data.condImplications);

    Tags.insert(
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        name: name,
        type: data.type,
        definition: data.definition,
        aliases: aliasParser(data.aliases),
        aliasStr: data.aliases,
        origin: data.origin,
        implications: implicationParser(name, data.implications),
        implicationStr: data.implications,
        condImplications: condImplications
      }
    );
  },
	updateTag: function (tagId, data) {
    check(tagId, String);
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

    // Keep tag name legal.
    var name = data.name.toLowerCase().replace(" ", "-");

    // Name must be unique!
    if (Tags.findOne(
      {
        _id: { $ne: tagId },
        name: name
      }
    )) {
      throw new Meteor.Error("tag-name-exists");
    }

    var tag = Tags.findOne({ _id: tagId });

    // If the name is changed, stuff has to happen...
    if (name !== tag.name) {
      syncName(tag.name, name);
    }

    var implications = implicationParser(name, data.implications);
    var diff = tagDiffer(tag.implications, implications);

    syncImplications(name, tag.implications, implications);

    // When we need to sync this, we'll just diff over vanilla.
    var condImplications = condImplicationParser(name, data.condImplications);

    Tags.update(
      { _id: tagId },
      { $set: {
        updatedAt: new Date(),
        name: name,
        type: data.type,
        definition: data.definition,
        aliases: aliasParser(data.aliases),
        aliasStr: data.aliases,
        origin: data.origin,
        implications: implications,
        implicationStr: data.implications,
        condImplications: condImplications
      } }
    );
  }
});
