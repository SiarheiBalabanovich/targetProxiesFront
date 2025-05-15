import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "src/store/store";
import { toggleMenu } from "src/store/actions/mobMenuAction";

import ProfileWidget from "components/modules/ProfileWidget";
import NotificationWidget from "components/modules/NotificationWidget";

interface HeaderProps {
  title: string;
  admin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, admin }) => {
  const isMenuOpen = useSelector((state: AppState) => state.menu.isMenuOpen);

  const dispatch = useDispatch<AppDispatch>();
  const handleToggleMenu = () => {
    dispatch(toggleMenu());
  };

  return (
    <header className="max-w-[1416px]">
      <div className="flex justify-between items-center max-tablet:flex-col-reverse gap-6 w-full">
        <div className="flex items-end max-1024:mr-auto max-mobile-2:w-full">
          <div className="text-neutral-400 text-sm font-normal">Dashboard/</div>
          <div className="text-gray-300 text-2xl font-medium leading-[25px] max-mobile-2:text-xl">
            {title}
          </div>
        </div>

        <div className="relative custom-gradient-3 border-[1px] border-[#1F86FF21] rounded-[63px] px-5 py-2 justify-center items-center gap-5 flex max-mobile-2:px-2.5 max-sm:w-full">
          <div
            className="hidden w-9 h-9 relative cursor-pointer max-tablet:inline-flex"
            onClick={handleToggleMenu}
          >
            <div className={`w-8 h-[21px] left-[2px] top-[7px] absolute`}>
              <div
                className={`h-[3px] absolute bg-[#9B9A9D] rounded-[5px] transition-all ${isMenuOpen ? "w-8 left-0 top-[9px] rotate-45" : "w-4 left-0 top-[18px]"}`}
              />
              <div
                className={`h-[3px] absolute bg-[#9B9A9D] rounded-[5px] transition-all ${isMenuOpen ? "w-8 left-0 top-[9px] -rotate-45" : "w-4 left-[16px] top-0"}`}
              />
              <div
                className={`h-[3px] absolute bg-[#9B9A9D] rounded-[5px] transition-all left-0 top-[9px] ${isMenuOpen ? "w-0" : "w-8"}`}
              />
            </div>
          </div>
          <NotificationWidget />
          <ProfileWidget admin={admin} />
        </div>
      </div>
    </header>
  );
};

export default Header;
