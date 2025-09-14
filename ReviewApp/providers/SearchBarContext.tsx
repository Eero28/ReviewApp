import React, { createContext, useContext, useState } from 'react';
import Animated, { SharedValue, useSharedValue, withTiming } from 'react-native-reanimated';


type SearchContextType = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleSearchBar: () => void;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    animatedWidth: SharedValue<number>;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const animatedWidth = useSharedValue(50);

    const toggleSearchBar = () => {
        if (isOpen) {
            animatedWidth.value = withTiming(50, { duration: 300 });
            setIsOpen(false);
            setSearchTerm('');
        } else {
            setIsOpen(true);
            animatedWidth.value = withTiming(350, { duration: 300 });
        }
    };

    return (
        <SearchContext.Provider value={{ isOpen, setIsOpen, toggleSearchBar, searchTerm, animatedWidth, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) throw new Error("useSearch must be used within a SearchProvider");
    return context;
};
