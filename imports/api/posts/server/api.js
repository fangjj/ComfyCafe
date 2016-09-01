import _ from "lodash";

import Posts from "../collection";
import { postsPerPage } from "../constants";
import privacyWrap from "/imports/api/common/privacyWrap";
import tagQuery from "/imports/api/tags/query";

function queryBuilder(doc, tagStr) {
	if (tagStr) {
		const parsed = tagQuery(tagStr);
		_.each(parsed, (value, key) => {
			if (_.has(doc, key)) {
				if (_.includes(["$and", "$or", "$nor"], key)) {
					doc[key].push.apply(doc[key], value);
				} else {
					console.error("PANIC: key " + key + " already present in doc.");
				}
			} else {
				doc[key] = value;
			}
		});
	}

	return doc;
}

function options(page) {
	return {
		sort: { createdAt: -1, name: 1 },
		limit: (page + 1) * postsPerPage
	};
}

Meteor.publish("q", function (tagStr, p=0) {
  const page = parseInt(p);
	check(tagStr, String);
	check(page, Number);
	const innerQuery = tagQuery(tagStr);
	const doc = privacyWrap(innerQuery);
	const query = queryBuilder(doc, tagStr);
	return Posts.find(query, options(page));
}, {
	url: "api/q/:0/:1"
});
