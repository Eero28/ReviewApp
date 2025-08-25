import React from 'react';

import BeerLogo from '../assets/svg/beer.svg';
import Wine from '../assets/svg/wine.svg';
import Softdrink from '../assets/svg/soda.svg';
import HotBeverage from '../assets/svg/hot-beverage.svg';
import Cocktail from '../assets/svg/cocktail.svg';
import Other from '../assets/svg/other.svg';
import All from '../assets/svg/all.svg';
import UpArrow from '../assets/svg/up.svg';

export type IconName = 'beer' | 'wine' | 'hotbeverage' | 'cocktail' | 'softdrink' | 'other' | 'all' | 'upArrow';

export type IconProps = {
    name: string; // accept string from item.category
    size?: number;
    color?: string;
};

// Mapping from string → IconName
const categoryStringToIconName: Record<string, IconName> = {
    beer: 'beer',
    wine: 'wine',
    hotbeverage: 'hotbeverage',
    cocktail: 'cocktail',
    softdrink: 'softdrink',
    other: 'other',
    all: 'all',
    uparrow: 'upArrow', // note lowercase
};

const Icon: React.FC<IconProps> = ({ name, size = 24 }) => {
    // Map string to valid IconName
    const iconName: IconName | undefined = categoryStringToIconName[name.toLowerCase()];
    if (!iconName) return null; // fallback if unknown

    switch (iconName) {
        case 'beer':
            return <BeerLogo width={size} height={size} />;
        case 'wine':
            return <Wine width={size} height={size} />;
        case 'hotbeverage':
            return <HotBeverage width={size} height={size} />;
        case 'softdrink':
            return <Softdrink width={size} height={size} />;
        case 'cocktail':
            return <Cocktail width={size} height={size} />;
        case 'other':
            return <Other width={size} height={size} />;
        case 'all':
            return <All width={size} height={size} />;
        case 'upArrow':
            return <UpArrow width={size} height={size} />;
        default:
            return null;
    }
};

export default Icon;
