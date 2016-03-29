import React from "react";

UserProfileView = {
  layout: MainLayout,
  content: {
    main: <UserProfileComponent />
  },
  fastrender(params) {
    this.subscribe("user", params.username);
  }
};
