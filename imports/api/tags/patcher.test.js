import _ from "lodash";
import { chai } from "meteor/practicalmeteor:chai";

import tagParser from "./parser";
import tagPatcher from "./patcher";

describe("tag patcher", function () {
  it("correctly preserves adj order", function () {
    const a = tagParser("x: red hair");
    const b = tagParser("x: long red hair");
    const c = tagParser("x: red hair");
    const d = "x: long red hair";

    const patched = tagPatcher(a, b, c);

    chai.assert.equal(patched.text, d);
  });
});
