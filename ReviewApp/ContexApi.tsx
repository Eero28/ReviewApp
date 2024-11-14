import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserInfo {
    token: string;
    username: string;
}

interface Review {
    id_review: number;
    reviewname: string;
    reviewRating: number;
    category: string;
    imageUrl: string;
    user: { username: string };
}

interface AuthContextProps {
    userReviews: Review[];
    userInfo: UserInfo | null;
    setUserInfo: (userInfo: UserInfo | null) => void;
    setUserReviews: (reviews: Review[]) => void;
}

// Create the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userReviews, setUserReviews] = useState<Review[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);


    return (
        <AuthContext.Provider
            value={{ userReviews, userInfo, setUserInfo, setUserReviews }}
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
