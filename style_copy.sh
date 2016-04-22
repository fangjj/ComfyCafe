#!/bin/bash
# Using symlinks would result in horrendous complaints from the Meteor build tool on account of
#  duplicate handles. This way, we have a passable solution.
cp node_modules/perfect-scrollbar/dist/css/perfect-scrollbar.css client/styles/extern/_perfectScrollbar.scss
cp node_modules/cropperjs/dist/cropper.css client/styles/extern/_cropper.scss
cp node_modules/normalize.css/normalize.css client/styles/extern/_normalize.scss
