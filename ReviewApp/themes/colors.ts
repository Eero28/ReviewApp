import { ThemeColors } from "../interfaces/colors";

export const colorsDarkmode: ThemeColors = {
  bg: "#030401",
  textColorPrimary: "#ebe9fc",
  textColorSecondary: "#B3B3B3",
  statusBarColor: "light-content",
  alerts: {
    danger: "#ff4d4d",
    warning: "#ffae42",
    success: "#4cd137",
    info: "#3498db",
  },
  modalDialog: {
    bg: "rgba(30,30,30,0.95)",
  },
  card: {
    bg: "#1A1A1A",
    bgContent: "red",
    border: "#4D4D4D",
    star: "#ffae42",
    separator: "#B3B3B3",
  },
  form: {
    input: "#1A1A1A",
    inputBorder: "",
    inputTextColor: "#B3B3B3",
  },
  navigation: {
    camera: "#4D4D4D",
    icons: "#ebe9fc",
  },
};

export const colorsLightmode: ThemeColors = {
  bg: "#e8eaef",
  textColorPrimary: "#050316",
  textColorSecondary: "#5a5a75",
  statusBarColor: "dark-content",
  alerts: {
    danger: "#ff4d4d",
    warning: "#ffae42",
    success: "#4cd137",
    info: "#3498db",
  },
  modalDialog: {
    bg: "#fdfdfd",
  },
  card: {
    bg: "#f5f6f8",
    bgContent: "#ffffff",
    border: "#e0e0e0",
    star: "#ffae42",
    separator: "gray",
  },
  form: {
    input: "#ffffff",
    inputBorder: "#dcdcdc",
    inputTextColor: "#5a5a75",
  },
  navigation: {
    camera: "#007AFF",
    icons: "#050316",
  },
};
