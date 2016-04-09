import getMuiTheme from "material-ui/lib/styles/getMuiTheme";
import {
  cyan700,
  grey600,
  pinkA100, pinkA200, pinkA400,
  fullWhite
} from "material-ui/lib/styles/colors";
import ColorManipulator from "material-ui/lib/utils/color-manipulator";

export default getMuiTheme({
  palette: {
    primary1Color: "#009688",
    //accent1Color: "#880E4F",
    accent1Color: "#64FFDA",
    textColor: "#EEF4EE",
    alternateTextColor: "#EEF4EE",

    // copied from darkBaseTheme
    // https://github.com/callemall/material-ui/blob/master/src/styles/baseThemes/darkBaseTheme.js
    primary2Color: cyan700,
    primary3Color: grey600,
    accent2Color: pinkA400,
    accent3Color: pinkA100,
    canvasColor: "#303030",
    borderColor: ColorManipulator.fade(fullWhite, 0.3),
    disabledColor: ColorManipulator.fade(fullWhite, 0.3),
    pickerHeaderColor: ColorManipulator.fade(fullWhite, 0.12),
    clockCircleColor: ColorManipulator.fade(fullWhite, 0.12)
  },
  fontFamily: "Slabo 27px"
});
