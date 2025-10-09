import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  deleteReview: (id_review: number, access_token: string) => void;
  fetchReviews: (type: "user" | "all", category?: string, loadMore?: boolean, resetSkip?: boolean) => Promise<void>;
  loading: boolean;
  refreshUserStats: () => void;
  userHasMore: boolean;
  allHasMore: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allReviews, setAllReviews] = useState<ReviewItemIf[]>([]);
  const [userReviews, setUserReviews] = useState<ReviewItemIf[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // pagination
  const [userSkip, setUserSkip] = useState(0);
  const [allSkip, setAllSkip] = useState(0);
  const limit = 10;

  const [userHasMore, setUserHasMore] = useState(true);
  const [allHasMore, setAllHasMore] = useState(true);


  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          const parsedUserInfo: UserInfo = JSON.parse(storedUserInfo);
          if (parsedUserInfo?.id_user) setUserInfo(parsedUserInfo);
          else await handleLogout();
        } else {
          await handleLogout();
        }
      } catch (err) {
        console.error('Error accessing AsyncStorage:', err);
        await handleLogout();
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const fetchReviews = async (
    type: "user" | "all",
    category?: string,
    loadMore: boolean = false,
    resetSkip: boolean = false
  ): Promise<void> => {
    try {
      let skip = 0;
      let baseUrl = "";

      if (type === "user") {
        if (!userInfo?.id_user) return;

        baseUrl = `${API_URL}/review/user/${userInfo.id_user}`;
        skip = resetSkip ? 0 : userSkip;

      } else {
        // For all reviews
        baseUrl = category
          ? `${API_URL}/review/category`
          : `${API_URL}/review`;
        skip = resetSkip ? 0 : allSkip;
      }

      // params
      const params: Record<string, any> = { limit, skip };
      if (category) {
        params.category = category;
      }

      const response = await axios.get(baseUrl, { params });

      const reviewsFromAPI: ReviewItemIf[] = response.data.data || [];

      if (reviewsFromAPI.length === 0) {
        if (type === "user") {
          setUserHasMore(false);
          // Clear reviews if this is a fresh fetch (not loadMore)
          if (!loadMore) setUserReviews([]);
        } else {
          setAllHasMore(false);
          if (!loadMore) setAllReviews([]);
        }
        return;
      }
      const currentReviews = type === "user" ? userReviews : allReviews;

      // If loadMore=true, append new reviews; otherwise replace the list
      const updatedReviews = loadMore
        ? [...currentReviews, ...reviewsFromAPI]
        : reviewsFromAPI;

      if (type === "user") {
        setUserReviews(updatedReviews);
        setUserSkip(skip + reviewsFromAPI.length);
        console.log("api", reviewsFromAPI.length)
        console.log("params", params)
      } else {
        setAllReviews(updatedReviews);
        setAllSkip(skip + reviewsFromAPI.length);
      }


    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };


  const handleLogin = async (email: string, password: string): Promise<UserInfo | undefined> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const userData: UserInfo = response.data.data;
      setUserInfo(userData);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      return userData;
    } catch (error: any) {
      errorHandler(error, handleLogout);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      setUserInfo(null);
    } catch (error) {
      errorHandler(error);
    }
  };

  const deleteReview = async (id_review: number, access_token: string) => {
    try {
      await axios.delete(`${API_URL}/review/${id_review}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      await Promise.all([
        fetchReviews("user", undefined, false, true),
        fetchReviews("all", undefined, false, true)
      ]);
    } catch (error: any) {
      errorHandler(error, handleLogout);
    }
  };

  const refreshUserStats = async () => {
    if (!userInfo) return;
    try {
      const response = await axios.get(`${API_URL}/users/${userInfo.id_user}`);
      const user = response.data.data;
      const newUserInfo = { ...user, access_token: userInfo.access_token };
      setUserInfo(newUserInfo);
      await AsyncStorage.setItem("userInfo", JSON.stringify(newUserInfo));
    } catch (error) {
      errorHandler(error, handleLogout);
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
        deleteReview,
        fetchReviews,
        loading,
        refreshUserStats,
        userHasMore,
        allHasMore
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
