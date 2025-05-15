import React, { useEffect, useState } from "react";

import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import { Button } from "ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/table.tsx";
import {
  ATTIcon,
  MasterCardIcon,
  TMobileIcon,
  VisaIcon,
} from "src/assets/images/icons/icons-ui.tsx";

import { CalendarIcon, ListFilter, Search } from "lucide-react";
import { Input } from "ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select.tsx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "ui/popover.tsx";
import { Calendar } from "ui/calendar.tsx";
import { format } from "date-fns";
import { cn } from "src/components/lib/utils.ts";
import { getAllOrders } from "src/core/services/orders";
import { ordersList } from "src/core/models/interfaces";
import PaginationList from "components/modules/Pagination";
import { DateRange } from "react-day-picker";
import { Skeleton } from "ui/skeleton.tsx";

const AdminOrdersList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<ordersList | null>(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = orders?.total ? Math.ceil(orders.total / itemsPerPage) : 0;
  const [querySearch, setQuerySearch] = React.useState<string>("");
  const [carrier, setCarrier] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = React.useState<string>("");
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [status, setStatus] = React.useState<string>("");

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const ordersList = await getAllOrders(
            token,
            (currentPage - 1) * itemsPerPage,
            itemsPerPage,
            querySearch,
            carrier,
            paymentMethod,
            date !== undefined && date.from
              ? format(date.from, "dd/MM/yy")
              : "",
            date !== undefined && date.to ? format(date.to, "dd/MM/yy") : "",
            status,
          );
          setOrders(ordersList);
          setIsLoading(false);
        } catch (error) {
          console.log("getOrders - Error");
        }
      }
    })();
  }, [currentPage, querySearch, carrier, paymentMethod, status, date]);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setQuerySearch(event.target.value);
  };

  const handleStatusChange = (value: string) => {
    setCurrentPage(1);
    setStatus(value);
  };

  const handleCarrierChange = (value: string) => {
    setCurrentPage(1);
    setCarrier(value);
  };

  const handlePaymentMethodChange = (value: string) => {
    setCurrentPage(1);
    setPaymentMethod(value);
  };

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={8} admin={true} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="Payment & Order" admin={true} />
        <div className="flex flex-col gap-5 w-full max-w-[1416px]">
          <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
            Customer Orders
          </div>
          <div className="w-full bg-custom-gradient-3 rounded-[7px] p-7 gap-7 flex flex-col justify-start items-start max-tablet:p-4">
            <Collapsible className="w-full flex flex-col gap-9">
              <div className="justify-between items-end flex w-full gap-5 max-mobile-2:flex-col">
                <Label className="flex w-full flex-col items-start justify-start max-w-[444px] max-mobile-2:max-w-full">
                  <div className="relative w-full">
                    <button
                      type={"button"}
                      className="absolute left-0-0 top-0 p-2.5 border-none bg-transparent"
                    >
                      <Search className="text-[#6F7279] w-5 h-5" />
                    </button>
                    <Input
                      type="text"
                      value={querySearch}
                      onChange={handleSearchChange}
                      className="py-2.5 pr-3 pl-10 h-10"
                      placeholder="Search order"
                    />
                  </div>
                </Label>
                <div className="flex gap-4 max-mobile-2:w-full">
                  <CollapsibleTrigger>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="px-2 py-1.5 gap-0.5 border-[#141927]"
                    >
                      <ListFilter className="w-3 h-3 m-1" />
                      Filters
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              <CollapsibleContent className="w-full mb-3 max-mobile-2:w-full">
                <div className="w-full grid grid-cols-3 gap-x-6 gap-y-8 max-mobile-1:grid-cols-2 max-mobile-2:grid-cols-1 max-mobile-1:gap-y-5">
                  <Label className="flex w-full gap-4 flex-col">
                    <div>
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        carrier
                      </span>
                    </div>
                    <div className="relative w-full">
                      <Select
                        onValueChange={(value) => {
                          handleCarrierChange(value);
                        }}
                      >
                        <SelectTrigger className="w-full text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Verizon">
                              <svg
                                width="69"
                                height="16"
                                viewBox="0 0 69 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g opacity="0.8">
                                  <path
                                    d="M66.6166 0.422881C67.14 0.395143 67.6633 0.395143 68.1867 0.409012C66.6166 3.70974 65.1017 7.03821 63.5729 10.3528H62.2921C61.5897 8.68857 60.7634 7.06595 60.0334 5.40171C60.543 5.38784 61.0526 5.38784 61.5622 5.40171C62.0029 6.42799 62.5262 7.41266 62.9256 8.43894C64.1514 5.7623 65.4184 3.09952 66.6166 0.422881Z"
                                    fill="#FF0000"
                                  />
                                  <path
                                    d="M27.1865 1.8374C28.1919 1.85127 29.211 1.85127 30.2164 1.8374C30.2027 2.73886 30.2027 3.65419 30.2164 4.55565C29.211 4.54178 28.1919 4.55565 27.1727 4.54178C27.2003 3.64032 27.1727 2.73886 27.1865 1.8374ZM11.9406 5.72061C14.0064 4.54178 17.0088 4.94397 18.3998 6.98266C19.2537 8.18923 19.5016 9.71477 19.4878 11.1571C17.119 11.171 14.7501 11.1571 12.3813 11.171C12.4915 11.906 12.8082 12.6827 13.4831 13.071C14.4471 13.6396 15.9621 13.4732 16.4441 12.3498C17.422 12.3221 18.386 12.3221 19.3639 12.3498C19.0609 13.4732 18.2483 14.4301 17.2291 14.9571C16.1274 15.5673 14.8052 15.6783 13.5795 15.4702C12.2849 15.2622 11.0867 14.5272 10.3568 13.4316C9.55798 12.2666 9.35139 10.7827 9.53043 9.40967C9.70947 7.89799 10.6047 6.46952 11.9406 5.72061ZM13.5519 7.45419C12.8771 7.77317 12.5466 8.5082 12.3951 9.2155H16.4441C16.3615 8.67463 16.1687 8.10602 15.7555 7.73156C15.1771 7.16295 14.2543 7.14908 13.5519 7.45419ZM43.6995 5.19361C45.3246 4.90237 47.1288 5.24908 48.3821 6.38631C50.5168 8.30018 50.6132 12.0031 48.63 14.0557C47.0599 15.706 44.4294 16.0111 42.4187 15.0819C40.8624 14.3746 39.8019 12.7797 39.6229 11.0878C39.554 10.1031 39.5954 9.09069 39.9948 8.17536C40.6007 6.6082 42.0744 5.47098 43.6995 5.19361ZM44.0438 7.45419C43.1899 7.7593 42.7905 8.6885 42.6666 9.53448C42.5702 10.5885 42.584 11.7812 43.2588 12.6549C43.9887 13.6119 45.6001 13.5841 46.33 12.6411C46.936 11.8783 47.0324 10.8381 46.9635 9.89507C46.9222 9.06295 46.633 8.17536 45.9444 7.66222C45.3935 7.28777 44.6636 7.23229 44.0438 7.45419ZM54.5108 5.76222C55.5161 4.97171 56.9485 4.8885 58.1053 5.36003C58.9317 5.72061 59.5514 6.45565 59.8406 7.30164C60.1712 8.17536 60.0748 9.11842 60.0748 10.0338C60.0748 11.7812 60.061 13.5286 60.0885 15.2622C59.0832 15.2761 58.0778 15.2622 57.0586 15.2761V9.28485C57.0586 8.77171 56.8658 8.21696 56.4389 7.89799C55.7916 7.45419 54.8551 7.5374 54.3042 8.09215C53.8635 8.53594 53.6707 9.1739 53.6844 9.78412V15.2761C52.6928 15.2622 51.6874 15.2761 50.6958 15.2622C50.6958 11.9615 50.7096 8.66076 50.6958 5.36003C51.6737 5.3739 52.6377 5.34616 53.6156 5.3739C53.6018 5.83156 53.6018 6.28923 53.588 6.74689C53.891 6.41404 54.1389 6.03959 54.5108 5.76222ZM0 5.38777H3.14008C3.77361 7.50967 4.44845 9.63156 5.04066 11.7673C5.77059 9.67317 6.32149 7.50967 7.0101 5.38777C8.01548 5.3739 9.03463 5.38777 10.04 5.3739C8.88313 8.67463 7.7538 11.9754 6.6107 15.2761C5.56401 15.2761 4.51731 15.2622 3.47062 15.29C2.27243 12.0031 1.21196 8.66076 0 5.38777ZM20.1764 5.3739H23.0686C23.0548 5.92864 23.0686 6.48339 23.0411 7.03813C23.289 6.76076 23.468 6.41404 23.7297 6.15054C24.377 5.42937 25.4374 5.13813 26.374 5.38777C26.3602 6.26149 26.3602 7.13521 26.374 7.99507C25.6303 7.91186 24.8039 7.93959 24.1704 8.39726C23.4955 8.86879 23.1926 9.74251 23.2063 10.5469C23.1926 12.1279 23.2063 13.6951 23.2063 15.2761C22.2009 15.2761 21.1818 15.2622 20.1764 15.29C20.1902 11.9754 20.1902 8.67463 20.1764 5.3739ZM27.1865 5.38777C28.2057 5.3739 29.211 5.38777 30.2302 5.3739C30.2164 8.67463 30.2302 11.9754 30.2302 15.2761C29.2248 15.2622 28.2057 15.2761 27.1865 15.2761V5.38777ZM31.0428 5.3739C33.7835 5.38777 36.5241 5.3739 39.2511 5.38777C39.2235 6.15054 39.2511 6.89945 39.2373 7.66222C39.1409 7.85638 38.9756 7.99507 38.8517 8.16149C37.4469 9.72864 36.0697 11.3374 34.6373 12.8907C36.2487 12.9184 37.8601 12.8907 39.4714 12.9046V15.29C36.6619 15.2761 33.8523 15.2761 31.0428 15.29V12.9878C32.5164 11.3235 33.9763 9.67317 35.4637 8.0228C35.505 7.93959 35.684 7.85638 35.5876 7.74543C34.0727 7.78704 32.5577 7.74543 31.0428 7.77317V5.3739Z"
                                    fill="#F7F7F7"
                                  />
                                </g>
                              </svg>
                            </SelectItem>
                            <SelectItem value="T-MOBILE">
                              <TMobileIcon className="max-w-20" />
                            </SelectItem>
                            <SelectItem value="ATT">
                              <ATTIcon />
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </Label>
                  <Label className="flex w-full gap-4 flex-col">
                    <div>
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        payment method
                      </span>
                    </div>
                    <div className="relative w-full">
                      <Select
                        onValueChange={(value) => {
                          handlePaymentMethodChange(value);
                        }}
                      >
                        <SelectTrigger className="w-full text-base">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="visa">
                              <VisaIcon />
                            </SelectItem>
                            <SelectItem value="mastercard">
                              <MasterCardIcon />
                            </SelectItem>
                            <SelectItem value="crypto">CRYPTO</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </Label>
                  <Label className="flex w-full gap-4 flex-col">
                    <div>
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        ORDER date
                      </span>
                    </div>
                    <div className="relative w-full">
                      <Popover>
                        <PopoverTrigger asChild className="w-full">
                          <Button
                            variant="dark"
                            className={cn(
                              "w-full justify-start normal-case h-[52px] text-base px-3 text-[#C2C6D1]",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              (date.from && format(date.from, "PPP"),
                              date.to && format(date.to, "PPP"))
                            ) : (
                              <>Select an order date</>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className="bg-[#141927] w-full rounded-[6px]"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </Label>
                  <Label className="flex w-full gap-4 flex-col">
                    <div>
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        status
                      </span>
                    </div>
                    <div className="relative w-full">
                      <Select
                        onValueChange={(value) => handleStatusChange(value)}
                      >
                        <SelectTrigger className="w-full text-base">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </Label>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <div className="w-full flex-col justify-start items-center gap-[39px] inline-flex overflow-x-hidden max-tablet:overflow-x-visible">
              {isLoading ? (
                <>
                  <Skeleton className="w-full h-[50vh] rounded-xl" />
                </>
              ) : (
                <div className="w-full flex-col justify-start items-start gap-6 flex max-1450:overflow-x-auto">
                  {orders && orders.orders.length > 0 ? (
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
                        <TableRow>
                          <TableHead className="py-2.5">customer</TableHead>
                          <TableHead className="py-2.5">Order Date</TableHead>
                          <TableHead className="py-2.5">carrier</TableHead>
                          <TableHead className="py-2.5">renewal term</TableHead>
                          <TableHead className="py-2.5">amount</TableHead>
                          <TableHead className="py-2.5">
                            discount coupon
                          </TableHead>
                          <TableHead className="py-2.5">discount</TableHead>
                          <TableHead className="py-2.5">paid by</TableHead>
                          <TableHead className="py-2.5">status</TableHead>
                        </TableRow>
                        <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
                      </TableHeader>
                      <TableBody>
                        {orders.orders.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell data-label="customer">
                              <div className="flex-col justify-start items-start gap-2 inline-flex">
                                <div className="text-[#C2C6D1] text-sm">
                                  {item.first_name} {item.last_name}
                                </div>
                                <div className="text-[#9B9A9D] text-xs leading-[11.14px]">
                                  {item.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              data-label="Order Date"
                              className="text-[#6F7279] text-base"
                            >
                              {item.date_created.replace(
                                /(\d{2})\/(\d{2})\/(\d{2})/,
                                "$2/$1/$3",
                              )}
                            </TableCell>
                            <TableCell data-label="carrier">
                              {item.carrier === "T-MOBILE" ? (
                                <span>
                                  <TMobileIcon className="max-w-20" />
                                </span>
                              ) : item.carrier === "VERIZON" ? (
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
                              data-label="renewal term"
                              className="text-[#6F7279] text-base"
                            >
                              {item.period_str}
                            </TableCell>
                            <TableCell
                              data-label="amount"
                              className="text-[#9B9A9D] text-base"
                            >
                              ${item.amount}
                            </TableCell>
                            <TableCell
                              data-label="discount coupon"
                              className="text-[#6F7279] text-base"
                            >
                              {item.discount_code ? item.discount_code : "-"}
                            </TableCell>
                            <TableCell
                              data-label="discount"
                              className="text-[#9B9A9D] text-base"
                            >
                              $
                              {item.discount_amount
                                ? item.discount_amount
                                : "0"}
                            </TableCell>
                            <TableCell
                              data-label="paid by"
                              className="text-[#C2C6D1] text-base"
                            >
                              <span>
                                {item.payment_method == "visa" ? (
                                  <VisaIcon className="[&_>rect]:hidden" />
                                ) : item.payment_method === "mastercard" ? (
                                  <MasterCardIcon />
                                ) : item.payment_method === "crypto" ? (
                                  <span>Crypto</span>
                                ) : (
                                  <span>{item.payment_method}</span>
                                )}
                              </span>
                            </TableCell>
                            <TableCell
                              data-label="status"
                              className="text-center"
                            >
                              <div
                                className={`min-w-[75px] min-h-[28px] px-2.5 py-1 ${item.status === "success" ? "bg-[#0F211A] text-emerald-500" : item.status === "pending" ? "bg-[#382D21] text-[#DE9948]" : "bg-[#261518] text-[#d35757]"} rounded-[7px] justify-center items-center gap-2.5 inline-flex`}
                              >
                                <div className={`text-sm leading-tight`}>
                                  {item.status}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="mx-auto">
                      <div className="text-[#C2C6D1] text-base font-medium mt-5">
                        No orders found
                      </div>
                    </div>
                  )}
                  {orders && orders.total > itemsPerPage && (
                    <PaginationList
                      currentPage={currentPage}
                      totalPages={totalPages}
                      handlePageClick={handlePageClick}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersList;
