var match = {
  name: String,
  type: String,
  definition: String,
  aliases: String,
  origin: String,
  safety: Number,
  implications: String,
  condImplications: Object
};

function aliasParser(str) {
  return commaSplit(str.trim().toLowerCase());
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
  var posts = Posts.find(
    {
      "tags.allTags": oldName
    }
  ).fetch();

  _.each(posts, function (post) {
    var tags = tagRenamer(oldName, newName, post.tags);
    Posts.update(
      { _id: post._id },
      { $set: {
        tags: tags
      } }
    );
  });
}

function syncOrigin(name, originOld, originNew) {
  var doc = {};
  doc["tags.subjects." + name] = { $exists: true };
  var posts = Posts.find(doc).fetch();

  _.each(posts, function (post) {
    if (originOld && _.has(post.tags.subjects, originOld)) {
      delete post.tags.subjects[originOld];
    }
    post.tags.subjects[originNew] = {};
    var patched = tagRegenerator(post.tags);
    Posts.update(
      { _id: post._id },
      { $set: {
        tags: patched
      } }
    );
  });
}

function syncImplications(name, uOld, uNew) {
  var doc = {};
  doc["tags.subjects." + name] = { $exists: true };
  var posts = Posts.find(doc).fetch();

  _.each(posts, function (post) {
    var patched = tagPatcher(uOld, uNew, post.tags);
    Posts.update(
      { _id: post._id },
      { $set: {
        tags: patched
      } }
    );
  });
}

function syncCondImplications(name, condImplOld, condImplNew) {
  var doc = {};
  doc["tags.subjects." + name] = { $exists: true };
  var posts = Posts.find(doc).fetch();

  _.each(posts, function (post) {
    var patched = post.tags;

    _.each(condImplNew, function (condImpl, cond) {
      if (_.has(patched.subjects[name], cond)) {
        patched = tagPatcher(condImplOld[cond], condImpl, patched);
      }
    });

    Posts.update(
      { _id: post._id },
      { $set: {
        tags: patched
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
    if (Tags.findOne({ $or: [
      { name: name },
      { aliases: name }
    ] })) {
      throw new Meteor.Error("tag-name-exists");
    }

    syncOrigin(name, undefined, data.origin);

    var implications = implicationParser(name, data.implications);
    syncImplications(name, tagParser(name), implications);

    var condImplications = condImplicationParser(name, data.condImplications);
    syncCondImplications(name, tagParser(name), condImplications);

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
        safety: data.safety,
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
        $or: [
          { name: name },
          { aliases: name }
        ]
      }
    )) {
      throw new Meteor.Error("tag-name-exists");
    }

    var tag = Tags.findOne({ _id: tagId });

    // If the name is changed, stuff has to happen...
    if (name !== tag.name) {
      syncName(tag.name, name);
    }

    if (data.origin !== tag.origin) {
      syncOrigin(name, tag.origin, data.origin);
    }

    var implications = implicationParser(name, data.implications);
    syncImplications(name, tag.implications, implications);

    // When we need to sync this, we'll just diff over vanilla.
    // ^ I don't remember what this comment means, so I'm keeping it here.
    var condImplications = condImplicationParser(name, data.condImplications);
    syncCondImplications(name, tag.condImplications, condImplications);

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
        safety: data.safety,
        implications: implications,
        implicationStr: data.implications,
        condImplications: condImplications
      } }
    );
  }
});
