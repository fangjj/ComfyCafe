import _ from "lodash";

import Filters from "/imports/api/filters/collection";
import tagParser from "/imports/api/tags/parser";
import { tagOrTokenizer } from "/imports/api/tags/tokenizer";
import { tagFullResolver } from "/imports/api/tags/resolver";
import createSlugCycler from "/imports/api/common/createSlugCycler";

const match = {
	name: String,
	spoilers: String,
	hides: String,
	default: Boolean
};

const slugCycle = createSlugCycler(Filters);

function filterParser(data) {
	function parse(v) {
		const parsed = tagParser(v, { reformat: true });
		if (Meteor.isServer) {
			return tagFullResolver(parsed);
		} return parsed;
	}

	function chunk(thing) {
		const chunks = tagOrTokenizer(data[thing]);
		data[thing] = _.map(chunks, (v, k) => parse(v).text).join(" || ");
	}

	chunk("spoilers");
	chunk("hides");
}

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

		filterParser(data);

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

		filterParser(data);

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
			Meteor.users.update(
				{ "defaultFilter._id": filterId },
				{ $set: {
					defaultFilter: Filters.findOne(filterId)
				} }
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
