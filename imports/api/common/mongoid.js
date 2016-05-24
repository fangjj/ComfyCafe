import _ from "lodash";

const mongoid = {
  new(id) {
    if (_.isString(id)) {
      return new Mongo.ObjectID(id);
    } return id;
  },

  str(s) {
    if (_.isString(s)) {
      return s;
    } return s._str;
  }
};

export default mongoid;
