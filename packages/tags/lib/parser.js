sampleTagStr = "nia-teppelin: young, short multicolored hair, cat ears;"
	+ "yoko-littner: flame bikini, pink stockings, long red hair, without gun";

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
			parsed.authors.push(topToken.substr(3));
			continue;
		}

		if (topToken.substr(0, 7) === "not by ") {
			parsed.notAuthors.push(topToken.substr(7));
			continue;
		}

		var kv = topToken.split(/\s*:\s*/);

		if (kv.length === 1) {
			parsed.subjects[kv[0]] = {};
		} else {
			var sInner = {}, wInner = {};

			var descriptors = kv[1].split(/\s*,\s*/);

			for (di in descriptors) {
				var tokens = descriptors[di].split(/\s+/);

				var target;
				if (tokens[0] !== "without") {
					target = sInner;
				} else {
					target = wInner;
					tokens.shift();
				}

				target[tokens.pop()] = tokens;
			}

			if (! _.isEmpty(sInner)) {
				parsed.subjects[kv[0]] = sInner;
			}
			if (! _.isEmpty(wInner)) {
				parsed.without[kv[0]] = wInner;
			}
		}
	}

	return parsed;
};
