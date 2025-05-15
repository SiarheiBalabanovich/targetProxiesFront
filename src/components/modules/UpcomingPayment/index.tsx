import { MapIcon } from "src/assets/images/icons/icons-ui.tsx";
import { getUpcomingPurchases } from "src/core/services/upcomingPurchases";
import { useEffect, useState } from "react";
import { upcomingPurchase } from "src/core/models/interfaces";
import { Skeleton } from "ui/skeleton.tsx";

export const UpcomingPayment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingPayment, setUpcomingPayment] = useState<
    upcomingPurchase[] | null
  >(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          setUpcomingPayment(await getUpcomingPurchases(token));
          setIsLoading(false);
        } catch (error) {
          console.log("setUpcomingPayment - Error");
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (!upcomingPayment) return;
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % upcomingPayment.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [upcomingPayment]);

  return (
    <div className="w-full relative bg-custom-gradient-8 rounded-xl p-6 flex flex-col gap-6 max-tablet:px-6">
      {isLoading ? (
        <>
          <Skeleton className="w-full h-[180px] rounded-xl" />
        </>
      ) : upcomingPayment ? (
        upcomingPayment.length > 0 &&
        upcomingPayment.map((item, index) => (
          <div
            key={index}
            className={`w-full flex-col justify-start items-start gap-6 inline-flex ${index !== activeSlide ? "hidden" : ""}`}
          >
            <div className="text-[#D8DADF] text-sm leading-tight">
              Upcoming payment
            </div>
            <div className="w-full flex-col justify-start items-start gap-3 flex">
              <div className="w-full justify-between items-end flex">
                <div className="text-[#D8DADF] text-[22px] font-semibold leading-7">
                  {item.carrier_name}
                </div>
                <div className="justify-start items-center gap-1 flex text-[#C2C6D1]">
                  <MapIcon className="w-5 h-5" />
                  <div className="text-sm font-medium leading-tight">
                    {item.proxy_location}
                  </div>
                </div>
              </div>
              <div>
                <span className="text-[#C2C6D1] text-sm leading-tight">
                  You have{" "}
                </span>
                <span className="text-[#D45858] text-sm leading-tight">
                  {item.days_left} days left
                </span>
                <span className="text-[#C2C6D1] text-sm leading-tight">
                  {" "}
                  until your next <br />
                  payment
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center items-center min-h-[207px] text-[#D8DADF] text-sm leading-tight">
          No upcoming payments
        </div>
      )}
      <div className="w-[30px] h-1.5 justify-start items-start gap-1.5 flex ml-auto">
        {upcomingPayment ? (
          upcomingPayment.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 ${index === activeSlide ? "bg-[#4285F4]" : "bg-[#1C3AA9]"} rounded-full`}
            />
          ))
        ) : (
          <div>
            <div></div>
          </div>
        )}
      </div>
    </div>
  );
};
