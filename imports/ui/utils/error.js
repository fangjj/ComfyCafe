import _ from "lodash";

function errorMapper(errorMap, err) {
  const subMap = errorMap[err.error];
  if (subMap) {
    if (_.isFunction(subMap)) {
      subMap();
    } else {
      const func = subMap[err.reason];
      if (func) {
        func();
      } else {
        prettyPrint(err);
      }
    }
  } else {
    prettyPrint(err);
  }
}

export {
  errorMapper
};
