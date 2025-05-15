import { Button } from "ui/button.tsx";
import {
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  LockKeyhole,
  Repeat2,
  Server,
  TicketPercent,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  CloseSvg,
  MapIcon,
  MasterCardIcon,
  TMobileIcon,
  VisaIcon,
} from "src/assets/images/icons/icons-ui.tsx";
import React from "react";
// import { Link } from "react-router-dom";
import { detailSubscription } from "src/core/models/interfaces";
import { differenceInDays, parse, startOfDay } from "date-fns";

interface SubscriptionDetailsProps {
  admin?: boolean;
  handleCancel: (id: number, subId: number) => void;
  detailSubscription: detailSubscription;
}

export const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({
  admin,
  handleCancel,
  detailSubscription,
}) => {
  const today = startOfDay(new Date());
  const renewalDate = parse(
    detailSubscription.renewal_date || detailSubscription.date_end,
    "dd/MM/yy",
    new Date(),
  );
  const paymentDate = parse(
    detailSubscription.payment_date,
    "dd/MM/yy",
    new Date(),
  );
  const daysUntilNextPayment = differenceInDays(renewalDate, today);

  const totalDaysInPeriod = differenceInDays(
    renewalDate,
    startOfDay(paymentDate),
  );
  let percentageFilled = 0;

  if (totalDaysInPeriod !== 0) {
    percentageFilled = Math.round(
      ((totalDaysInPeriod - daysUntilNextPayment) / totalDaysInPeriod) * 100,
    );
  } else {
    percentageFilled = 0;
  }

  return (
    <div className="w-full flex-col justify-start items-start gap-8 flex">
      <div className="w-full flex-col justify-start items-start gap-7 flex">
        <div className="w-full flex-col justify-start items-start gap-3 flex">
          <div className="w-full justify-between items-end flex max-mobile-2:flex-col max-mobile-2:items-start max-mobile-2:gap-5">
            <div className="justify-start items-end flex">
              <div className="text-[#D8DADF] text-[32px] font-semibold leading-9">
                ${detailSubscription.payment_item_per_month}
              </div>
              {detailSubscription.next_payment_days !== null && (
                <div className="text-[#9B9A9D] text-sm leading-tight">
                  /per {detailSubscription.period_str}
                </div>
              )}
            </div>
            {/*{!admin && (*/}
            {/*  <Button*/}
            {/*    variant="secondary"*/}
            {/*    size="xs"*/}
            {/*    className="text-[#9B9A9D] normal-case flex gap-2 items-center justify-center max-mobile-2:w-full"*/}
            {/*  >*/}
            {/*    <PencilIcon size="20" />*/}
            {/*    <span>Change plan</span>*/}
            {/*  </Button>*/}
            {/*)}*/}
          </div>
        </div>
        <div className="w-full flex-col justify-start items-start gap-3 flex">
          <div className="text-[#9B9A9D] text-xs leading-none">
            {detailSubscription.next_payment_days !== null ? (
              <>{daysUntilNextPayment} days until next payment</>
            ) : (
              <>{daysUntilNextPayment} days until the end of the subscription</>
            )}
          </div>
          <div className="w-full h-2 relative">
            <div className="w-full h-2 left-0 top-0 absolute bg-[#141927] rounded-[11px] shadow-inner" />
            <div
              style={{ width: `${percentageFilled}%` }}
              className={`h-2 left-0 top-0 absolute bg-custom-gradient-2 rounded-[11px] shadow`}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex-col justify-start items-start gap-5 flex">
        <div className="text-[#9B9A9D] font-medium uppercase">plan details</div>
        <div
          className={`w-full grid gap-2.5 ${admin ? "grid-cols-4" : "grid-cols-3"} max-mobile-2:grid-cols-2 max-mobile-3:grid-cols-1`}
        >
          <div className="flex-col justify-start items-start gap-6 flex">
            <div className="flex-col justify-start items-start gap-2 flex">
              <div className="text-[#6F7279] text-sm uppercase leading-tight">
                carrier
              </div>
              <div className="justify-start items-start gap-2 flex">
                {detailSubscription.modem_name === "T-MOBILE" ? (
                  <span>
                    <TMobileIcon className="max-w-20" />
                  </span>
                ) : detailSubscription.modem_name === "VERIZON" ? (
                  <span className="text-[#C2C6D1] flex gap-2 text-base">
                    <svg
                      width="22"
                      height="25"
                      viewBox="0 0 22 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.3547 0.0574457C18.6815 -0.0118974 20.0083 -0.0118974 21.3351 0.0227741C17.3547 8.2746 13.514 16.5958 9.63838 24.8823H6.39121C4.61051 20.7217 2.51557 16.6651 0.665039 12.5045C1.95692 12.4699 3.2488 12.4699 4.54068 12.5045C5.65799 15.0702 6.98478 17.5319 7.99733 20.0976C11.1048 13.406 14.3171 6.74905 17.3547 0.0574457Z"
                        fill="#FF0000"
                      />
                    </svg>
                    Verizon
                  </span>
                ) : (
                  <span className="text-[#C2C6D1] flex gap-2 text-base">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.64137 21.4779C6.67582 23.0534 9.2294 24 11.9999 24C15.0318 24 17.7957 22.8739 19.9052 21.0254C19.9308 21.0028 19.9181 20.9879 19.8929 21.0028C18.9464 21.6352 16.2485 23.0158 12 23.0158C8.30792 23.0158 5.97466 22.1917 4.65701 21.4559C4.6318 21.4434 4.62246 21.4624 4.64137 21.4779ZM12.8145 22.0913C15.7675 22.0913 19.0125 21.286 20.9533 19.6919C21.4844 19.2575 21.9902 18.6795 22.4433 17.9026C22.7041 17.4556 22.9592 16.9245 23.167 16.4025C23.1762 16.377 23.1605 16.3646 23.1414 16.3932C21.3366 19.0503 16.1103 20.7076 10.7139 20.7076C6.89952 20.7076 2.79532 19.4873 1.18849 17.1573C1.17267 17.1357 1.15686 17.1449 1.16649 17.1697C2.66336 20.3526 7.20452 22.0913 12.8145 22.0913ZM9.58803 16.8111C3.44635 16.8111 0.550414 13.9495 0.0250957 11.9966C0.0186175 11.9684 0 11.9746 0 12C0 12.6574 0.0657742 13.5058 0.178939 14.0689C0.232924 14.3431 0.455926 14.7732 0.782871 15.1162C2.27006 16.6669 5.97781 18.84 12.3991 18.84C21.1477 18.84 23.1481 15.9245 23.5566 14.9657C23.8487 14.2801 24 13.0409 24 12C24 11.7482 23.9937 11.547 23.9842 11.3494C23.9842 11.3174 23.9656 11.3148 23.9592 11.346C23.522 13.692 16.0473 16.8111 9.58803 16.8111ZM1.15686 6.85195C0.804931 7.55066 0.414839 8.72942 0.298873 9.33949C0.248039 9.60089 0.269692 9.72642 0.36132 9.92148C1.09744 11.484 4.82089 13.9839 13.5062 13.9839C18.8049 13.9839 22.9211 12.6816 23.588 10.3051C23.7108 9.86765 23.7174 9.40576 23.5596 8.78337C23.3833 8.08787 23.0532 7.27683 22.7739 6.70733C22.7646 6.68877 22.7484 6.69151 22.7517 6.71346C22.8555 9.83046 14.1667 11.8393 9.78267 11.8393C5.03403 11.8393 1.07235 9.94659 1.07235 7.55662C1.07235 7.32698 1.11985 7.09729 1.17915 6.85826C1.1851 6.83642 1.16643 6.8328 1.15686 6.85195ZM19.9246 3.02492C19.975 3.10398 20.0002 3.18835 20.0002 3.30191C20.0002 4.63521 15.9212 6.99389 9.42801 6.99389C4.65701 6.99389 3.76378 5.22328 3.76378 4.09724C3.76378 3.69473 3.91809 3.28287 4.25793 2.8646C4.27649 2.83972 4.26073 2.83015 4.23931 2.84866C3.61844 3.37498 3.05257 3.963 2.55043 4.60368C2.31173 4.90554 2.16355 5.17295 2.16355 5.33316C2.16355 7.66667 8.01237 9.35858 13.4812 9.35858C19.3083 9.35858 21.9089 7.45555 21.9089 5.78314C21.9089 5.18544 21.6764 4.83653 21.0814 4.16007C20.6952 3.72001 20.33 3.36169 19.9433 3.00898C19.9246 2.99357 19.9116 3.00612 19.9246 3.02492ZM18.1382 1.69191C16.3398 0.613521 14.2515 0 12 0C9.73289 0 7.5816 0.634949 5.77675 1.74189C5.23538 2.07522 4.93067 2.34233 4.93067 2.6857C4.93067 3.69788 7.29522 4.7862 11.4902 4.7862C15.6417 4.7862 18.8617 3.59413 18.8617 2.44667C18.8617 2.17278 18.6224 1.98116 18.1382 1.69191Z"
                        fill="#00A8E0"
                      />
                    </svg>
                    AT&T
                  </span>
                )}
              </div>
            </div>
            <div className="flex-col justify-start items-start gap-2 flex">
              <div className="text-[#6F7279] text-sm uppercase leading-tight">
                location
              </div>
              <div className="justify-start items-center gap-1 flex">
                <MapIcon className="w-5 h-5 text-[#00A2CA]" />
                <div className="text-[#C2C6D1] font-medium">
                  {detailSubscription.proxy_location}
                </div>
              </div>
            </div>
          </div>
          {admin ? (
            <>
              <div className="flex-col justify-start items-start gap-6 flex">
                <div className="flex-col justify-start items-start gap-2 flex">
                  <div className="text-[#6F7279] text-sm uppercase leading-tight">
                    discount coupon
                  </div>
                  <div className="justify-start items-center gap-1 flex">
                    <TicketPercent className="w-5 h-5 relative text-[#00A2CA]" />
                    <div className="text-[#C2C6D1] font-medium">
                      {detailSubscription.discount
                        ? detailSubscription.discount + "%"
                        : "-"}
                    </div>
                  </div>
                </div>
                <div className="flex-col justify-start items-start gap-2 hidden h-0 opacity-0 pointer-events-none">
                  <div className="text-[#6F7279] text-sm uppercase leading-tight">
                    auto rotation
                  </div>
                  <div className="justify-start items-center gap-1 flex">
                    <Repeat2 className="w-5 h-5 text-[#00A2CA]" />
                    <div className="text-[#C2C6D1] font-medium">Disabled</div>
                  </div>
                </div>
              </div>
              <div className="flex-col justify-start items-start gap-6 flex">
                <div className="flex-col justify-start items-start gap-2 flex">
                  <div className="text-[#6F7279] text-sm uppercase leading-tight">
                    username
                  </div>
                  <div className="justify-start items-center gap-1 flex">
                    <UserRound className="w-5 h-5 relative text-[#00A2CA]" />
                    <div className="text-[#C2C6D1] font-medium">
                      {detailSubscription.login}
                    </div>
                  </div>
                </div>
                <div className="flex-col justify-start items-start gap-2 flex">
                  <div className="text-[#6F7279] text-sm uppercase leading-tight">
                    password
                  </div>
                  <div className="justify-start items-center gap-1 flex">
                    <LockKeyhole className="w-5 h-5 text-[#00A2CA]" />
                    <div className="text-[#C2C6D1] font-medium">
                      {detailSubscription.password}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-col justify-start items-start gap-6 flex">
                <div className="flex-col justify-start items-start gap-2 flex">
                  <div className="text-[#6F7279] text-sm uppercase leading-tight">
                    host ip:port
                  </div>
                  <div className="justify-start items-center gap-1 flex">
                    <Server className="w-5 h-5 relative text-[#00A2CA]" />
                    <div className="text-[#C2C6D1] font-medium">
                      verizon.targetedproxies.com:30000
                    </div>
                  </div>
                </div>
                <div className="flex-col justify-start items-start gap-2 flex">
                  <div className="text-[#6F7279] text-sm uppercase leading-tight">
                    status
                  </div>
                  <div className="min-w-[75px] h-7 px-2.5 py-1 bg-[#0F211A] rounded-[7px] justify-center items-center gap-2.5 inline-flex">
                    <div className="text-emerald-500 text-sm leading-tight">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-col justify-start items-start gap-6 flex">
                <div className="flex-col justify-start items-start gap-2 flex">
                  <div className="text-[#6F7279] text-sm uppercase leading-tight">
                    Payment Method
                  </div>
                  <div className="justify-start items-center gap-1 flex">
                    <CreditCard className="w-5 h-5 relative text-[#00A2CA]" />
                    {detailSubscription?.payment_method &&
                    detailSubscription?.payment_method.brand ? (
                      detailSubscription.payment_method.brand === "visa" ? (
                        <VisaIcon />
                      ) : detailSubscription?.payment_method.brand ===
                        "mastercard" ? (
                        <MasterCardIcon />
                      ) : (
                        <div className="text-[#C2C6D1] font-medium">
                          {detailSubscription?.payment_method.brand}
                        </div>
                      )
                    ) : (
                      <div className="text-[#C2C6D1] font-medium">
                        Not payment
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-col justify-start items-start gap-2 flex">
                  <div className="text-[#6F7279] text-sm uppercase leading-tight">
                    Subscription length
                  </div>
                  <div className="justify-start items-center gap-1 flex">
                    <CalendarDays className="w-5 h-5 text-[#00A2CA]" />
                    <div className="text-[#C2C6D1] font-medium">
                      {detailSubscription.period_str}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-col justify-start items-start gap-6 flex">
                <div className="flex-col justify-start items-start gap-6 flex">
                  <div className="flex-col justify-start items-start gap-2 flex">
                    <div className="text-[#6F7279] text-sm uppercase leading-tight">
                      last payment
                    </div>
                    <div className="flex-col justify-start items-start gap-3 flex">
                      <div className="justify-start items-start gap-2 flex">
                        <Wallet className="w-5 h-5 text-[#00A2CA]" />
                        <div className="text-[#C2C6D1] text-sm font-medium uppercase leading-tight">
                          {detailSubscription.payment_date.replace(
                            /(\d{2})\/(\d{2})\/(\d{2})/,
                            "$2/$1/$3",
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-col justify-start items-start gap-6 flex">
                  <div className="flex-col justify-start items-start gap-2 flex">
                    <div className="text-[#6F7279] text-sm uppercase leading-tight">
                      amount
                    </div>
                    <div className="flex-col justify-start items-start gap-3 flex">
                      <div className="justify-start items-start gap-2 flex">
                        <CircleDollarSign className="w-5 h-5 text-[#00A2CA]" />
                        <div className="text-[#C2C6D1] text-sm font-medium uppercase leading-tight">
                          ${detailSubscription.amount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {detailSubscription.renewal_date !== null && (
        <div className="w-full flex-col justify-start items-start gap-3 flex">
          <div className="text-[#9B9A9D] font-medium uppercase">
            renewal date
          </div>
          <div>
            <span className="text-[#C2C6D1] text-sm">
              You subscription will renewal on{" "}
            </span>
            <span className="text-[#F7F7F7] text-sm font-medium">
              {detailSubscription.renewal_date}
            </span>
          </div>
        </div>
      )}
      <div
        className={`w-full items-center flex gap-5 ${admin ? "justify-start" : "justify-between"} max-mobile-2:flex-col`}
      >
        {admin ? (
          <>
            {/*<Link*/}
            {/*  to="subscription"*/}
            {/*  className="whitespace-nowrap rounded-[7px] font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-transparent border-[1px] border-[#22293B] hover:bg-transparent/80 h-10 px-4 py-2.5 text-sm text-[#9B9A9D] normal-case flex gap-2 items-center justify-center max-mobile-2:w-full"*/}
            {/*>*/}
            {/*  <PencilIcon size="20" />*/}
            {/*  <span>Edit</span>*/}
            {/*</Link>*/}
            <Button
              variant="secondary"
              onClick={() =>
                handleCancel(
                  detailSubscription.subscription_id,
                  detailSubscription.subscription_item_id,
                )
              }
              size="xs"
              className="text-[#D45858] normal-case flex gap-2 items-center justify-center max-mobile-2:w-full"
            >
              <CloseSvg size="20" className="w-5 h-5" />
              <span> Cancel Subscription</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={() =>
                handleCancel(
                  detailSubscription.subscription_id,
                  detailSubscription.subscription_item_id,
                )
              }
              size="xs"
              className="text-[#D45858] normal-case flex gap-2 items-center justify-center max-mobile-2:w-full"
            >
              <CloseSvg size="20" className="w-5 h-5" />
              <span> Cancel Subscription</span>
            </Button>
            {/*<Button*/}
            {/*  variant="blue"*/}
            {/*  size="xs"*/}
            {/*  className="px-6 max-mobile-2:w-full"*/}
            {/*>*/}
            {/*  update*/}
            {/*</Button>*/}
          </>
        )}
      </div>
    </div>
  );
};
