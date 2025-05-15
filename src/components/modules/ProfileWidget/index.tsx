import React, { useEffect, useState } from "react";
import { DropdownIcon } from "src/assets/images/icons/icons-ui.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "ui/popover.tsx";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "ui/buttonVariants.tsx";
import type { VariantProps } from "class-variance-authority";
import { getUserInfo } from "src/core/services/auth";
import { useDispatch, useSelector } from "react-redux";
import { setStoreUserInfo } from "src/store/slices/userInfoSlice.ts";
import { AppState } from "src/store/store.ts";
import { getBalanceInfo } from "src/core/services/balance";
import { Skeleton } from "ui/skeleton.tsx";
import { cn } from "components/lib/utils.ts";
import { getActiveSubscription } from "src/core/services/activeSubscriptions";


interface ProfileWidgetProps {
  admin?: boolean;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const ProfileWidget: React.FC<ProfileWidgetProps> = (admin) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const dispatch = useDispatch();
  const [, setUserBalance] = useState({
    crypto_balance: 0,
    total_payment_per_month: 0,
    total_purchases: 0,
  });
  const userInfo = useSelector((state: AppState) => state.userInfo);
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const userInfo = await getUserInfo(token);
          dispatch(setStoreUserInfo(userInfo));
          setUserBalance(await getBalanceInfo(token));
          const subs = await getActiveSubscription(token, userInfo.id, 0, 1);
          setHasSubscription(subs.total > 0);
          setIsLoading(false);
        } catch (error) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    })();
  }, [dispatch]);

  return (
    <Popover>
      <PopoverTrigger>
        {isLoading ? (
          <>
            <Skeleton className="w-[195px] h-[40px] rounded-xl" />
          </>
        ) : (
          <div className="justify-start items-center gap-2.5 flex">
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-white uppercase rounded-full max-mobile-2:w-[32px] max-mobile-2:h-[32px]">
              <div>
                {userInfo.first_name.slice(0, 1)}{" "}
                {userInfo.last_name.slice(0, 1)}
              </div>
            </div>
            <div className="justify-start items-center gap-3 flex">
              <div className="flex-col justify-start items-start gap-2 flex">
                <div className="text-[#C2C6D1] text-sm leading-none">
                  {userInfo.first_name} {userInfo.last_name}
                </div>
                <div className="text-[#9B9A9D] text-xs leading-[11.14px] max-mobile-2:hidden">
                  {userInfo.email}
                </div>
              </div>

              <DropdownIcon className="w-6 h-6 text-[#9B9A9D]" />
            </div>
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent className="mr-10 w-[300px] p-4 bg-custom-gradient-3 rounded-xl shadow-custom-4 border border-[#0CF0CF10] justify-start items-start gap-2.5 flex max-mobile-2:mr-2.5">
        <div className="grow shrink basis-0 flex-col justify-start items-center gap-6 flex w-full">
          <div className="flex-col justify-center items-center gap-2.5 flex">
            <div className="justify-end items-center flex relative">
              <div className="w-[48px] h-[48px] flex items-center justify-center bg-white uppercase rounded-full max-mobile-2:w-[32px] max-mobile-2:h-[32px]">
                <div>
                  {userInfo.first_name.slice(0, 1)}{" "}
                  {userInfo.last_name.slice(0, 1)}
                </div>
              </div>
              {!admin.admin && (
                <Link
                  to="/dashboard/profile-orders"
                  className="w-6 h-6 p-1.5 bg-[#0E1626] rounded-[11px] justify-center items-center flex absolute bottom-0 right-[-4px]"
                >
                  <Pencil className="w-4 h-4 text-[#9B9A9D]" />
                </Link>
              )}
            </div>
            <div className="flex-col justify-start items-center gap-1 flex">
              <div className="w-[131px] h-4 text-center text-[#C2C6D1] text-xs leading-none">
                {userInfo.first_name} {userInfo.last_name}
              </div>
              <div className="w-[132px] h-3 text-center text-[#9B9A9D] text-xs leading-[11.14px]">
                {userInfo.email}
              </div>
            </div>
          </div>
          {!admin.admin && (
            <div className="flex-col justify-start items-center gap-4 flex w-full">
              <div className="w-full h-px bg-custom-gradient-5" />
              <div className="flex-col justify-start items-start gap-1 flex w-full">
                <div className="flex-col justify-start items-start gap-1 flex w-full">
                  <div className="text-zinc-500 text-xs uppercase leading-tight">
                    active subscription
                  </div>
                  <div className="justify-between items-center flex w-full">
                    <div className="justify-start items-center gap-0.5 flex w-full">
                      {/*<ATTIcon />*/}
                      {/* <div className="text-[#C2C6D1] text-sm font-medium leading-tight">
                        Not subscribed
                      </div> */}
                      <div className="text-[#C2C6D1] text-sm font-medium leading-tight">
                        {hasSubscription ? "Subscribed" : "Not subscribed"}
                      </div>

                    </div>
                    <Link
                      className={cn(
                        buttonVariants({ variant: "blue", size: "sm" }),
                      )}
                      to="/dashboard/subscriptions"
                    >
                      update
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-full h-px bg-custom-gradient-5" />
              {/*<div className="p-3 bg-custom-gradient-6 rounded-lg flex-col justify-start items-start gap-2.5 flex w-full">*/}
              {/*  <div className="justify-between items-start flex w-full">*/}
              {/*    <div className="text-[#9B9A9D] text-sm leading-tight">*/}
              {/*      Account Balance*/}
              {/*    </div>*/}
              {/*    <div className="opacity-80 text-[#31AA7A] text-sm font-medium leading-tight">*/}
              {/*      USDT {userBalance.crypto_balance}*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileWidget;
