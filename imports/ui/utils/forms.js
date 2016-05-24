import _ from "lodash";

function initialStateBuilder(obj, defaultState) {
  return _.reduce(
    defaultState,
    (result, defaultValue, key) => {
      if (_.isPlainObject(defaultValue) && ! _.isEmpty(defaultValue)) {
        result[key] = {};
        _.each(defaultValue, (v, k) => {
          result[key][k] = _.get(obj, key + "." + k, v);
        });
      } else if (_.isFunction(defaultValue)) {
        result[key] = _.get(obj, key, defaultValue());
      } else {
        result[key] = _.get(obj, key, defaultValue);
      }
      return result;
    },
    {}
  );
}

function dataBuilder(state, defaultState) {
  return _.pick(state, _.keys(defaultState));
}

export {
  initialStateBuilder,
  dataBuilder
};
