export interface UserInfo {
  access_token?: string;
  username: string;
  id_user: number;
  email: string;
  role: string;
  avatar: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  stats?: {
    likesCount: number;
    commentsCount: number;
    reviewsCount: number;
  };
}
