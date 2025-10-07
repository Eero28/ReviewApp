import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
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
  fetchUserReviews: (category?: string) => Promise<void>;
  allReviewsFetch: (signal?: AbortSignal) => Promise<void>;
  reviewsWithCategoryAll: (category?: string) => void;
  loading: boolean;
  refreshUserStats: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allReviews, setAllReviews] = useState<ReviewItemIf[]>([]);
  const [userReviews, setUserReviews] = useState<ReviewItemIf[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          const parsedUserInfo: UserInfo = JSON.parse(storedUserInfo);
          if (parsedUserInfo?.id_user) {
            setUserInfo(parsedUserInfo);
          } else {
            await handleLogout();
          }
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

  const fetchUserReviews = async (category?: string) => {
    try {
      const url = category
        ? `${API_URL}/review/users/${userInfo?.id_user}/reviews?category=${category}`
        : `${API_URL}/review/user/${userInfo?.id_user}`;
      const response = await axios.get(url);
      setUserReviews(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };


  const allReviewsFetch = async (signal?: AbortSignal, forUser?: boolean) => {
    try {
      const response = await axios.get(`${API_URL}/review`, { signal });
      if (forUser) {
        if (!userInfo) return;
        const userReviews = response.data.data.filter((val: ReviewItemIf) => {
          return userInfo?.id_user === val.user.id_user;
        })
        setUserReviews(userReviews)
      } else {
        setAllReviews(response.data.data || []);
      }
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      errorHandler(error);
    }
  };


  const refreshUserStats = async () => {
    if (!userInfo) return;
    try {
      const response = await axios.get(`${API_URL}/users/${userInfo.id_user}`);
      const user = response.data.data;
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


  const reviewsWithCategoryAll = async (category?: string) => {
    try {
      const url = category ? `${API_URL}/review/all?category=${category}` : `${API_URL}/review`;
      const response = await axios.get(url);
      setAllReviews(response.data.data || []);
    } catch (error: any) {
      errorHandler(error, handleLogout);
    }
  };

  const deleteReview = async (id_review: number, access_token: string) => {
    try {
      await axios.delete(`${API_URL}/review/${id_review}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      fetchUserReviews()
      allReviewsFetch()
    } catch (error: any) {
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
        allReviewsFetch,
        reviewsWithCategoryAll,
        loading,
        refreshUserStats,
        fetchUserReviews
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
