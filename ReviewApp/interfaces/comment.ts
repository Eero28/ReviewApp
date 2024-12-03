import { ReviewItemIf } from "./reviewItemIf";
import { UserInfo } from "./userInfo";
export interface Comment {
    id_comment: number;
    text: string;
    createdAt: string;
    review: ReviewItemIf;
    user: UserInfo;
  }