import { useSelector } from "react-redux";
import { AppState } from "src/store/store.ts";
import { Link } from "react-router-dom";
import { openModal } from "src/store/actions/modalActions";
import { useAppDispatch } from "src/hooks/useAppDispatch";

import { closeMenu } from "src/store/actions/mobMenuAction";

import {
  AnalyticsIcon,
  ApiIcon,
  DashboardIcon,
  LogoutIcon,
  PagesIcon,
  PaymentIcon,
  ProfileIcon,
  ProxyIcon,
  SubscriptionsIcon,
  SupportIcon,
  UsersIcon,
} from "src/assets/images/icons/icons-ui.tsx";
import { logoV1 } from "src/assets/images/icons/img-ui.ts";
import React from "react";
import { Button } from "ui/button.tsx";
import { AddProxy } from "src/components/modules/AddProxy";
import { ChevronDown, ChevronLeft } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

interface SidebarProps {
  activeMenu: number;
  admin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, admin }) => {
  const isMenuOpen = useSelector((state: AppState) => state.menu.isMenuOpen);

  const handleCloseMenu = () => {
    dispatch(closeMenu());
  };

  const dispatch = useAppDispatch();

  const handleClick = (): void => {
    dispatch(openModal());
  };
  return (
    <div
      className={`max-tablet:absolute transition ${isMenuOpen ? "w-[300px] left-0 z-10 bg-[#141110]" : "left-[-100%]"}`}
    >
      <div
        onClick={handleCloseMenu}
        className={`${isMenuOpen && "fixed top-0 left-0 right-0 bottom-0 bg-black/30 z-[1]"}`}
      />
      <div
        onClick={handleCloseMenu}
        className="cursor-pointer absolute z-20 top-[65px] right-[-6px] border-[6px] border-solid border-[#141110] hidden text-[#C2C6D1] w-11 h-11 bg-custom-gradient-16 rounded-full justify-center items-center max-tablet:inline-flex"
      >
        <ChevronLeft />
      </div>
      <div className="relative min-h-lvh h-full w-full max-w-[280px] py-3 bg-custom-gradient-4 z-10 shadow-custom max-tablet:max-w-[300px]">
        <div className="flex-col justify-start items-start flex gap-[50px]">
          <div className="flex justify-center w-full max-tablet:max-w-[100px] max-tablet:mx-2 max-tablet:mt-12">
            <Link to={`${admin ? "/admin" : "/dashboard"}`} className="">
              <img src={logoV1} alt="Logo" />
            </Link>
          </div>
          <div className="flex-col justify-start items-start gap-[46px] flex max-tablet:gap-[36px] max-tablet:w-full">
            <div className="flex-col justify-start items-start gap-[46px] flex max-tablet:gap-[36px] max-tablet:w-full">
              <div className="flex-col justify-start items-start gap-5 flex">
                {admin ? (
                  <>
                    <div className="justify-start items-center gap-5 flex">
                      <div
                        className={`w-1 h-[52px] rounded-tr rounded-br ${activeMenu == 6 && "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
                      />
                      <Link
                        to={"/admin"}
                        className={`min-w-[210px] flex items-center gap-3 p-3 rounded-[4px] ${activeMenu == 6 ? "bg-gradient-to-r from-[#2755AF2C] to-[#0085FF99] text-white" : "text-[#9B9A9D]"}`}
                      >
                        <AnalyticsIcon />
                        Analytics
                      </Link>
                    </div>
                    <div className="justify-start items-center gap-5 flex">
                      <div
                        className={`w-1 h-[52px] rounded-tr rounded-br ${activeMenu == 7 && "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
                      />
                      <Link
                        to={"/admin/user-profiles"}
                        className={`min-w-[210px] flex items-center gap-3 p-3 rounded-[4px] ${activeMenu == 7 ? "bg-gradient-to-r from-[#2755AF2C] to-[#0085FF99] text-white" : "text-[#9B9A9D]"}`}
                      >
                        <UsersIcon />
                        User Profiles
                      </Link>
                    </div>
                    <Collapsible defaultOpen={true} className="flex flex-col">
                      <CollapsibleTrigger>
                        <div className="justify-start items-center gap-5 flex">
                          <div
                            className={`w-1 h-[52px] rounded-tr rounded-br`}
                          />
                          <div
                            className={`min-w-[210px] flex items-center gap-3 p-3 rounded-[4px] text-[#9B9A9D] whitespace-nowrap`}
                          >
                            <PaymentIcon />
                            Payment & Order
                            <ChevronDown className="#9B9A9D w-6 h-6" />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="flex-col justify-start items-start gap-5 flex ml-auto">
                        <div className="justify-end w-full pr-6 items-center flex mt-5">
                          <div
                            className={`w-0.5 h-[36px] rounded-tl rounded-bl ${activeMenu == 8 && "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
                          />
                          <Link
                            to={"/admin/orders"}
                            className={`min-w-[172px] flex items-center gap-3 px-4 py-1.5 rounded-[4px] rounded-tl-none rounded-bl-none ${activeMenu == 8 ? "bg-gradient-to-r from-[#2755AF2C] to-[#0085FF99] text-white" : "text-[#9B9A9D]"}`}
                          >
                            Orders
                          </Link>
                        </div>
                        <div className="justify-end w-full pr-6 items-center flex">
                          <div
                            className={`w-0.5 h-[36px] rounded-tl rounded-bl ${activeMenu == 9 && "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
                          />
                          <Link
                            to={"/admin/discounts"}
                            className={`min-w-[172px] flex items-center gap-3 px-4 py-1.5 rounded-[4px] rounded-tl-none rounded-bl-none ${activeMenu == 9 ? "bg-gradient-to-r from-[#2755AF2C] to-[#0085FF99] text-white" : "text-[#9B9A9D]"}`}
                          >
                            Discounts
                          </Link>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <div className="justify-start items-center gap-5 flex">
                      <div
                        className={`w-1 h-[52px] rounded-tr rounded-br ${activeMenu == 10 && "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
                      />
                      <Link
                        to={"/admin/pages"}
                        className={`min-w-[210px] flex items-center gap-3 p-3 rounded-[4px] ${activeMenu == 10 ? "bg-gradient-to-r from-[#2755AF2C] to-[#0085FF99] text-white" : "text-[#9B9A9D]"}`}
                      >
                        <PagesIcon />
                        Pages
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="justify-start items-center gap-5 flex">
                      <div
                        className={`w-1 h-[52px] rounded-tr rounded-br ${activeMenu == 1 && "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
                      />
                      <Link
                        to={"/dashboard"}
                        className={`min-w-[210px] flex items-center gap-3 p-3 rounded-[4px] ${activeMenu == 1 ? "bg-gradient-to-r from-[#2755AF2C] to-[#0085FF99] text-white" : "text-[#9B9A9D]"}`}
                      >
                        <DashboardIcon />
                        Overview
                      </Link>
                    </div>
                    <div className="justify-start items-center gap-5 flex">
                      <div
                        className={`w-1 h-[52px] rounded-tr rounded-br ${activeMenu == 2 && "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
                      />
                      <Link
                        to={"/dashboard/my-proxies"}
                        className={`min-w-[210px] flex items-center gap-3 p-3 rounded-[4px] ${activeMenu == 2 ? "bg-gradient-to-r from-[#2755AF2C] to-[#0085FF99] text-white" : "text-[#9B9A9D]"}`}
                      >
                        <ProxyIcon />
                        My Proxies
                      </Link>
                    </div>
                    <div className="justify-start items-center gap-5 flex">
                      <div
                        className={`w-1 h-[52px] rounded-tr rounded-br ${activeMenu == 3 && "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
                      />
                      <Link
                        to={"/dashboard/profile-orders"}
                        className={`min-w-[210px] flex items-center gap-3 p-3 rounded-[4px] ${activeMenu == 3 ? "bg-gradient-to-r from-[#2755AF2C] to-[#0085FF99] text-white" : "text-[#9B9A9D]"}`}
                      >
                        <ProfileIcon />
                        Profile and Orders
                      </Link>
                    </div>
                    <div className="justify-start items-center gap-5 flex">
                      <div
                        className={`w-1 h-[52px] rounded-tr rounded-br ${activeMenu == 4 && "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
                      />
                      <Link
                        to={"/dashboard/subscriptions"}
                        className={`min-w-[210px] flex items-center gap-3 p-3 rounded-[4px] ${activeMenu == 4 ? "bg-gradient-to-r from-[#2755AF2C] to-[#0085FF99] text-white" : "text-[#9B9A9D]"}`}
                      >
                        <SubscriptionsIcon />
                        Subscriptions
                      </Link>
                    </div>
                    <div className="justify-start items-center gap-5 flex">
                      <div
                        className={`w-1 h-[52px] rounded-tr rounded-br ${activeMenu == 5 && "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
                      />
                      <Link
                        to={"/dashboard/api-documentation"}
                        className={`min-w-[210px] flex items-center gap-3 p-3 rounded-[4px] ${activeMenu == 5 ? "bg-gradient-to-r from-[#2755AF2C] to-[#0085FF99] text-white" : "text-[#9B9A9D]"}`}
                      >
                        <ApiIcon />
                        Api Documentation
                      </Link>
                    </div>
                  </>
                )}
              </div>
              {!admin && (
                <>
                  <div className="w-full p-2.5 flex-col justify-start items-start gap-2.5 flex">
                    <div className="max-w-[232px] w-full h-px bg-custom-gradient-5 rounded-[3px] max-tablet:max-w-full" />
                  </div>
                  <div className="max-w-[180px] flex-col justify-center m-auto items-center gap-10 flex">
                    {/*<Button className="w-full" variant="blue">*/}
                    {/*  <PlusIcon className="w-5 h-5" /> add crypto*/}
                    {/*</Button>*/}
                    <Link
                      className="w-full"
                      to={"http://targetedproxies-dev.com/contact/"}
                    >
                      <Button className="w-full" variant="blue">
                        contact us
                      </Button>
                    </Link>

                    <Button className="w-full" onClick={handleClick}>
                      buy new proxy
                    </Button>
                  </div>
                </>
              )}
              <div className="w-full p-2.5 flex-col justify-start items-start gap-2.5 flex">
                <div className="max-w-[232px] w-full h-px bg-custom-gradient-5 rounded-[3px] max-tablet:max-w-full" />
              </div>
            </div>
            <div className="flex-col justify-start items-start gap-5 flex">
              <div className="justify-start items-center gap-5 flex">
                <div className="w-1 h-[52px] rounded-tr rounded-br" />
                <Link
                  to={"mailto:Targetedproxies@Gmail.com"}
                  className="min-w-[210px] flex items-center gap-3 p-3 rounded-[4px] text-[#9B9A9D]"
                >
                  <SupportIcon />
                  Support
                </Link>
              </div>
              <div className="justify-start items-center gap-5 flex">
                <div className="w-1 h-[52px] rounded-tr rounded-br" />
                <Link
                  to={"/login"}
                  onClick={() => {
                    localStorage.removeItem("authToken");
                  }}
                  className="min-w-[210px] flex items-center gap-3 p-3 rounded-[4px] text-[#9B9A9D]"
                >
                  <LogoutIcon />
                  Log Out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddProxy />
    </div>
  );
};

export default Sidebar;
