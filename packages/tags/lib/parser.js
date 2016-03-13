tagStrSample = "nia-teppelin: young, short multicolored hair, cat ears;"
	+ "yoko-littner: flame bikini, pink stockings, long red hair, without gun";

function parseLonely(parsed, kv) {
	var tokens = _.compact(kv[0].split(/\s+/));
	if (tokens.length === 1) {
		parsed.subjects[kv[0]] = {};
		parsed.subjectsFlat.push(kv[0]);
		parsed.allTags.push(kv[0]);
	} else if (_.contains(["not", "without"], tokens[0])) {
		parsed.without[tokens[1]] = {};
		parsed.withoutFlat.push(tokens[1]);
		parsed.allTags.push(tokens[1]);
	}
}

function parseDescriptors(parsed, kv) {
	var label;
	var withoutMode = false;
	var topTokens = _.compact(kv[0].split(/\s+/));
	if (topTokens.length === 1) {
		label = kv[0];
	} else if (_.contains(["not", "without"], topTokens[0])) {
		label = topTokens[1];
		withoutMode = true;
	}

	var sInner = {}, wInner = {};

	var descriptors = _.compact(kv[1].split(/\s*,\s*/));

	for (di in descriptors) {
		var tokens = _.compact(descriptors[di].split(/\s+/));
		var descNoun = tokens.pop();

		var notIndex = tokens.indexOf("not");
		while (notIndex > -1) {
			if (! withoutMode) {
				if (! _.has(wInner, descNoun)) {
					wInner[descNoun] = [tokens[notIndex+1]];
				} else {
					wInner[descNoun].push(tokens[notIndex+1]);
				}

				var revInner;
				if (! _.has(parsed.withoutReverse, descNoun)) {
					revInner = {};
					parsed.withoutReverse[descNoun] = revInner;
				} else {
					revInner = parsed.withoutReverse[descNoun];
				}

				if (! _.has(parsed.withoutReverse[descNoun], label)) {
					revInner[label] = [tokens[notIndex+1]];
				} else {
					revInner[label].push(tokens[notIndex+1]);
				}

				parsed.withoutFlat.push(descNoun);

				tokens.splice(notIndex, notIndex+2);
				notIndex = tokens.indexOf("not");
			} else {
				tokens.splice(notIndex);
			}
		}

		var useSubject;
		if (tokens[0] !== "without") {
			useSubject = true;
		} else {
			if (! withoutMode) {
				useSubject = false;
			} else {
				useSubject = true;
			}
			tokens.shift();
		}

		var target, targetRev, targetFlat, targetFlatAdj;
		if (useSubject) {
			target = sInner;
			targetRev = parsed.subjectsReverse;
			targetFlat = parsed.subjectsFlat;
			targetFlatAdj = parsed.subjectsFlatAdjectives;
		} else {
			target = wInner;
			targetRev = parsed.withoutReverse;
			targetFlat = parsed.withoutFlat;
			targetFlatAdj = parsed.withoutFlatAdjectives;
		}

		target[descNoun] = tokens;

		var revInner = {};
		revInner[label] = tokens;
		targetRev[descNoun] = revInner;

		if (! targetFlatAdj[descNoun]) {
			targetFlatAdj[descNoun] = tokens;
		} else {
			targetFlatAdj[descNoun].push.apply(targetFlatAdj[descNoun], tokens);
		}

		targetFlat.push(descNoun);

		parsed.allTags.push(descNoun);
		parsed.allTags.push.apply(parsed.allTags, tokens);
	}

	if (! _.isEmpty(sInner)) {
		if (! withoutMode) {
			parsed.subjects[label] = sInner;
			parsed.subjectsFlat.push(label);
		} else {
			parsed.without[label] = sInner;
			parsed.withoutFlat.push(label);
		}
	}
	if (! _.isEmpty(wInner)) {
		parsed.without[label] = wInner;
		parsed.withoutFlat.push(label);
	}

	parsed.allTags.push(label);
}

tagParser = function (tagStr) {
	tagStr = tagStr.trim();

	var parsed = {
		authors: [],
		notAuthors: [],
		subjects: {},
		subjectsReverse: {},
		subjectsFlat: [],
		subjectsFlatAdjectives: {},
		without: {},
		withoutReverse: {},
		withoutFlat: [],
		withoutFlatAdjectives: {},
		allTags: [],
		meta: {},
		text: tagStr
	};

	var toplevel = _.compact(tagStr.split(/\s*;\s*/));

	for (var ti in toplevel) {
		var topToken = toplevel[ti];

		if (topToken.substr(0, 3) === "by ") {
			parsed.authors.push(topToken.substr(3).trim());
			continue;
		}

		if (topToken.substr(0, 7) === "not by ") {
			parsed.notAuthors.push(topToken.substr(7).trim());
			continue;
		}

		if (topToken.substr(0, 3) === "id ") {
			parsed.meta.id = topToken.substr(3).trim();
			continue;
		}

		if (topToken.substr(0, 5) === "name ") {
			parsed.meta.name = topToken.substr(5).trim();
			continue;
		}

		var kv = _.compact(topToken.split(/\s*:\s*/));

		if (kv.length === 1) {
			parseLonely(parsed, kv);
		} else {
			parseDescriptors(parsed, kv);
		}
	}

	parsed.subjectsFlat = _.uniq(parsed.subjectsFlat);
	parsed.withoutFlat = _.uniq(parsed.withoutFlat);
	parsed.allTags = _.uniq(parsed.allTags);

	return parsed;
};
