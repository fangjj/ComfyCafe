export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const RoomListContainer = require("../client/components/Chat/RoomListContainer").default;
      return {
        main: <RoomListContainer />
      };
    }
  },
  fastRender(params) {
    this.subscribe("allRooms");
  }
};
