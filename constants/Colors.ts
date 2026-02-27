const tintColorLight = "#2f95dc";
const tintColorLightOverlay = "#2f95dc33";
const tintColorDark = "#fff";

export default {
  light: {
    text: "black",
    background: "#fff",
    primaryColor: "#19488A",
    tint: tintColorLight,
    tintLight: tintColorLightOverlay,
    secondaryColor: "#41872C",
    secondaryLight: "#41872C22",
    iconColor: "#19488A",
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    primaryTextColor: "#003C7A",
  },
  dark: {
    text: "#fff",
    background: "#333333",
    tint: tintColorLight,
    secondaryColor: "#41872C",
    secondaryLight: "#41872C22",
    primaryColor: "#19488A",
    iconColor: "#ccc",
    tintLight: tintColorLightOverlay,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    primaryTextColor: "#003C7A",
  },
};
