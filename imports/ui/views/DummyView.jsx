import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import DummyComponent from "/imports/ui/components/DummyComponent";

const DummyView = {
  layout: MainLayout,
  content: {
    main: <DummyComponent />
  }
};

export default DummyView;
