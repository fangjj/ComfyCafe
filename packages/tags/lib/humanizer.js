/*
While the output of parseTagStr is designed querying, humanizeTags is designed
for easy consumption by views, humans, etc.
*/

humanizeTags = function (tags) {
	var indices = {
		nouns: {},
		filters: {}
	};
	var humanized = {
		nouns: [],
		filters: []
	};

	var inner = function (type, noun) {
		var addRoot = function (rootNoun) {
			var index = humanized[type].push({
				name: rootNoun,
				type: "generic",
				adjectives: _.map(tags.nouns[rootNoun].root, function (adj) {
					return {
						name: adj
					};
				}),
				descriptors: []
			});
			indices[type][rootNoun] = index - 1;
		};

		var rel = tags[type][noun];

		if (_.isEmpty(rel.parents)) {
			// Is purely a root noun.
			if (! _.has(indices[type], noun)) {
				addRoot(noun);
			}
		} else {
			// Is a child noun, though could additionally be a root noun.
			for (var parent in rel.parents) {
				if (! _.has(indices[type], parent)) {
					addRoot(parent);
				}
				humanized[type][indices[type][parent]].descriptors.push({
					name: noun,
					type: "generic",
					adjectives: _.map(rel.parents[parent], function (adj) {
						return {
							name: adj
						};
					}),
				});
			}

			// Add as root noun if applicable.
			if (! _.isEmpty(rel.root)) {
				addRoot(noun);
			}
		}
	};

	for (var noun in tags.nouns) {
		inner("nouns", noun);
	}

	for (var noun in tags.filters) {
		inner("filters", noun);
	}

	if (_.has(tags, "authors")) {
		humanized.authors = tags.authors;
	}

	if (_.has(tags, "filteredAuthors")) {
		humanized.filteredAuthors = tags.filteredAuthors;
	}

	return humanized;
};

humanizeTagStr = function (tagStr) {
	return humanizeTags(parseTagStr(tagStr));
};
