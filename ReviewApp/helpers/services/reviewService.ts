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

export const toggleLike = async (
  likesState: { isLiked: boolean; user: UserInfo[] },
  userInfo: UserInfo | null,
  id_review: number,
  setLikesState: React.Dispatch<
    React.SetStateAction<{ user: UserInfo[]; isLiked: boolean }>
  >
) => {
  if (!userInfo) {
    console.warn("User not logged in");
    return;
  }

  if (likesState.isLiked) {
    await deleteLike(userInfo.id_user, id_review, setLikesState);
  } else {
    await likeReview(id_review, userInfo.id_user);
    await getReviewLikes(userInfo.id_user, id_review, setLikesState);
  }
};

export const getReviewComments = async (id_review: number) => {
  const response = await axios.get(`${API_URL}/comments/review/${id_review}`);
  return response.data?.data || [];
};

export const deleteLike = async (
  id_user: number,
  id_review: number,
  setLikesState: React.Dispatch<
    React.SetStateAction<{ user: UserInfo[]; isLiked: boolean }>
  >
) => {
  try {
    if (!id_user) {
      throw new Error("User ID is missing");
    }
    await axios.delete(
      `${API_URL}/likes/unlike/review/${id_review}/user/${id_user}`
    );
    await getReviewLikes(id_user, id_review, setLikesState);
  } catch (error) {
    console.error("Error unliking the review:", error);
  }
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
