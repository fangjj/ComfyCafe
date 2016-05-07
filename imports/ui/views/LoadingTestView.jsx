export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const LoadingSpinner = require("/imports/ui/client/components/Spinner/LoadingSpinner").default;
      return {
        main: <LoadingSpinner />
      };
    }
  }
};
