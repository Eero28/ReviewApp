import { UserInfo } from "./userInfo";
import { ReviewLike } from "./ReviewLike";
import { Comment } from "./Comment";
export interface ReviewItemIf {
  id_review: number;
  reviewname: string;
  reviewDescription: string;
  reviewRating: number;
  category: string;
  reviewTaste: string[];
  priceRange: string;
  imageUrl: string;
  imagePublicId?: string | undefined;
  createdAt: string;
  user: UserInfo;
  likes: ReviewLike[];
  comments: Comment[];
}
