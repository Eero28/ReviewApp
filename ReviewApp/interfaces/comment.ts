import { ReviewItemIf } from "./ReviewItemIf";
import { UserInfo } from "./UserInfo";
export interface Comment {
    id_comment: number;
    text: string;
    createdAt: string;
    review: ReviewItemIf;
    user: UserInfo;
  }