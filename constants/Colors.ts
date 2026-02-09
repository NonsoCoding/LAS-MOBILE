const tintColorLight = "#2f95dc";
const tintColorLightOverlay = "#2f95dc33";
const tintColorDark = "#fff";

export default {
  light: {
    text: "white",
    background: "#fff",
    primaryColor: "#19488A",
    tint: tintColorLight,
    tintLight: tintColorLightOverlay,
    secondaryColor: "#41872C",
    secondaryLight: "#41872C22",
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    primaryTextColor: "#003C7A",
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorLight,
    secondaryColor: "#41872C",
    secondaryLight: "#41872C22",
    primaryColor: "#003C7A",
    tintLight: tintColorLightOverlay,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    primaryTextColor: "#003C7A",
  },
};
