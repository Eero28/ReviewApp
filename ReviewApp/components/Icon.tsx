import React, { FC } from 'react';

import BeerLogo from '../assets/svg/beer.svg';
import Wine from '../assets/svg/wine.svg';
import Soda from '../assets/svg/soda.svg';
import HotBeverage from '../assets/svg/hot-beverage.svg';
import Cocktail from '../assets/svg/cocktail.svg';
import Other from '../assets/svg/other.svg';
import All from '../assets/svg/all.svg';
import UpArrow from '../assets/svg/up.svg'


type IconName = 'beer' | 'wine' | 'softdrink' | 'hotbeverage' | 'cocktail' | 'soda' | 'other' | 'all' | 'upArrow';

type IconProps = {
    name: IconName;
    size?: number;
    color?: string;
};

const Icon: React.FC<IconProps> = ({ name, size = 24, }) => {
    switch (name) {
        case 'beer':
            return <BeerLogo width={size} height={size} />;
        case 'wine':
            return <Wine width={size} height={size} />;
        case 'hotbeverage':
            return <HotBeverage width={size} height={size} />;
        case 'soda':
            return <Soda width={size} height={size} />;
        case 'cocktail':
            return <Cocktail width={size} height={size} />;
        case 'other':
            return <Other width={size} height={size} />;
        case 'all':
            return <All width={size} height={size} />;
        case 'upArrow':
            return <UpArrow width={size} height={size} />
        default:
            return null;
    }
};

export default Icon;
