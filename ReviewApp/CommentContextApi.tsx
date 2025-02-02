// CommentsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ReviewItemIf } from './interfaces/ReviewItemIf';
import axios from 'axios';
//@ts-ignore
import { API_URL } from "@env";
import { Comment } from './interfaces/Comment';
interface CommentsContextProps {
  comments: any[];
  getReviewComments: (review: ReviewItemIf) => void;
}

const CommentsContext = createContext<CommentsContextProps | undefined>(undefined);

export const CommentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<string[]>([]);

  const getReviewComments = async (review: ReviewItemIf) => {
    try {
      const response = await axios.get(`${API_URL}/comments/review/${review.id_review}`);
      if (response.data && response.data.data) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  return (
    <CommentsContext.Provider value={{ comments,getReviewComments }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = (): CommentsContextProps => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
};
