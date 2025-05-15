import {
  BillingIcon,
  PurchasesIcon,
} from "src/assets/images/icons/icons-ui.tsx";
import { useEffect, useState } from "react";
import { getBalanceInfo } from "src/core/services/balance";
import { Skeleton } from "ui/skeleton.tsx";
import { ActiveSubscriptions } from "components/modules/ActiveSubscriptions";


export const UserBalance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userBalance, setUserBalance] = useState({
    total_payment_per_month: 0,
    total_purchases: 0,
  });

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          setUserBalance(await getBalanceInfo(token));
          setIsLoading(false);
        } catch (error) {
          console.log("setUserBalance - Error");
        }
      }
    })();
  }, []);

  return (
    <>
      {isLoading ? (
        <Skeleton className="w-full h-[138px] rounded-xl" />
      ) : (
        <div className="flex gap-6 max-mobile-2:flex-col max-mobile-2:gap-5 max-mobile-1:grid max-mobile-1:grid-cols-2 max-mobile-2:grid-cols-1">
          {/* Billing */}
          <div className="relative w-full overflow-hidden bg-custom-gradient-3 rounded-[7px] px-7 py-5 max-mobile-1:px-6">
            <BillingIcon className="absolute right-[-10px] bottom-0 w-[140px] h-[140px] opacity-[0.02] text-[#C2C6D1]" />
            <div className="w-full flex-col justify-start items-start gap-3 flex">
              <div className="w-full justify-between items-center flex">
                <div className="text-[#9B9A9D] font-medium uppercase">Billing</div>
                <div className="w-10 h-10 flex justify-center items-center bg-[#212A38] rounded-[12px]">
                  <BillingIcon className="w-6 h-6 text-[#C2C6D1]" />
                </div>
              </div>
              <div className="justify-start items-end gap-1.5 flex">
                <div className="text-cyan-500 text-[42px] font-bold leading-[46px] max-mobile-2:text-[32px] max-mobile-2:leading-[36px]">
                  ${userBalance.total_payment_per_month}
                </div>
                <div className="text-neutral-400 text-xs leading-tight max-mobile-2:leading-[18px]">
                  /per month
                </div>
              </div>
            </div>
          </div>

          {/* Active Subscriptions */}
          <div className="relative w-full overflow-hidden bg-custom-gradient-3 rounded-[7px] px-7 py-5 max-mobile-1:px-6">
            <div className="w-full flex-col justify-start items-start gap-3 flex">
              <div className="w-full justify-between items-center flex">
                <div className="text-[#9B9A9D] font-medium uppercase">Active Subscriptions</div>
              </div>
              <ActiveSubscriptions perPage={1} />
            </div>
          </div>

          {/* Total Purchases */}
          <div className="relative w-full overflow-hidden bg-custom-gradient-3 rounded-[7px] px-7 py-5 max-mobile-1:px-6">
            <BillingIcon className="absolute right-[-10px] bottom-0 w-[140px] h-[140px] opacity-[0.02] text-[#C2C6D1]" />
            <div className="w-full flex-col justify-start items-start gap-3 flex">
              <div className="w-full justify-between items-center flex">
                <div className="text-[#9B9A9D] font-medium uppercase">Total Purchases</div>
                <div className="w-10 h-10 flex justify-center items-center bg-[#212A38] rounded-[12px]">
                  <PurchasesIcon className="w-6 h-6 text-[#C2C6D1]" />
                </div>
              </div>
              <div className="justify-start items-end gap-1.5 flex">
                <div className="text-cyan-500 text-[42px] font-bold leading-[46px] max-mobile-2:text-[32px] max-mobile-2:leading-[36px]">
                  {userBalance.total_purchases}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};