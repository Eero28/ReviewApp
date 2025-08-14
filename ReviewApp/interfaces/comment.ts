import { ReviewItemIf } from "./ReviewItemIf";
import { UserInfo } from "./UserInfo";

export interface Comment {
  id_comment: number;
  isParent: boolean;
  text: string;
  createdAt: string;
  review: ReviewItemIf;
  user: UserInfo;
  replies?: Comment[]; // recursive replies
}
