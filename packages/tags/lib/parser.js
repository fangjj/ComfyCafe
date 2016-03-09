sampleTagStr = "nia-teppelin: young, short multicolored hair, cat ears;"
	+ "yoko-littner: flame bikini, pink stockings, long red hair, without gun";

function parseLonely(parsed, kv) {
	var tokens = kv[0].split(/\s+/);
	if (tokens.length === 1) {
		parsed.subjects[kv[0]] = {};
	} else if (_.contains(["not", "without"], tokens[0])) {
		parsed.without[tokens[1]] = {};
	}
}

function parseDescriptors(parsed, kv) {
	var label;
	var withoutMode = false;
	var topTokens = kv[0].split(/\s+/);
	if (topTokens.length === 1) {
		label = kv[0];
	} else if (_.contains(["not", "without"], topTokens[0])) {
		label = topTokens[1];
		withoutMode = true;
	}

	var sInner = {}, wInner = {}, nots = {};

	var descriptors = kv[1].split(/\s*,\s*/);

	for (di in descriptors) {
		var tokens = descriptors[di].split(/\s+/);
		var rootNoun = tokens.pop();

		var notIndex = tokens.indexOf("not");
		while (notIndex > -1) {
			if (! withoutMode) {
				if (! _.has(wInner, rootNoun)) {
					wInner[rootNoun] = [tokens[notIndex+1]];
				} else {
					wInner[rootNoun].push(tokens[notIndex+1]);
				}
				tokens.splice(notIndex, notIndex+1);
				notIndex = tokens.indexOf("not");
			} else {
				tokens.splice(notIndex);
			}
		}

		var target;
		if (tokens[0] !== "without") {
			target = sInner;
		} else {
			if (! withoutMode) {
				target = wInner;
			} else {
				target = sInner;
			}
			tokens.shift();
		}

		target[rootNoun] = tokens;
	}

	if (! _.isEmpty(sInner)) {
		if (! withoutMode) {
			parsed.subjects[label] = sInner;
		} else {
			parsed.without[label] = sInner;
		}
	}
	if (! _.isEmpty(wInner)) {
		parsed.without[label] = wInner;
	}
}

parseTagStr = function (tagStr) {
	var parsed = {
		authors: [],
		notAuthors: [],
		subjects: {},
		without: {}
	};

	var toplevel = tagStr.split(/\s*;\s*/);

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

		var kv = topToken.split(/\s*:\s*/);

		if (kv.length === 1) {
			parseLonely(parsed, kv);
		} else {
			parseDescriptors(parsed, kv);
		}
	}

	return parsed;
};
