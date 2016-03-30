import _ from "lodash";

import Posts from "../posts/collection";

var match = {
  name: String,
  type: String,
  definition: String,
  aliases: String,
  origin: String,
  safety: Number,
  extends: String,
  implications: String,
  condImplications: Object
};

function aliasParser(str) {
  return commaSplit(str.trim().toLowerCase());
}

function implicationParser(name, str) {
  return tagParser(name + ":" + str);
}

function extendsParser(str) {
  return commaSplit(str.trim().toLowerCase());
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
    var patched = tagRenamer(oldName, newName, post.tags);
    Posts.update(
      { _id: post._id },
      { $set: {
        tags: patched
      } }
    );
  });

  var tags = Tags.find(
    {
      "implications.allTags": oldName
    }
  ).fetch();

  _.each(tags, function (tag) {
    var patched = tagRenamer(oldName, newName, tag.implications);
    Tags.update(
      { _id: tag._id },
      { $set: {
        implications: patched
      } }
    );
  });

  var doc = {};
  doc["condImplicationLookup." + oldName] = { $exists: true };
  var condTags = Tags.find(doc).fetch();

  _.each(condTags, function (tag) {
    _.each(tag.condImplicationLookup[oldName], function (cond) {
      var patched = tagRenamer(oldName, newName, tag.condImplications[cond]);
      var upDoc = { $set: {}, $unset: {} };
      upDoc.$set["condImplications." + cond] = patched;
      upDoc.$set["condImplicationLookup." + newName] = tag.condImplicationLookup[oldName];
      upDoc.$unset["condImplicationLookup." + oldName] = "hotdog";
      Tags.update(
        { _id: tag._id },
        upDoc
      );
    });
  });

  var condOnlyDoc = {};
  condOnlyDoc["condImplications." + oldName] = { $exists: true };
  var condOnlyTags = Tags.find(condOnlyDoc).fetch();

  _.each(condOnlyTags, function (tag) {
    var upDoc = { $set: {}, $unset: {} };
    upDoc.$set["condImplications." + newName] = tag.condImplications[oldName];
    upDoc.$unset["condImplications." + oldName] = "hotdog";

    _.each(tag.condImplications[oldName].allTags, function (implTag) {
      var vanilla = tag.condImplicationLookup[implTag];
      var groomed = _.without(vanilla, oldName);
      groomed.push(newName);
      upDoc.$set["condImplicationLookup." + implTag] = groomed;
    });

    Tags.update(
      { _id: tag._id },
      upDoc
    );
  });
}

function syncOrigin(name, originOld, originNew) {
  var doc = {};
  doc["tags.subjects." + name] = { $exists: true };
  var posts = Posts.find(doc).fetch();

  _.each(posts, function (post) {
    var done = false;
    if (originOld) {
      var idx = post.tags.origins.indexOf(originOld);
      if (idx !== -1) {
        post.tags.origins[idx] = originNew;
        done = true;
      }
    } else if (! done) {
      post.tags.origins.push(originNew);
    }
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

function condImplLookupGen(condImplications) {
  var lookup = {};
  _.each(condImplications, function (impl, cond) {
    _.each(impl.allTags, function (tag) {
      if (! lookup[tag]) {
        lookup[tag] = [cond];
      } else {
        lookup[tag].push(cond);
      }
    });
  });
  return lookup;
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

    var aliases = aliasParser(data.aliases);
    _.each(aliases, function (alias) {
      if (Tags.findOne({ $or: [
        { name: alias },
        { aliases: alias }
      ] })) {
        throw new Meteor.Error("tag-alias-exists");
      }
      syncName(alias, name);
    });

    var origin = data.origin.trim();
    syncOrigin(name, undefined, origin);

    var extendees = extendsParser(data.extends);

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
        aliases: aliases,
        aliasStr: data.aliases,
        origin: origin,
        safety: data.safety,
        extends: extendees,
        implications: implicationParser(name, data.implications),
        implicationStr: data.implications,
        condImplications: condImplications,
        condImplicationLookup: condImplLookupGen(condImplications)
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

    var aliases = aliasParser(data.aliases);
    _.each(_.difference(aliases, tag.aliases), function (alias) {
      if (Tags.findOne(
        {
          _id: { $ne: tagId },
          $or: [
            { name: alias },
            { aliases: alias }
          ]
        }
      )) {
        throw new Meteor.Error("tag-alias-exists");
      }
      syncName(alias, name);
    });

    var origin = data.origin.trim();
    if (origin !== tag.origin) {
      syncOrigin(name, tag.origin, origin);
    }

    var extendees = extendsParser(data.extends);

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
        aliases: aliases,
        aliasStr: data.aliases,
        origin: origin,
        safety: data.safety,
        extends: extendees,
        implications: implications,
        implicationStr: data.implications,
        condImplications: condImplications,
        condImplicationLookup: condImplLookupGen(condImplications)
      } }
    );
  }
});
