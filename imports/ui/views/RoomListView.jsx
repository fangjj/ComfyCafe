const RoomListView = {
  build() {
    if (Meteor.isClient) {
      const React = require("react");
      const MainLayout = require("../client/layouts/MainLayout").default;
      const RoomList = require("../client/components/Chat/RoomList").default;
      return {
        layout: MainLayout,
        content: {
          main: <RoomList />
        }
      };
    }
  },
  fastRender(params) {
    this.subscribe("allRooms");
  }
};

export default RoomListView;
