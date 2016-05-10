import _ from "lodash";

import Filters from "/imports/api/filters/collection";
import tagParser from "/imports/api/tags/parser";
import { tagFullResolver } from "/imports/api/tags/resolver";
import createSlugCycler from "/imports/api/common/createSlugCycler";

const match = {
	name: String,
	spoilers: String,
	hides: String,
	default: Boolean
};

const slugCycle = createSlugCycler(Filters);

Meteor.methods({
	addFilter(data, global=false) {
		check(data, match);

		if (! Meteor.userId()) {
			throw new Meteor.Error("not-logged-in");
		}

    if (global) {
      if (! Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)) {
        throw new Meteor.Error("not-authorized");
      }
    } else {
      data.owner = {
        _id: Meteor.userId(),
        username: Meteor.user().username,
        normalizedUsername: Meteor.user().normalizedUsername,
        profile: Meteor.user().profile
      };
    }

    data.slug = slugCycle(null, data.name);

		data.spoilers = tagParser(data.spoilers, { reformat: true });
    data.hides = tagParser(data.hides, { reformat: true });
		if (Meteor.isServer) {
			data.spoilers = tagFullResolver(data.spoilers);
			data.hides = tagFullResolver(data.hides);
		}

    const filterId = Filters.insert(_.defaults({
      createdAt: new Date(),
			updatedAt: new Date()
    }, data));

    if (global) {
      return filterId;
    } else {
      return data.slug;
    }
	},
	updateFilter(filterId, data) {
		check(filterId, String);
		check(data, match);

		const filter = Filters.findOne(filterId);

    const isGlobal = ! _.has(filter, "owner");
    const isAdmin = Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP);
		if (isGlobal && ! isAdmin 
			|| !isGlobal && ! isOwner(filter)
		) {
			throw new Meteor.Error("not-authorized");
		}

    data.spoilers = tagParser(data.spoilers, { reformat: true });
    data.hides = tagParser(data.hides, { reformat: true });
		if (Meteor.isServer) {
			data.spoilers = tagFullResolver(data.spoilers);
			data.hides = tagFullResolver(data.hides);
		}

    Filters.update(
      { _id: filterId },
      { $set: _.defaults({
        updatedAt: new Date()
      }, data) }
    );

    if (Meteor.isServer) {
      const slug = slugCycle(filterId, data.name);
      Filters.update(
        { _id: filterId },
        { $set: { slug } }
      );
      return slug;
    }
	},
	deleteFilter(filterId) {
		check(filterId, String);

		const filter = Filters.findOne(filterId);

		if (! isOwner(filter)) {
			throw new Meteor.Error("not-authorized");
		}

		Filters.remove(filterId);
	}
});
