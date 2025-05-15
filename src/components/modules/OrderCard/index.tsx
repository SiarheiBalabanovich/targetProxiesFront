import { useEffect, useState } from "react";
import { getLastPurchase } from "src/core/services/lastPurchase";

import {
  ATTIcon,
  GlobalIcon,
  MapIcon,
  PortIcon,
  VarizonIcon,
} from "src/assets/images/icons/icons-ui.tsx";
import { formatDate } from "src/core/utils/helpers/formatDate.ts";
import { Skeleton } from "ui/skeleton.tsx";

interface LastPurchase {
  order_id: number;
  subscription_id: number;
  subscription_item_id: number;
  date_payment: string;
  amount: number;
  is_active: boolean;
  http_ip: string;
  http_port: number;
  socks5_ip: string;
  socks5_port: number;
  carrier_name: string;
  proxy_location: string;
}

export const OrderCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastPurchase, setLastPurchase] = useState<LastPurchase | null>(null);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          setLastPurchase(await getLastPurchase(token));
          setIsLoading(false);
        } catch (error) {
          console.log("getLastPurchase", error);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, []);

  return (
    <div className="bg-custom-gradient-3 py-6 px-7 max-tablet:px-6 rounded-xl">
      {isLoading ? (
        <>
          <Skeleton className="w-full h-[368px] rounded-xl" />
        </>
      ) : lastPurchase ? (
        <div className="flex-col justify-start items-start gap-6 flex">
          <div className="self-stretch justify-start items-center flex">
            <div className="h-[26px] justify-start items-center gap-5 flex">
              <div className="text-[#C2C6D1] text-sm font-medium uppercase leading-tight">
                ORDER #{lastPurchase.order_id}
              </div>
              <div className="px-2.5 py-1 bg-custom-gradient-9 rounded-[7px] custom-shadow-2 justify-center items-center gap-2.5 flex">
                <div
                  className={`w-1.5 h-1.5 ${lastPurchase.is_active ? "bg-[#31AA7A]" : "bg-red-400"} rounded-full`}
                />
                <div className="text-[#C2C6D1] text-xs font-medium leading-tight">
                  {lastPurchase.is_active ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-custom-gradient-5" />
          <div className="w-full flex-col justify-start items-start gap-6 flex">
            <div className="w-full flex-col justify-start items-start gap-4 flex">
              <div className="w-full justify-between items-start flex text-[#6F7279] text-sm uppercase leading-tight">
                <div>carrier</div>
                <div>location</div>
              </div>
              <div className="w-full justify-between items-center flex">
                <div className="justify-start items-start gap-2 flex text-[#C2C6D1]">
                  {lastPurchase.carrier_name === "ATT" ? (
                    <ATTIcon />
                  ) : lastPurchase.carrier_name === "VERIZON" ? (
                    <VarizonIcon className="max-w-20" />
                  ) : lastPurchase.carrier_name === "T-MOBILE" ? (
                    <div>T-Mobile</div>
                  ) : (
                    <div>None</div>
                  )}
                </div>
                <div className="justify-start items-center gap-1 flex">
                  <MapIcon className="w-5 h-5 text-[#00A2CA] " />
                  <div className="text-[#C2C6D1] font-medium">
                    {lastPurchase.proxy_location}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex-col justify-start items-start gap-4 flex">
              <div className="w-full justify-between items-start flex text-[#6F7279] text-sm uppercase leading-tight">
                <div>http</div>
                <div>PORT</div>
              </div>
              <div className="w-full justify-between items-center flex">
                <div className="justify-start items-start gap-2 flex text-[#C2C6D1]">
                  <GlobalIcon />
                  <div>{lastPurchase.http_ip.split("@")[1]}</div>
                </div>
                <div className="justify-start items-center gap-2 flex">
                  <PortIcon />
                  <div className="text-[#C2C6D1] font-medium">
                    <div>{lastPurchase.http_port}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex-col justify-start items-start gap-4 flex">
              <div className="w-full justify-between items-start flex text-[#6F7279] text-sm uppercase leading-tight">
                <div>socks 5</div>
                <div>PORT</div>
              </div>
              <div className="w-full justify-between items-center flex">
                <div className="justify-start items-start gap-2 flex text-[#C2C6D1]">
                  <GlobalIcon />
                  <div>{lastPurchase.socks5_ip.split("@")[1]}</div>
                </div>
                <div className="justify-start items-center gap-2 flex">
                  <PortIcon />
                  <div className="text-[#C2C6D1] font-medium">
                    <div>{lastPurchase.socks5_port}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-custom-gradient-5" />
          <div className="w-full justify-between items-center flex">
            <div className="h-5 justify-start items-center gap-4 flex">
              <div className="text-[#6F7279] text-sm uppercase leading-tight">
                last payment
              </div>
              <div className="text-[#C2C6D1] text-sm uppercase leading-tight">
                {formatDate(
                  lastPurchase.date_payment.replace(
                    /(\d{2})\/(\d{2})\/(\d{2})/,
                    "$2/$1/$3",
                  ),
                )}
              </div>
            </div>
            <div className="justify-start items-start gap-1 flex">
              <div className="text-[#C2C6D1] font-medium uppercase">
                ${lastPurchase.amount}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-[#C2C6D1] text-center font-medium mt-5">
            No active subscriptions
          </div>
        </div>
      )}
    </div>
  );
};
