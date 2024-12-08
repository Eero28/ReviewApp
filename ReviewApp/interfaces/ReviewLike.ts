import { UserInfo } from "./UserInfo";

export interface ReviewLike {
    id_like: number;
    likedAt: string;
    user: UserInfo;
  }