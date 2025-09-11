import {
  NavigatorScreenParams,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ReviewItemIf } from "./ReviewItemIf";

export interface AuthTabParamList extends ParamListBase {
  Login: undefined;
  Register: undefined;
}

export interface BottomTabParamList extends ParamListBase {
  Myreviews: undefined;
  AllReviews: undefined;
}

export interface DrawerParamList extends ParamListBase {
  Reviews: NavigatorScreenParams<BottomTabParamList>;
  Profile: undefined;
  Favorites: undefined;
}

export interface MainStackParamList extends ParamListBase {
  MainApp: NavigatorScreenParams<DrawerParamList>;
  ReviewDetails: {
    item: ReviewItemIf;
    showComment?: boolean;
  };
  TakeImage: {
    isUpdate: boolean;
    initialImage: string;
    initialData: ReviewItemIf;
  };
}

export interface ReviewDetailsNavigationProp
  extends StackNavigationProp<MainStackParamList, "ReviewDetails"> {}

export interface ReviewDetailsRouteProp
  extends RouteProp<MainStackParamList, "ReviewDetails"> {}
