export class GetUserDto {
  id_user: number;
  username: string;
}

export class GetLikeDto {
  id_like: number;
  user: GetUserDto;
}

export class GetCommentDto {
  id_comment: number;
  text: string;
  user: GetUserDto;
}

export class GetReviewDto {
  id_review: number;
  reviewname: string;
  reviewRating: number;
  imageUrl: string;
  category: string;
  user: GetUserDto;
  likes?: GetLikeDto[];
  comments?: GetCommentDto[];
}
