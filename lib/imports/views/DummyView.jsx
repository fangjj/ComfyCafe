import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import DummyComponent from "/lib/imports/components/DummyComponent";

const DummyView = {
  layout: MainLayout,
  content: {
    main: <DummyComponent />
  }
};

export default DummyView;
