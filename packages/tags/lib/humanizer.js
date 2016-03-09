/*
While the output of tagParser is designed for querying, tagHumanizer is designed
for easy consumption by views, humans, etc.
*/

tagHumanizer = function (tags) {
	var humanized = {
		nouns: [],
		filters: []
	};

	_.each(tags.subjects, function (descriptors, rootNoun) {
		humanized.nouns.push({
			name: rootNoun,
			type: "generic",
			descriptors: _.map(descriptors, function (adjs, noun) {
				return {
					name: noun,
					type: "generic",
					adjectives: _.map(adjs, function (adj) {
						return {
							name: adj
						}
					})
				};
			})
		});
	});

	return humanized;
};
