import { UserInfo } from "./UserInfo";
import { ReviewLike } from "./ReviewLike";
export interface ReviewItemIf {
    id_review: number;
    reviewname: string;
    reviewDescription: string;
    reviewRating: number;
    category: string;
    imageUrl: string;
    createdAt: string;
    user: UserInfo;
    likes: ReviewLike[];
}