export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const FilterContainer = require("../client/components/Filter/FilterContainer").default;
      return {
        main: <FilterContainer />
      };
    }
  },
  fastRender(params) {
    this.subscribe("filterSlug", params.username, params.slug);
  }
};
