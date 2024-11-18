import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
//@ts-ignore
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { UserInfo } from './interfaces/userInfo';
import { ReviewItemIf } from './interfaces/reviewItemIf';


interface AuthContextProps {
    userReviews: ReviewItemIf[];
    userInfo: UserInfo | null;
    setUserInfo: (userInfo: UserInfo | null) => void;
    setUserReviews: (reviews: ReviewItemIf[]) => void;
    handleLogin: (email: string, password: string) => void;
    handleLogout: () => void;
    getReviews: () => void;
    deleteReview: (id_review: number, access_token: string) => void;
}


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

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
        if (userInfo) {
            getReviews();
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
            console.log("Login failed:", error.message);
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
        }
    }

    return (
        <AuthContext.Provider
            value={{
                userReviews,
                userInfo,
                setUserInfo,
                setUserReviews,
                handleLogin,
                handleLogout,
                getReviews,
                deleteReview
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
