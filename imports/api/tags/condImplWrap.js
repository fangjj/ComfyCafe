import _ from "lodash";

import { tagSubjectTokenizer } from "/imports/api/tags/tokenizer";

function condImplWrap(condImpl) {
  const formatted = {};
  _.each(condImpl, (impl, cond) => {
    formatted[_.uniqueId()] = [cond, tagSubjectTokenizer(impl.text)[1]];
  });
  return formatted;
}

export default condImplWrap;
