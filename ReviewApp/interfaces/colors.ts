import { StatusBarStyle } from "react-native";

export interface ThemeColors {
  bg: string;
  textColorPrimary: string;
  textColorSecondary: string;
  statusBarColor: StatusBarStyle;
  alerts: {
    danger: string;
    warning: string;
    success: string;
    info: string;
  };
  profile: {
    roleBg: string;
    roleTextColor: string;
  };
  button: {
    bg: string;
  };
  modalDialog: {
    bg: string;
  };
  card: {
    bg: string;
    bgContent: string;
    border: string;
    star: string;
    separator: string;
  };
  form: {
    input: string;
    inputBorder: string;
    inputTextColor: string;
  };
  navigation: {
    camera: string;
    icons: string;
  };
}
