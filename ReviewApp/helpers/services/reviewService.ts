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
