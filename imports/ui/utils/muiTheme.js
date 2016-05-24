import getMuiTheme from "material-ui/styles/getMuiTheme";
import {
  cyan700,
  grey600,
  pink600, pinkA100,
  fullWhite
} from "material-ui/styles/colors";
import { fade } from "material-ui/utils/colorManipulator";

export default function () {
  return getMuiTheme({
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
      accent2Color: pink600,
      accent3Color: pinkA100,
      canvasColor: "#303030",
      borderColor: fade(fullWhite, 0.3),
      disabledColor: fade(fullWhite, 0.3),
      pickerHeaderColor: fade(fullWhite, 0.12),
      clockCircleColor: fade(fullWhite, 0.12)
    },
    fontFamily: "Slabo 27px"
  }, { userAgent: global.navigator.userAgent });
};
