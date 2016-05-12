import _ from "lodash";

import { tagStringify } from "./stringify";
import {
	tagTopLevelTokenizer,
	tagSubjectTokenizer,
	tagDescriptorTokenizer
} from "./tokenizer";
import missingInts from "/imports/api/common/missingInts";

const tagStrSample = "nia-teppelin: young, short multicolored hair, cat ears;"
	+ "yoko-littner: flame bikini, pink stockings, long red hair, without gun";

function parseLonely(parsed, kv) {
	var tokens = whiteSplit(kv[0]);
	var noun = tokens.pop();

	if (_.includes(["not", "without"], tokens[0])) {
		tokens.shift();
		target = parsed.without;
		targetFlat = parsed.withoutFlat;
	} else {
		target = parsed.subjects;
		targetFlat = parsed.subjectsFlat;
	}

	var doc = {};
	if (tokens.length) {
		doc = {_pre: tokens};
	}

	target[noun] = doc;
	targetFlat.push(noun);
	parsed.allTags.push(noun);
	if (tokens.length) {
		parsed.allTags.push.apply(parsed.allTags, tokens);
	}
}

function parseDescriptors(parsed, kv) {
	var label;
	var withoutMode = false;
	var topTokens = whiteSplit(kv[0]);
	if (topTokens.length === 1) {
		label = kv[0];
	} else if (_.includes(["not", "without"], topTokens[0])) {
		label = topTokens[1];
		withoutMode = true;
	}

	var sInner = {}, wInner = {};

	var descriptors = tagDescriptorTokenizer(kv[1]);

	_.each(descriptors, function (descriptor, di) {
		var tokens = whiteSplit(descriptor);
		var descNoun = tokens.pop();

		var notIndex = tokens.indexOf("not");
		while (notIndex > -1) {
			if (! withoutMode) {
				if (! _.has(wInner, descNoun)) {
					wInner[descNoun] = [tokens[notIndex+1]];
				} else {
					wInner[descNoun].push(tokens[notIndex+1]);
				}

				var notRevInner = {};
				if (! _.has(parsed.withoutReverse, descNoun)) {
					parsed.withoutReverse[descNoun] = notRevInner;
				} else {
					notRevInner = parsed.withoutReverse[descNoun];
				}

				if (! _.has(notRevInner, label)) {
					notRevInner[label] = [tokens[notIndex+1]];
				} else {
					notRevInner[label].push(tokens[notIndex+1]);
				}
				parsed.allTags.push(tokens[notIndex+1]);

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
		if (! _.has(targetRev, descNoun)) {
			targetRev[descNoun] = {};
		}
		targetRev[descNoun][label] = tokens;

		if (! targetFlatAdj[descNoun]) {
			targetFlatAdj[descNoun] = _.cloneDeep(tokens);
		} else {
			targetFlatAdj[descNoun].push.apply(targetFlatAdj[descNoun], tokens);
		}

		targetFlat.push(descNoun);

		parsed.allTags.push(descNoun);
		parsed.allTags.push.apply(parsed.allTags, tokens);
	});

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

function tagParser(tagStr, reformat) {
	tagStr = tagStr.trim();

	var parsed = {
		authors: [],
		notAuthors: [],
		origins: [],
		notOrigins: [],
		safeties: [],
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

	var toplevel = tagTopLevelTokenizer(tagStr);

	_.each(toplevel, function (topToken, ti) {
		if (topToken.substr(0, 3) === "by ") {
			parsed.authors.push(topToken.substr(3).trim());
			return;
		}

		if (topToken.substr(0, 7) === "not by ") {
			parsed.notAuthors.push(topToken.substr(7).trim());
			return;
		}

		if (topToken.substr(0, 5) === "from ") {
			parsed.origins.push(topToken.substr(5).trim());
			return;
		}

		if (topToken.substr(0, 9) === "not from ") {
			parsed.notOrigins.push(topToken.substr(9).trim());
			return;
		}

		if (topToken.substr(0, 3) === "id ") {
			parsed.meta.id = topToken.substr(3).trim();
			return;
		}

		if (topToken.substr(0, 5) === "name ") {
			parsed.meta.name = topToken.substr(5).trim();
			return;
		}

		if (topToken.substr(0, 7) === "safety ") {
			parsed.safeties = _.filter(topToken.substr(7).trim().split("-").map((safety) => {
				const n = parseInt(safety);
				if (_.isNaN(n)) {
					if (_.includes(["s", "safe"], safety.toLowerCase())) {
						return 0;
					}
					if (_.includes(["r", "riqué", "risque"], safety.toLowerCase())) {
						return 1;
					}
					if (_.includes(["n", "nudity"], safety.toLowerCase())) {
						return 2;
					}
					if (_.includes(["e", "explicit"], safety.toLowerCase())) {
						return 3;
					}
				} else {
					return n;
				}
			}), (n) => {
				return typeof n !== "undefined";
			});

			parsed.safeties = missingInts(parsed.safeties);

			return;
		}

		var kv = tagSubjectTokenizer(topToken.toLowerCase());

		if (kv.length === 1) {
			parseLonely(parsed, kv);
		} else {
			parseDescriptors(parsed, kv);
		}
	});

	parsed.authors = _.uniq(parsed.authors);
	parsed.notAuthors = _.uniq(parsed.notAuthors);
	parsed.origins = _.uniq(parsed.origins);
	parsed.notOrigins = _.uniq(parsed.notOrigins);

	parsed.subjectsFlat = _.uniq(parsed.subjectsFlat);
	parsed.withoutFlat = _.uniq(parsed.withoutFlat);
	parsed.allTags = _.uniq(parsed.allTags);

	if (reformat) {
		parsed.text = tagStringify(parsed);
	}

	return parsed;
}

export default tagParser;
export {
	tagStrSample
};
