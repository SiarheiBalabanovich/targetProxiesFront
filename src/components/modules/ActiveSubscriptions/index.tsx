import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/table.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select.tsx";
import { MasterCardIcon, VisaIcon } from "src/assets/images/icons/icons-ui.tsx";
import { Button } from "ui/button.tsx";
import { getActiveSubscription } from "src/core/services/activeSubscriptions";
import { useSelector } from "react-redux";
import { AppState } from "src/store/store.ts";
import PaginationList from "components/modules/Pagination";
import { subscriptionListProps } from "src/core/models/interfaces";
import { Skeleton } from "ui/skeleton.tsx";
import { renewBuy } from "src/core/services/renewBuy";

type ActiveSubscriptionsProps = {
  perPage?: number;
};

export const ActiveSubscriptions: React.FC<ActiveSubscriptionsProps> = ({
  perPage,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] =
    useState<subscriptionListProps | null>(null);
  const userId = useSelector((state: AppState) => state.userInfo.id);
  const itemsPerPage = perPage ? perPage : 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = activeSubscriptions?.total
    ? Math.ceil(activeSubscriptions.total / itemsPerPage)
    : 0;
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const renewBuySubmit = async (
    id: number,
    duration: string,
    amount: number,
  ) => {
    const [durationCount, durationUnit] = duration.split(" ");
    console.log(durationCount, durationUnit);
    await renewBuy(id, durationUnit, parseInt(durationCount, 10), amount)
      .then((response) => {
        alert(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token && userId !== 0) {
        try {
          const activeSubscriptionsList = await getActiveSubscription(
            token,
            userId,
            (currentPage - 1) * itemsPerPage,
            itemsPerPage,
          );
          setActiveSubscriptions(activeSubscriptionsList);
          setIsLoading(false);
        } catch (error) {
          console.log("setActiveSubscriptions - Error");
        }
      }
    })();
  }, [userId, currentPage, itemsPerPage]);

  const handleDurationChange = (index: number, value: string) => {
    const newDurations = [...selectedDurations];
    newDurations[index] = value;
    setSelectedDurations(newDurations);
  };

  return (
    <>
      {isLoading ? (
        <>
          <Skeleton className="w-full h-[30vh] rounded-xl" />
        </>
      ) : activeSubscriptions &&
        activeSubscriptions.subscriptions.length > 0 ? (
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="py-4">ORDER number</TableHead>
              <TableHead className="py-4">AMOUNT</TableHead>
              <TableHead className="py-4">PAYMENT METHOD</TableHead>
              <TableHead className="py-4">renewal term</TableHead>
              <TableHead className="py-4">DUE DATE</TableHead>
              <TableHead className="py-4">EXPIRES</TableHead>
              <TableHead className="py-4">activity</TableHead>
            </TableRow>
            <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
          </TableHeader>
          <TableBody>
            {activeSubscriptions.subscriptions.map((item, index) => (
              <TableRow key={index}>
                <TableCell
                  data-label="ORDER number"
                  className="text-[#C2C6D1] text-xs leading-tight"
                >
                  {item.order_id}
                </TableCell>
                <TableCell
                  data-label="AMOUNT"
                  className="text-[#C2C6D1] text-sm leading-tight"
                >
                  ${item.payment_per_period}
                </TableCell>

                <TableCell
                  data-label="PAYMENT METHOD"
                  className="text-[#9B9A9D] text-sm leading-tight"
                >
                  <div className="flex gap-2.5 items-center">
                    {item.payment_data && item.payment_data.brand ? (
                      item.payment_data.brand === "mastercard" ? (
                        <span className="border border-[#22293B] rounded-[4px] px-2 py-[2px] min-w-[68px] flex justify-center">
                          <MasterCardIcon />
                        </span>
                      ) : item.payment_data.brand === "visa" ? (
                        <VisaIcon />
                      ) : (
                        <span className="border border-[#22293B] rounded-[4px] px-2 py-[2px] min-w-[68px] flex justify-center uppercase">
                          {item.payment_data.brand}
                        </span>
                      )
                    ) : (
                      <span className="border border-[#22293B] rounded-[4px] px-2 py-[2px] min-w-[68px] flex justify-center uppercase">
                        N/A
                      </span>
                    )}
                    **{" "}
                    {item.payment_data && item.payment_data.last4
                      ? item.payment_data.last4
                      : "N/A"}
                  </div>
                </TableCell>
                <TableCell data-label="renewal term" className="text-[#D8DADF]">
                  <Select
                    defaultValue={`${item.period_str}`}
                    onValueChange={(value) =>
                      handleDurationChange(index, value)
                    }
                  >
                    <SelectTrigger
                      className={`w-[150px] h-10 ${!item.auto_extend && "opacity-30 pointer-events-none"}`}
                    >
                      <SelectValue placeholder={`${item.period_str}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1 day">1 Day</SelectItem>
                        <SelectItem value="3 day">3 Day</SelectItem>
                        <SelectItem value="1 week">1 Week</SelectItem>
                        <SelectItem value="1 month">1 Month</SelectItem>
                        {selectedDurations[index] !== "1 day" &&
                          selectedDurations[index] !== "3 day" &&
                          selectedDurations[index] !== "1 week" &&
                          selectedDurations[index] !== "1 month" && (
                            <SelectItem value={selectedDurations[index]}>
                              {selectedDurations[index]}
                            </SelectItem>
                          )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell
                  data-label="DUE DATE"
                  className="text-[#C2C6D1] text-xs leading-tight"
                >
                  {item.due_date.replace(
                    /(\d{2})\/(\d{2})\/(\d{2})/,
                    "$2/$1/$3",
                  )}
                </TableCell>
                <TableCell
                  data-label="EXPIRES"
                  className="text-[#31AA7A] text-xs leading-tight"
                >
                  {item.expires} days
                </TableCell>
                <TableCell data-label="activity" className="text-[#D8DADF]">
                  <Button
                    className={`${!item.auto_extend && "opacity-30 pointer-events-none"}`}
                    onClick={() => {
                      renewBuySubmit(
                        item.subscription_id,
                        selectedDurations[index],
                        item.payment_per_period,
                      );
                    }}
                    variant="secondary"
                    size="sm"
                  >
                    RENEW
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="mx-auto">
          <div className="text-[#C2C6D1] text-base font-medium mt-5">
            You have no active subscriptions
          </div>
        </div>
      )}
      {activeSubscriptions && activeSubscriptions.total > itemsPerPage && (
        <PaginationList
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageClick={handlePageClick}
        />
      )}
    </>
  );
};