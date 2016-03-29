import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import Chat from "/lib/imports/components/Chat/Chat";

const ChatView = {
  layout: MainLayout,
  content: {
    main: <Chat />,
    dense: true
  }
};

export default ChatView;
