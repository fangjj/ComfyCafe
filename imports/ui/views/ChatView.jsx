import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import Chat from "/imports/ui/components/Chat/Chat";

const ChatView = {
  layout: MainLayout,
  content: {
    main: <Chat />,
    dense: true
  }
};

export default ChatView;
