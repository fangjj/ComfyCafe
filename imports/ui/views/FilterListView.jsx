export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const FilterListContainer = require("../client/components/Filter/FilterListContainer").default;
      return {
        main: <FilterListContainer />
      };
    }
  },
  fastRender(params) {
    this.subscribe("filtersBy", params.username);
  }
};
