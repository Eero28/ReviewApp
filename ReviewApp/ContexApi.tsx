import React, { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo } from './interfaces/UserInfo';
import { ReviewItemIf } from './interfaces/ReviewItemIf';

interface AuthContextProps {
  userReviews: ReviewItemIf[];
  allReviews: ReviewItemIf[];
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setUserReviews: (reviews: ReviewItemIf[]) => void;
  setAllReviews: (reviews: ReviewItemIf[]) => void;
  handleLogin: (email: string, password: string) => Promise<UserInfo | undefined>;
  handleLogout: () => void;
  getReviews: () => void;
  deleteReview: (id_review: number, access_token: string) => void;
  allReviewsFetch: () => void;
  reviewsWithCategory: (category?: string) => void;
  reviewsWithCategoryAll: (category?: string) => void;
  setReviewsUpdated: Dispatch<SetStateAction<boolean>>;
  reviewsUpdated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allReviews, setAllReviews] = useState<ReviewItemIf[]>([]);
  const [userReviews, setUserReviews] = useState<ReviewItemIf[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [reviewsUpdated, setReviewsUpdated] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
        }
      } catch (error) {
        console.log("Error with user session", error);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);


  useEffect(() => {
    if (userInfo) {
      getReviews();
      allReviewsFetch();
    }
  }, [userInfo, reviewsUpdated]);

  const sortReviews = (reviews: ReviewItemIf[]) =>
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleLogin = async (email: string, password: string): Promise<UserInfo | undefined> => {
    try {
      console.log(API_URL)
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const userData: UserInfo = response.data.data;
      setUserInfo(userData);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      console.log(error?.response?.data || error.message);
      throw new Error('Invalid credentials');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      setUserInfo(null);
    } catch (error) {
      console.log(error);
    }
  };

  const getReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/review/user/${userInfo?.id_user}`);
      setUserReviews(sortReviews(response.data.data));
    } catch (error: any) {
      setUserReviews([]);
      console.log(error?.message);
    }
  };

  const allReviewsFetch = async () => {
    try {
      const response = await axios.get(`${API_URL}/review`);
      setAllReviews(sortReviews(response.data.data));
    } catch (error: any) {
      setAllReviews([]);
      console.log(error?.message);
    }
  };

  const reviewsWithCategory = async (category?: string) => {
    try {
      const url = category
        ? `${API_URL}/review/users/${userInfo?.id_user}/reviews?category=${category}`
        : `${API_URL}/review/user/${userInfo?.id_user}`;
      const response = await axios.get(url);
      setUserReviews(sortReviews(response.data.data));
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  const reviewsWithCategoryAll = async (category?: string) => {
    try {
      const url = category ? `${API_URL}/review/all?category=${category}` : `${API_URL}/review`;
      const response = await axios.get(url);
      setAllReviews(sortReviews(response.data.data));
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  const deleteReview = async (id_review: number, access_token: string) => {
    try {
      await axios.delete(`${API_URL}/review/${id_review}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setReviewsUpdated(!reviewsUpdated);
    } catch (error: any) {
      console.log(error?.response.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userReviews,
        allReviews,
        userInfo,
        setUserInfo,
        setUserReviews,
        setAllReviews,
        handleLogin,
        handleLogout,
        getReviews,
        deleteReview,
        allReviewsFetch,
        reviewsWithCategory,
        reviewsWithCategoryAll,
        setReviewsUpdated,
        reviewsUpdated,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
