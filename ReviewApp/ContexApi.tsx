import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

interface UserInfo {
    access_token: string;
    username: string;
    userId: number;
    email: string;
    role: string;
}

interface Review {
    id_review: number;
    reviewname: string;
    reviewRating: number;
    category: string;
    imageUrl: string;
}

interface AuthContextProps {
    userReviews: Review[];
    userInfo: UserInfo | null;
    setUserInfo: (userInfo: UserInfo | null) => void;
    setUserReviews: (reviews: Review[]) => void;
    handleLogin: (email: string, password: string) => void;
    handleLogout: () => void;
}


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [userReviews, setUserReviews] = useState<Review[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const storedUserInfo = await AsyncStorage.getItem('userInfo');
                if (storedUserInfo) {
                    const parseUserInfo = JSON.parse(storedUserInfo)
                    console.log(parseUserInfo)
                    setUserInfo(parseUserInfo); 
                }
            } catch (error) {
                console.log("Error retrieving user info from AsyncStorage:", error);
            }
        };
        checkUserSession();
    }, []);

    const handleLogin = async (email: string, password: string) => {
        const loginData = {
            email: email,
            password: password
        };

        try {
            const response = await axios.post(`${API_URL}/auth/login`, loginData);
            const userData: UserInfo = response.data;
            console.log("Login successful:", userData);
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

    return (
        <AuthContext.Provider
            value={{
                userReviews,
                userInfo,
                setUserInfo,
                setUserReviews,
                handleLogin,
                handleLogout
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
