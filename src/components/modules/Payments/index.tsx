import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "src/store/store.ts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/table.tsx";
import { paymentsList } from "src/core/models/interfaces";
import { getPayments } from "src/core/services/payments";
import PaginationList from "components/modules/Pagination";
import { TMobileIcon } from "src/assets/images/icons/icons-ui.tsx";

type PaymentsProps = {
  perPage?: number;
};

export const Payments: React.FC<PaymentsProps> = ({ perPage }) => {
  const [payments, setPayments] = useState<paymentsList | null>(null); // Обновите тип состояния
  const userId = useSelector((state: AppState) => state.userInfo.id);
  const itemsPerPage = perPage ? perPage : 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = payments?.total
    ? Math.ceil(payments.total / itemsPerPage)
    : 0;

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");
      if (token && userId !== 0) {
        try {
          const paymentsList = await getPayments(
            token,
            userId,
            (currentPage - 1) * itemsPerPage,
            itemsPerPage,
          );
          setPayments(paymentsList);
        } catch (error) {
          console.log("getPayments - Error");
        }
      }
    })();
  }, [userId, currentPage]);

  return (
    <>
      {payments && payments.payments.length > 0 ? (
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="py-4 text-xs">Payment Date</TableHead>
              <TableHead className="py-4 text-xs">
                order <br />
                number
              </TableHead>
              <TableHead className="py-4 text-xs">carrier</TableHead>
              <TableHead className="py-4 text-xs">Location</TableHead>
              <TableHead className="py-4 text-xs">
                Subscription <br />
                Length
              </TableHead>
              <TableHead className="py-4 text-xs">discount</TableHead>
              <TableHead className="py-4 text-xs">total</TableHead>
            </TableRow>
            <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
          </TableHeader>
          <TableBody>
            {payments.payments.map((item, index) => (
              <TableRow key={index}>
                <TableCell
                  data-label="Payment Date"
                  className="text-[#9B9A9D] text-sm"
                >
                  {item.payment_date.replace(
                    /(\d{2})\/(\d{2})\/(\d{2})/,
                    "$2/$1/$3",
                  )}
                </TableCell>
                <TableCell
                  data-label="order number"
                  className="text-[#D8DADF] text-sm"
                >
                  {item.order_id}
                </TableCell>
                <TableCell data-label="carrier">
                  {item.modem_name === "T-MOBILE" ? (
                    <span>
                      <TMobileIcon className="max-w-20" />
                    </span>
                  ) : item.modem_name === "VERIZON" ? (
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
                </TableCell>
                <TableCell
                  data-label="Location"
                  className="text-[#9B9A9D] text-sm"
                >
                  {item.proxy_location}
                </TableCell>
                <TableCell
                  data-label="Subscription Length"
                  className="text-[#9B9A9D] text-sm"
                >
                  {item.period_str}
                </TableCell>
                <TableCell
                  data-label="discount"
                  className="text-[#9B9A9D] text-sm"
                >
                  {item.discount ? `$${item.discount}` : "-"}
                </TableCell>
                <TableCell
                  data-label="total"
                  className="text-[#D8DADF] text-sm"
                >
                  ${item.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="mx-auto">
          <div className="text-[#C2C6D1] text-base font-medium mt-5">
            No payments found
          </div>
        </div>
      )}
      {payments && payments.total > itemsPerPage && (
        <PaginationList
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageClick={handlePageClick}
        />
      )}
    </>
  );
};
