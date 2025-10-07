import { createNavigationContainerRef } from "@react-navigation/native";
import { MainStackParamList } from "../interfaces/Navigation";
import { useRef } from "react";

export const navigationRef = createNavigationContainerRef<MainStackParamList>();
export function getCurrentRouteName() {
  return navigationRef.current?.getCurrentRoute()?.name;
}
