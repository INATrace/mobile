import React from "react";
import Svg, { Path } from "react-native-svg";

import { IconProps } from "@/types/svg";

const PlotSvg: React.FC<IconProps> = ({ color = "currentColor", ...props }) => (
  <Svg width="52" height="48" viewBox="0 0 52 48" fill="none">
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M26.279 20.545C19.3516 20.6146 18.4541 20.5706 17.5671 20.1186C17.0233 19.8414 16.3839 19.2641 16.1464 18.8355C15.79 18.1928 15.7144 16.7251 15.7144 10.4496C15.7144 4.54378 15.8039 2.63024 16.1149 1.8926C16.3645 1.3004 16.8875 0.764983 17.5032 0.471248C18.345 0.0696885 19.5884 0 25.9116 0C31.6103 0 33.5496 0.0917407 34.2691 0.395383C34.7844 0.612837 35.4237 1.18848 35.6899 1.6746C36.102 2.42747 36.1869 3.6263 36.2627 9.76506C36.3292 15.1466 36.2572 17.2639 35.9786 18.1257C35.7733 18.7604 35.2447 19.547 34.8038 19.8736C34.0437 20.4367 33.6016 20.4715 26.279 20.545Z"
      fill="#FFFFEB"
    />
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.2385 47.994C7.91691 48.0259 4.46962 47.9286 3.85225 47.7573C3.2757 47.5972 2.54951 47.254 2.2385 46.9945C1.92749 46.735 1.48946 46.1123 1.2651 45.6107C0.957437 44.9228 0.857178 42.9565 0.857178 37.6101C0.857178 31.9361 0.947817 30.3071 1.31136 29.4473C1.56116 28.8566 2.06658 28.1844 2.43451 27.9537C2.97358 27.6156 4.65478 27.5172 11.0924 27.4466C16.2883 27.3896 19.5124 27.4688 20.3142 27.6731C21.2861 27.9207 21.6553 28.2024 22.0592 29.0041C22.5038 29.8867 22.5715 31.043 22.5715 37.7553C22.5715 45.1563 22.5445 45.524 21.9455 46.2895C21.6012 46.7295 20.9274 47.2808 20.448 47.5146C19.7531 47.8535 18.0889 47.9507 12.2385 47.994Z"
      fill="#FFFFEB"
    />
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M40.7368 47.9949C36.4861 48.0243 32.9623 47.9238 32.3128 47.7546C31.6987 47.5947 30.8697 47.0949 30.4705 46.644C30.0016 46.1144 29.6752 45.2958 29.5485 44.3315C29.4405 43.5105 29.3974 39.9055 29.4526 36.3203C29.5383 30.7609 29.6301 29.6677 30.0764 28.8909C30.4573 28.228 30.9303 27.8954 31.8136 27.6693C32.5952 27.4693 35.8606 27.3899 40.9833 27.4463C47.4377 27.5174 49.0664 27.6141 49.6138 27.9586C49.9848 28.1922 50.4947 28.8965 50.7468 29.5239C51.1259 30.4675 51.1897 31.9448 51.116 38.0796C51.0318 45.0855 50.9925 45.5388 50.4036 46.2943C50.0607 46.7341 49.3896 47.2853 48.9122 47.5192C48.2195 47.8586 46.5689 47.9546 40.7368 47.9949Z"
      fill="#FFFFEB"
    />
  </Svg>
);

export default PlotSvg;