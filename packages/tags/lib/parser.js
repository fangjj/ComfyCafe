sampleTagStr = "nia-teppelin: young, short multicolored hair, cat ears;"
	+ "yoko-littner: flame bikini, pink stockings, long red hair, without gun";

newParseTagStr = function (tagStr) {
	var parsed = {
		authors: [],
		toplevel: [],
		subjects: {},
	};

	var toplevel = tagStr.split(/\s*;\s*/);

	for (var ti in toplevel) {
		var topToken = toplevel[ti];

		if (topToken.substr(0, 3) === "by ") {
			parsed.authors.push(topToken.substr(3));
			continue;
		}

		var kv = topToken.split(/\s*:\s*/);

		if (kv.length === 1) {
			parsed.toplevel.push(kv[0]);
		} else {
			var inner = {};
			parsed.subjects[kv[0]] = inner; // This reference is intentional!

			var descriptors = kv[1].split(/\s*,\s*/);

			for (di in descriptors) {
				var tokens = descriptors[di].split(/\s+/);
				inner[tokens.splice(-1)] = tokens;
			}
		}
	}

	return parsed;
};

parseTagStr = function (tagStr, options) {
  if (! options) {
    options = {};
  }

	var parsed = {
		nouns: {},
		filters: {}
	};

	if (! tagStr) {
		return parsed;
	}

	if (options.reformat) {
		parsed.text = "";
	}

	operatorRe = new RegExp("( with | without )+");
	conjunctionRe = new RegExp("(, and |,and | and |, |,)+");

	var rawClauses = tagStr.split(";");
	for (var clauseIndex in rawClauses) {
		var clause = rawClauses[clauseIndex];

		var clauses = clause.split(operatorRe);

		var rootDescriptor = clauses[0].trim().split(" ");
		if (! rootDescriptor.length) {
			// This is an empty clause, so skip it.
			continue;
		}

		var rootNoun = slice(rootDescriptor, -1)[0];

		var rootAdjs = [];
		if (clauses[0].length > 1) {
			rootAdjs = slice(rootDescriptor, undefined, -1);
		}

		if (rootAdjs.length && slice(rootAdjs, -1)[0] === "by") {
			// This is an author meta attribute.

			if (rootAdjs[0] === "not") {
				if (! parsed.filteredAuthors) {
					parsed.filteredAuthors = [];
				}
				parsed.filteredAuthors.push(rootNoun);

				if (options.reformat) {
					parsed.text += "; not by " + rootNoun;
				}
			} else {
				if (! parsed.authors) {
					parsed.authors = [];
				}
				parsed.authors.push(rootNoun);

				if (options.reformat) {
					parsed.text += "; by " + rootNoun;
				}
			}

			continue;
		}

		var rootTarget = "nouns";
		if (rootAdjs.length && rootAdjs[0] === "not") {
			rootTarget = "filters";
			rootAdjs = slice(rootAdjs, 1);
		}

		if (! (rootNoun in parsed[rootTarget])) {
			parsed[rootTarget][rootNoun] = getClauseProto();
		}
		parsed[rootTarget][rootNoun].root = rootAdjs;

		if (options.reformat) {
			var adjs = "";
			if (rootAdjs.length) {
				adjs = rootAdjs.join(" ") + " ";
			}

			if (rootTarget === "filters") {
				adjs = "not " + adjs;
			}

			parsed.text += "; " + adjs + rootNoun;
		}

		var enumeratedClauses = [];
		for (var clauseIndex in clauses) {
			enumeratedClauses.push([parseInt(clauseIndex), clauses[clauseIndex].trim()]);
		}

		var workingClauses = slice(enumeratedClauses, 1, undefined, 2);
		for (var clausePairIndex in workingClauses) {
			var clauseIndex = workingClauses[clausePairIndex][0];
			var operator = workingClauses[clausePairIndex][1];

			var descriptors = clauses[clauseIndex+1].split(conjunctionRe);

			var rootSubDescriptor = descriptors[0].split(" ");
			if (! rootSubDescriptor.length) {
				// This is an empty descriptor, so skip it.
				continue;
			}

			var noun = slice(rootSubDescriptor, -1);
			var adjectives = slice(rootSubDescriptor, undefined, -1);

			if (options.reformat) {
				var adjs = "";
				if (adjectives.length) {
					adjs = adjectives.join(" ") + " ";
				}

				parsed.text += (" " + operator + " " + adjs + noun);
			}

			var target = "nouns";
			if (operator === "without" || rootTarget === "filters") {
				target = "filters";
			}

			if (! (noun in parsed[target])) {
				parsed[target][noun] = getClauseProto();

				/*
				Array to contain all of the noun's parents.
				This is used to efficiently make Root->Child queries.
				*/
				parsed[target][noun].flatAdjectives = [];
			}
			parsed[target][noun].parents[rootNoun] = adjectives;
			parsed[target][noun].flatAdjectives = _.union(
				parsed[target][noun].flatAdjectives, adjectives
			);

			var enumeratedDescriptors = [];
			for (var descIndex in descriptors) {
				enumeratedDescriptors.push([parseInt(descIndex), descriptors[descIndex].trim()]);
			}

			var workingDescriptors = slice(enumeratedDescriptors, 1, undefined, 2);
			for (var descPairIndex in workingDescriptors) {
				var descIndex = workingDescriptors[descPairIndex][0];
				// Conjunctions are meaningless in the current spec ;_;
				var conjunction = workingDescriptors[descPairIndex][1];

				var subDescriptor = descriptors[descIndex+1].split(" ");
				if (! subDescriptor.length) {
					// This is an empty descriptor, so skip it.
					continue;
				}

				var noun = slice(subDescriptor, -1);
				var adjectives = slice(subDescriptor, undefined, -1);

				if (options.reformat) {
					var conj = ", ";
					if (descIndex + 2 === descriptors.length) {
						if (descIndex === 1) {
							conj = " and ";
						} else {
							conj = ", and "
						}
					}

					var adjs = "";
					if (adjectives.length) {
						adjs = adjectives.join(" ") + " ";
					}

					parsed.text += (conj + adjs + noun);
				}

				if (! (noun in parsed[target])) {
					parsed[target][noun] = getClauseProto();

					/*
					Array to contain all of the noun's parents.
					This is used to efficiently make Root->Child queries.
					*/
					parsed[target][noun].flatAdjectives = [];
				}
				parsed[target][noun].parents[rootNoun] = adjectives;
				parsed[target][noun].flatAdjectives = _.union(
					parsed[target][noun].flatAdjectives, adjectives
				);
			}
		}
	}

	if (options.reformat) {
		parsed.text = slice(parsed.text, 2, undefined);
	}

	return parsed;
};

getDefaultTagObj = function () {
	// Without any arguments, this just returns the default tag object.
	return parseTagStr();
};
