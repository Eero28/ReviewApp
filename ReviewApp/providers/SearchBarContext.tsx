import React, { createContext, useState, useContext } from 'react';
import { Animated } from 'react-native';

type SearchContextType = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleSearchBar: () => void;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    animatedWidth: Animated.Value
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [animatedWidth] = useState(new Animated.Value(50));
    const [searchTerm, setSearchTerm] = useState<string>('');


    const toggleSearchBar = () => {
        if (isOpen) {
            Animated.timing(animatedWidth, {
                toValue: 50,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setIsOpen(false));
            setSearchTerm('');
        } else {
            setIsOpen(true);
            Animated.timing(animatedWidth, {
                toValue: 350,
                duration: 300,
                useNativeDriver: false,
            }).start();
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
