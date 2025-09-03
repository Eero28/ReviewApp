import axios from "axios";
import { API_URL } from "@env";
import { UserInfo } from "../../interfaces/UserInfo";

export const checkIfUser = (id_user: number) => {};

export const likeReview = async (id_review: number, id_user: number) => {
  try {
    await axios.post(`${API_URL}/likes/like/review/${id_review}`, { id_user });
  } catch (error) {
    console.error("Error liking the review:", error);
  }
};

export const getReviewComments = async (id_review: number) => {
  const response = await axios.get(`${API_URL}/comments/review/${id_review}`);
  return response.data?.data || [];
};

export const getReviewLikes = async (
  id_user: number,
  id_review: number,
  setLikesState: React.Dispatch<
    React.SetStateAction<{ user: UserInfo[]; isLiked: boolean }>
  >
) => {
  try {
    const response = await axios.get(
      `${API_URL}/likes/users/review/${id_review}`
    );
    const usersWhoLiked: UserInfo[] = response.data.data;
    const isLikedByUser = usersWhoLiked.some(
      (like) => like.id_user === id_user
    );

    setLikesState({
      user: usersWhoLiked,
      isLiked: isLikedByUser,
    });
  } catch (error) {
    console.error("Error fetching review likes:", error);
  }
};
