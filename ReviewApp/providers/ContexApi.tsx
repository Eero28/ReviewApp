import React, { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo } from '../interfaces/UserInfo';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
import { errorHandler } from '../helpers/errors/error';

interface AuthContextProps {
  userReviews: ReviewItemIf[];
  allReviews: ReviewItemIf[];
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setUserReviews: (reviews: ReviewItemIf[]) => void;
  setAllReviews: (reviews: ReviewItemIf[]) => void;
  handleLogin: (email: string, password: string) => Promise<UserInfo | undefined>;
  handleLogout: () => void;
  getUserReviews: () => void;
  deleteReview: (id_review: number, access_token: string) => void;
  allReviewsFetch: () => void;
  reviewsWithCategory: (category?: string) => void;
  reviewsWithCategoryAll: (category?: string) => void;
  loading: boolean;
  refreshUserStats: () => void;
  hasMore: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allReviews, setAllReviews] = useState<ReviewItemIf[]>([]);
  const [userReviews, setUserReviews] = useState<ReviewItemIf[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // when user comes to the app
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
        } else {
          await handleLogout();
        }
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getUserReviews = async () => {
    if (!userInfo) return;
    try {
      const response = await axios.get(`${API_URL}/review/user/${userInfo.id_user}`);
      setUserReviews(sortReviews(response.data.data));
    } catch (error: any) {
      errorHandler(error, handleLogout);
    }
  };

  const allReviewsFetch = async (nextPage = 0) => {
    try {
      const response = await axios.get(`${API_URL}/review`, {
        params: { limit: 20, offset: nextPage * 20 },
      });

      const reviews = response.data.data || [];
      if (reviews.length < 20) setHasMore(false);

      setAllReviews(prev => nextPage === 0 ? reviews : [...prev, ...reviews]);
      setPage(nextPage);
    } catch (error: any) {
      errorHandler(error, handleLogout);
    }
  };


  useEffect(() => {
    if (userInfo) {
      getUserReviews();
      allReviewsFetch();
    }
  }, [userInfo]);




  const refreshUserStats = async () => {
    try {
      if (!userInfo) return;
      const response = await axios.get(`${API_URL}/users/${userInfo.id_user}`);
      const user = response.data.data

      const newUserInfo = {
        ...user,
        access_token: userInfo.access_token,
      };

      setUserInfo(newUserInfo);
      await AsyncStorage.setItem("userInfo", JSON.stringify(newUserInfo));
    } catch (error) {
      errorHandler(error, handleLogout);
    }
  };



  const sortReviews = (reviews: ReviewItemIf[]) =>
    [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


  const handleLogin = async (email: string, password: string): Promise<UserInfo | undefined> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const userData: UserInfo = response.data.data;
      console.log("hello", userData)
      setUserInfo(userData);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      errorHandler(error, handleLogout)
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      setUserInfo(null);
    } catch (error) {
      errorHandler(error)
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
      errorHandler(error, handleLogout)
    }
  };

  const reviewsWithCategoryAll = async (category?: string) => {
    try {
      const url = category ? `${API_URL}/review/all?category=${category}` : `${API_URL}/review`;
      const response = await axios.get(url);
      setAllReviews(sortReviews(response.data.data || []));
    } catch (error: any) {
      errorHandler(error, handleLogout)
    }
  };

  const deleteReview = async (id_review: number, access_token: string) => {
    try {
      await axios.delete(`${API_URL}/review/${id_review}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      getUserReviews();
      allReviewsFetch();
    } catch (error: any) {
      errorHandler(error, handleLogout)
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
        getUserReviews,
        deleteReview,
        allReviewsFetch,
        reviewsWithCategory,
        reviewsWithCategoryAll,
        loading,
        refreshUserStats,
        hasMore
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
