import React from "react";

import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import { ActiveSubscriptions } from "src/components/modules/ActiveSubscriptions";
import { Orders } from "src/components/modules/Orders";
import { UserBalance } from "src/components/modules/UserBalance";
import { UpcomingPayment } from "src/components/modules/UpcomingPayment";
import { OrderCard } from "src/components/modules/OrderCard";
import { useSelector } from "react-redux";
import { AppState } from "src/store/store.ts";

const ClientOverview: React.FC = () => {
  const userInfo = useSelector((state: AppState) => state.userInfo);

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={1} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="Overview" />
        <div className="flex flex-col gap-[54px] w-full max-w-[1416px] max-tablet:gap-4">
          <div className="justify-start items-center flex">
            <div className="text-neutral-400 text-4xl font-medium leading-[32px] max-tablet:text-2xl max-tablet:leading-normal">
              Welcome back, {userInfo !== null ? userInfo.first_name : ""}!
            </div>
          </div>
          <div className="grid grid-cols-4 gap-x-6 gap-y-9 grid-rows-none max-1500:flex max-1500:flex-col">
            <div className="col-start-1 col-span-3 row-start-1 row-span-1">
              <UserBalance />
            </div>
            <div className="col-start-4 col-span-1 row-start-1 row-span-3">
              <div className="w-full flex flex-col gap-7">
                <UpcomingPayment />
                <OrderCard />
              </div>
            </div>
            <div className="col-start-1 col-span-3 row-start-2 row-span-3">
              <div className="w-full flex flex-col gap-9">
                <div className="flex flex-col gap-5">
                  <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
                    Active Subscriptions
                  </div>
                  <div className="w-full bg-custom-gradient-3 rounded-[7px] px-10 pb-4 max-1650:px-4">
                    <div className="w-full flex-col justify-start items-center gap-5 flex">
                      <ActiveSubscriptions />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
                    Latest Orders
                  </div>
                  <div className="w-full bg-custom-gradient-3 rounded-[7px] px-10 pb-4 max-1650:px-4">
                    <div className="w-full flex-col justify-start items-center gap-[39px] inline-flex">
                      <div className="w-full flex-col justify-start items-start gap-6 flex">
                        <Orders />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;
