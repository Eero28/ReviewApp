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
    bg: "#1E1E1E",
  },
  card: {
    bg: "#1A1A1A",
    bgContent: "red",
    border: "#4D4D4D",
    star: "#ffae42",
  },
  form: {
    input: "#1A1A1A",
    inputBorder: "",
    inputTextColor: "#B3B3B3",
  },
};

export const colorsLightmode: ThemeColors = {
  bg: "#fbfbfe",
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
    bg: "#ffff",
  },
  card: {
    bg: "#8f8dbb",
    bgContent: "#8f8dbb",
    border: "#4D4D4D",
    star: "#ffae42",
  },
  form: {
    input: "#fff",
    inputBorder: "",
    inputTextColor: "#B3B3B3",
  },
};
