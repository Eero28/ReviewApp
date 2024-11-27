import React, {FC} from 'react';

import BeerLogo from '../assets/svg/beer.svg';
import Wine from '../assets/svg/wine.svg'
import Soda from '../assets/svg/soda.svg'
import HotBeverage from '../assets/svg/hot-beverage.svg'
import Cocktail from '../assets/svg/cockitail.svg'



type IconName = 'beer' | 'wine' | 'softdrink' | 'hotbeverage' | 'cocktail' | 'soda';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'black' }) => {
  switch (name) {
    case 'beer':
        return <BeerLogo width={size} height={size} fill={color} />;
    case 'wine':
        return <Wine width={size} height={size} fill={color}/>
    case 'hotbeverage':
        return <HotBeverage width={size} height={size} fill={color}/>
    case 'soda':
        return <Soda width={size} height={size} fill={color}/>
    case 'cocktail':
        return <Cocktail width={size} height={size} fill={color}/>
    default:
      return null; 
  }
};

export default Icon;
