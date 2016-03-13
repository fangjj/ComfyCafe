tagStrSample = "nia-teppelin: young, short multicolored hair, cat ears;"
	+ "yoko-littner: flame bikini, pink stockings, long red hair, without gun";

function parseLonely(parsed, kv) {
	var tokens = _.compact(kv[0].split(/\s+/));
	if (tokens.length === 1) {
		parsed.subjects[kv[0]] = {};
		parsed.subjectsFlat.push(kv[0]);
	} else if (_.contains(["not", "without"], tokens[0])) {
		parsed.without[tokens[1]] = {};
		parsed.withoutFlat.push(tokens[1]);
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
				tokens.splice(notIndex, notIndex+1);
				notIndex = tokens.indexOf("not");
			} else {
				tokens.splice(notIndex);
			}
		}

		var target, targetRev, targetFlat, targetFlatAdj;
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
}

tagParser = function (tagStr) {
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

		var kv = _.compact(topToken.split(/\s*:\s*/));

		if (kv.length === 1) {
			parseLonely(parsed, kv);
		} else {
			parseDescriptors(parsed, kv);
		}
	}

	return parsed;
};
