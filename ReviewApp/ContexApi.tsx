import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
//@ts-ignore
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { UserInfo } from './interfaces/UserInfo';
import { ReviewItemIf } from './interfaces/ReviewItemIf';


interface AuthContextProps {
    userReviews: ReviewItemIf[];
    allReviews: ReviewItemIf[];
    userInfo: UserInfo | null;
    setUserInfo: (userInfo: UserInfo | null) => void;
    setUserReviews: (reviews: ReviewItemIf[]) => void;
    setAllReviews: (reviews: ReviewItemIf[]) => void;
    handleLogin: (email: string, password: string) => void;
    handleLogout: () => void;
    getReviews: () => void;
    deleteReview: (id_review: number, access_token: string) => void;
    allReviewsFetch: () => void;
    reviewsWithCategory: (category?: string | undefined) => void;
    reviewsWithCategoryAll: (category?: string | undefined) => void;
}


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [allReviews, setAllReviews] = useState<ReviewItemIf[]>([])
    const [userReviews, setUserReviews] = useState<ReviewItemIf[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const storedUserInfo = await AsyncStorage.getItem('userInfo');
                if (storedUserInfo) {
                    const parseUserInfo = JSON.parse(storedUserInfo)
                    setUserInfo(parseUserInfo);
                }
            } catch (error) {
                console.log("Error retrieving user info from AsyncStorage:", error);
            }
        };
        checkUserSession();
    }, []);

    useEffect(() => {
        console.log("mounted")
        if (userInfo) {
            getReviews();
            allReviewsFetch();
        }
    }, [userInfo]);

    const handleLogin = async (email: string, password: string) => {
        const loginData = {
            email: email,
            password: password
        };

        try {
            const response = await axios.post(`${API_URL}/auth/login`, loginData);
            const userData: UserInfo = response.data;
            setUserInfo(userData);
            await AsyncStorage.setItem('userInfo', JSON.stringify(userData));

        } catch (error) {
            console.log("Login failed:", error.response.data.message);
        }
    };


    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userInfo');
            setUserInfo(null);
        } catch (error) {
            console.log("Error during logout:", error);
        }
    };


    const getReviews = async () => {
        try {
            const response = await axios.get(`${API_URL}/review/user/${userInfo?.id_user}`);
            setUserReviews(response.data)
        } catch (error) {
            setUserReviews([])
            console.log("reviews", error.message)
        }

    }

    const allReviewsFetch = async () => {
        try {
            const responce = await axios.get(`${API_URL}/review`)
            setAllReviews(responce.data)
        } catch (error) {
            setAllReviews([])
            console.log(error.responce.message)
        }


    }

    const reviewsWithCategory = async (category?: string) => {
        try {
            const url = category
                ? `${API_URL}/review/users/${userInfo?.id_user}/reviews?category=${category}`
                : `${API_URL}/review/user/${userInfo?.id_user}`;
    
            const response = await axios.get(url);
            setUserReviews(response.data);  
        } catch (error) {
            console.log("Error fetching reviews by category:", error);
        }
    };

    const reviewsWithCategoryAll = async (category?: string) => {
        try {
            const url = category
                ? `${API_URL}/review/all?category=${category}`
                : `${API_URL}/review`;
    
            const response = await axios.get(url);
            setAllReviews(response.data);  
        } catch (error) {
            console.log("Error fetching reviews by category:", error);
        }
    };


    const deleteReview = async (id_review: number, access_token: string) => {
        try {
            await axios.delete(`${API_URL}/review/${id_review}`, {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })
            setUserReviews(userReviews.filter((item) => item.id_review !== id_review));

        } catch (error) {
            console.log(error.message)
            if (error.response && error.response.status === 401) {
                alert("Token expired or invalid. Logging out...");
                await handleLogout();
            }
        }

        
    }

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
                reviewsWithCategoryAll
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
