import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { IconProps } from '@/types/svg';

const MarkerPlotSvg: React.FC<IconProps> = ({
  color = 'currentColor',
  ...props
}) => (
  <Svg width="18" height="22" viewBox="0 0 18 22" fill="none">
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9 21C9 21 17 15 17 9C17 6.87827 16.1571 4.84344 14.6569 3.34315C13.1566 1.84285 11.1217 1 9 1C6.87827 1 4.84344 1.84285 3.34315 3.34315C1.84285 4.84344 1 6.87827 1 9C1 15 9 21 9 21ZM12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9C6 7.34315 7.34315 6 9 6C10.6569 6 12 7.34315 12 9Z"
      fill="#EC6E00"
    />
    <Path
      d="M9 21L8.4 21.8C8.75556 22.0667 9.24444 22.0667 9.6 21.8L9 21ZM14.6569 3.34315L13.9497 4.05025L13.9497 4.05025L14.6569 3.34315ZM3.34315 3.34315L4.05025 4.05025L4.05025 4.05025L3.34315 3.34315ZM16 9C16 11.605 14.2295 14.3616 12.2526 16.5856C11.2876 17.6713 10.3195 18.5792 9.5915 19.2162C9.22822 19.534 8.92655 19.7829 8.71736 19.951C8.61281 20.035 8.53149 20.0987 8.47727 20.1407C8.45017 20.1617 8.42985 20.1773 8.41681 20.1872C8.41029 20.1922 8.40559 20.1958 8.40276 20.1979C8.40135 20.199 8.40041 20.1997 8.39995 20.2C8.39972 20.2002 8.3996 20.2003 8.39961 20.2003C8.39962 20.2003 8.39971 20.2002 8.39972 20.2002C8.39984 20.2001 8.4 20.2 9 21C9.6 21.8 9.60022 21.7998 9.60047 21.7996C9.60059 21.7996 9.60087 21.7993 9.60112 21.7992C9.60161 21.7988 9.60223 21.7983 9.60297 21.7978C9.60444 21.7967 9.6064 21.7952 9.60883 21.7933C9.6137 21.7897 9.62047 21.7845 9.62909 21.778C9.64632 21.7648 9.67092 21.746 9.70242 21.7216C9.76539 21.6728 9.85594 21.6017 9.97014 21.51C10.1984 21.3265 10.5218 21.0597 10.9085 20.7213C11.6805 20.0458 12.7124 19.0787 13.7474 17.9144C15.7705 15.6384 18 12.395 18 9H16ZM13.9497 4.05025C15.2625 5.36301 16 7.14348 16 9H18C18 6.61305 17.0518 4.32387 15.364 2.63604L13.9497 4.05025ZM9 2C10.8565 2 12.637 2.7375 13.9497 4.05025L15.364 2.63604C13.6761 0.948212 11.3869 0 9 0V2ZM4.05025 4.05025C5.36301 2.7375 7.14348 2 9 2V0C6.61305 0 4.32387 0.948212 2.63604 2.63604L4.05025 4.05025ZM2 9C2 7.14348 2.7375 5.36301 4.05025 4.05025L2.63604 2.63604C0.948212 4.32387 0 6.61305 0 9H2ZM9 21C9.6 20.2 9.60016 20.2001 9.60028 20.2002C9.60029 20.2002 9.60038 20.2003 9.60039 20.2003C9.6004 20.2003 9.60028 20.2002 9.60005 20.2C9.59959 20.1997 9.59865 20.199 9.59724 20.1979C9.59441 20.1958 9.58971 20.1922 9.58319 20.1872C9.57015 20.1773 9.54983 20.1617 9.52273 20.1407C9.46851 20.0987 9.38719 20.035 9.28264 19.951C9.07345 19.7829 8.77178 19.534 8.4085 19.2162C7.68054 18.5792 6.71242 17.6713 5.74741 16.5856C3.77047 14.3616 2 11.605 2 9H0C0 12.395 2.22953 15.6384 4.25259 17.9144C5.28758 19.0787 6.31946 20.0458 7.0915 20.7213C7.47822 21.0597 7.80155 21.3265 8.02986 21.51C8.14406 21.6017 8.23461 21.6728 8.29758 21.7216C8.32908 21.746 8.35368 21.7648 8.37091 21.778C8.37953 21.7845 8.3863 21.7897 8.39117 21.7933C8.3936 21.7952 8.39556 21.7967 8.39703 21.7978C8.39777 21.7983 8.39839 21.7988 8.39888 21.7992C8.39913 21.7993 8.39941 21.7996 8.39953 21.7996C8.39978 21.7998 8.4 21.8 9 21ZM9 13C11.2091 13 13 11.2091 13 9H11C11 10.1046 10.1046 11 9 11V13ZM5 9C5 11.2091 6.79086 13 9 13V11C7.89543 11 7 10.1046 7 9H5ZM9 5C6.79086 5 5 6.79086 5 9H7C7 7.89543 7.89543 7 9 7V5ZM13 9C13 6.79086 11.2091 5 9 5V7C10.1046 7 11 7.89543 11 9H13Z"
      fill="#F7F7F7"
    />
  </Svg>
);

export default MarkerPlotSvg;
