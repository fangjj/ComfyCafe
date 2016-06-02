import _ from "lodash";
import { chai } from "meteor/practicalmeteor:chai";

import tagParser from "./parser";

const tagStrSample = "nia-teppelin: young, short multicolored hair, cat ears; "
	+ "yoko-littner: flame bikini, pink stockings, long red hair, without gun";
const tagDocSample = {
  authors: [],
  notAuthors: [],
  origins: [],
  notOrigins: [],
  safeties: [],
  subjects: {
    "nia-teppelin": {
      "young": [],
      "hair": [ "short", "multicolored" ],
      "ears": [ "cat" ]
    },
    "yoko-littner": {
      "bikini": [ "flame" ],
      "stockings": [ "pink" ],
      "hair": [ "long", "red" ]
    }
  },
  subjectsReverse: {
    "young": {
      "nia-teppelin": [],
    },
    "hair": {
      "nia-teppelin": [ "short", "multicolored" ],
      "yoko-littner": [ "long", "red" ]
    },
    "ears": {
      "nia-teppelin": [ "cat" ]
    },
    "bikini": {
      "yoko-littner": [ "flame" ],
    },
    "stockings": {
      "yoko-littner": [ "pink" ],
    }
  },
  subjectsFlat: [
    "young",
    "hair",
    "ears",
    "nia-teppelin",
    "bikini",
    "stockings",
    "yoko-littner"
  ],
  subjectsFlatAdjectives: {
    "young": [],
    "hair": [ "short", "multicolored", "long", "red" ],
    "ears": [ "cat" ],
    "bikini": [ "flame" ],
    "stockings": [ "pink" ]
  },
  without: {
    "yoko-littner": {
      "gun": []
    }
  },
  withoutReverse: {
    "gun": {
      "yoko-littner": []
    }
  },
  withoutFlat: [
    "gun",
    "yoko-littner"
  ],
  withoutFlatAdjectives: {
    "gun": []
  },
  allTags: [
    "young",
    "hair",
    "short",
    "multicolored",
    "ears",
    "cat",
    "nia-teppelin",
    "bikini",
    "flame",
    "stockings",
    "pink",
    "long",
    "red",
    "gun",
    "yoko-littner"
  ],
  meta: {},
  text: tagStrSample
};

describe("tag parser", function () {
  it("correctly parses sample string", function () {
    const parsed = tagParser(tagStrSample);
    //console.log(JSON.stringify(parsed, null, 2));
    // Ideally, we should assert each chunk separately.
    chai.assert.deepEqual(parsed, tagDocSample);
  });

  it("correctly parses even with gnarly whitespace", function () {
    const str = "nia-teppelin:    young,short      multicolored hair,    cat   ears      ;  "
    	+ "yoko-littner      :flame bikini    ,    pink stockings,  long   red hair     ,without gun          ";
    const parsed = tagParser(str);
    const doc = _.clone(tagDocSample);
    doc.text = str.trim();
    chai.assert.deepEqual(parsed, doc);
  });
});
