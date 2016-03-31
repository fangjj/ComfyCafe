import React from "react";
import MainLayout from "/imports/ui/layouts/MainLayout";
import LoadingSpinner from "/imports/ui/components/LoadingSpinner";

const LoadingTestView = {
  layout: MainLayout,
  content: {
    main: <LoadingSpinner />
  }
};

export default LoadingTestView;
