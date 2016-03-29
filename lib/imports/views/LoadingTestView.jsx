import React from "react";
import MainLayout from "/lib/imports/layouts/MainLayout";
import LoadingSpinner from "/lib/imports/components/LoadingSpinner";

const LoadingTestView = {
  layout: MainLayout,
  content: {
    main: <LoadingSpinner />
  }
};

export default LoadingTestView;
