export default {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const RoomList = require("../client/components/Chat/RoomList").default;
      return {
        main: <RoomList />
      };
    }
  },
  fastRender(params) {
    this.subscribe("allRooms");
  }
};
