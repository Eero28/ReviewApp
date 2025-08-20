import { Comment } from "../../interfaces/Comment";

export const countReplies = (comment: Comment): number => {
  if (!comment.replies || comment.replies.length === 0) return 0;
  let total = comment.replies.length;
  comment.replies.forEach((r) => {
    total += countReplies(r);
  });
  return total;
};
