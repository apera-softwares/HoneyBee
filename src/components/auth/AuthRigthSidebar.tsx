import React from 'react';
import GridImageTop from '../assets/authImages/authGridCirclesTop.png';
import GridImageBottom from '../assets/authImages/authGridCirclesBottom.png';
import MobileImage from '../assets/authImages/auth-image.png';
import Image from 'next/image';

const AuthRigthSidebar = () => {
  return (
    <div className="h-full w-full rounded-xl bg-gradient-to-b from-orange-500 to-amber-400 relative shadow-lg overflow-hidden">
      {/* Top Right Image */}
      <div className="absolute top-0 right-0 w-[428px] h-[428px] overflow-hidden">
        <Image
          src={GridImageTop}
          alt="Top Right"
          fill
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Full Width Heading - Centered Text */}
      <div className="absolute w-full top-14 text-center z-10 px-4">
        <h1 className="text-white text-5xl drop-shadow-lg">WELCOME TO</h1>
        <h1 className="text-white text-5xl font-bold drop-shadow-lg">HONEYBEE HARRY!</h1>
      </div>

      {/* Mobile Image Stuck to Bottom */}
      <div className="absolute w-full h-full overflow-hidden">
        <Image
          src={MobileImage}
          alt="Bottom Center"
          fill
          className="w-full h-full object-cover object-bottom"
        />
      </div>


      {/* Bottom Left Image */}
      <div className="absolute bottom-0 left-0 w-[428px] h-[428px] overflow-hidden">
        <Image
          src={GridImageBottom}
          alt="Bottom Left"
          fill
          className="w-full h-full object-cover object-bottom"
        />
      </div>
    </div>
  );
};

export default AuthRigthSidebar;
