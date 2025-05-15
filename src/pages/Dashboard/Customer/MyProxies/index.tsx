import React, { useEffect, useState } from "react";

import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/table.tsx";
import { Button } from "ui/button.tsx";
import { Modal } from "src/components/base/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/tabs.tsx";
import { useAppDispatch } from "src/hooks/useAppDispatch.ts";
import { openModal } from "src/store/actions/modalActions.ts";
import { proxiesList } from "src/core/models/interfaces";
import { getProxies } from "src/core/services/proxies";
import { TMobileIcon } from "src/assets/images/icons/icons-ui.tsx";
import PaginationList from "components/modules/Pagination";
import { Link } from "react-router-dom";
import { cn } from "components/lib/utils.ts";
import { buttonVariants } from "ui/buttonVariants.tsx";
import { Skeleton } from "ui/skeleton.tsx";

const ClientMyProxies: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [proxies, setProxies] = useState<proxiesList | null>(null); // Обновите тип состояния
  const [currentPage, setCurrentPage] = useState(1);
  const [apiLinks, setApiLinks] = useState<{
    api_links_http: {
      rotate: string;
      auto_rotation: string;
      proxy_status: string;
      change_user: string;
    };
    api_links_socks5: {
      rotate: string;
      auto_rotation: string;
      proxy_status: string;
      change_user: string;
    };
  } | null>(null);
  const dispatch = useAppDispatch();
  const itemsPerPage = 10;
  const totalPages = proxies?.total
    ? Math.ceil(proxies.total / itemsPerPage)
    : 0;

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const proxiesList = await getProxies(
            token,
            (currentPage - 1) * itemsPerPage,
          );
          setProxies(proxiesList);
          setIsLoading(false);
        } catch (error) {
          console.log("getProxies - Error");
        }
      }
    })();
  }, [currentPage]);

  const handleClick = (): void => {
    dispatch(openModal());
  };

  const handleActivateClick = (apiLinks: {
    api_links_http: {
      rotate: string;
      auto_rotation: string;
      proxy_status: string;
      change_user: string;
    };
    api_links_socks5: {
      rotate: string;
      auto_rotation: string;
      proxy_status: string;
      change_user: string;
    };
  }) => {
    setApiLinks(apiLinks);
    setModalIsOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseModal = (): void => {
    setModalIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={2} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="My Proxies" />
        <div className="max-w-[1480px] w-auto">
          <div className="w-auto bg-custom-gradient-3 rounded-[7px] px-4 py-5 gap-7 flex flex-col justify-start items-start xl:px-7">
            <Button
              variant="blue"
              size="xs"
              className="max-mobile-2:w-full"
              onClick={handleClick}
            >
              add proxy
            </Button>
            <div className="w-full flex-col justify-start items-center gap-10 flex max-1750:overflow-x-scroll">
              {isLoading ? (
                <>
                  <Skeleton className="w-full h-[50vh] rounded-xl" />
                </>
              ) : (
                <div className="w-full flex-col justify-start items-start gap-6 flex max-mobile-2:gap-2">
                  {proxies?.proxies && proxies.proxies.length > 0 ? (
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
                        <TableRow>
                          <TableHead className="py-2.5">carrier</TableHead>
                          <TableHead className="py-2.5">location</TableHead>
                          <TableHead className="py-2.5">
                            discount <br />
                            coupon
                          </TableHead>
                          {/*<TableHead className="py-2.5">*/}
                          {/*  auto rotation*/}
                          {/*</TableHead>*/}
                          <TableHead className="py-2.5">Host IP:Port</TableHead>
                          <TableHead className="py-2.5">username</TableHead>
                          <TableHead className="py-2.5">password</TableHead>
                          <TableHead className="py-2.5">
                            renewal <br />
                            date
                          </TableHead>
                          <TableHead className="py-2.5">status</TableHead>
                          <TableHead className="py-2.5">API links</TableHead>
                        </TableRow>
                        <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
                      </TableHeader>
                      <TableBody>
                        {proxies.proxies.map((item, index) => (
                          <TableRow key={index}>
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
                              data-label="location"
                              className="text-[#C2C6D1]"
                            >
                              {item.location}
                            </TableCell>
                            <TableCell
                              data-label="discount coupon"
                              className="text-[#9B9A9D]"
                            >
                              {item.discount_code ? item.discount_code : "-"}
                            </TableCell>
                            {/*<TableCell*/}
                            {/*  data-label="auto rotation"*/}
                            {/*  className="text-[#C2C6D1]"*/}
                            {/*>*/}
                            {/*  {item.auto_rotation ? "Enabled" : "Disabled"}*/}
                            {/*</TableCell>*/}
                            <TableCell
                              data-label="Host IP:Port"
                              className="text-[#C2C6D1]"
                            >
                              {item.modem_ip}:{item.http_port}
                            </TableCell>
                            <TableCell
                              data-label="username"
                              className="text-[#C2C6D1]"
                            >
                              {item.login}
                            </TableCell>
                            <TableCell
                              data-label="password"
                              className="text-[#C2C6D1]"
                            >
                              {item.password}
                            </TableCell>
                            <TableCell
                              data-label="renewal date"
                              className="text-[#6F7279]"
                            >
                              {item.expired}
                            </TableCell>
                            <TableCell
                              data-label="status"
                              className="text-center"
                            >
                              {item.status ? (
                                <div className="min-w-[75px] h-7 px-2.5 py-1 bg-[#0F211A] rounded-[7px] justify-center items-center gap-2.5 inline-flex">
                                  <div className="text-emerald-500 text-sm font-normal leading-tight">
                                    Active
                                  </div>
                                </div>
                              ) : (
                                <div className="w-[71px] h-7 px-2.5 py-1 bg-stone-800 rounded-[7px] justify-center items-center gap-2.5 inline-flex">
                                  <div className="text-orange-400 text-sm font-normal leading-tight">
                                    Expired
                                  </div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell data-label="API links">
                              <Button
                                onClick={() =>
                                  handleActivateClick({
                                    api_links_http: item.api_links_http,
                                    api_links_socks5: item.api_links_socks5,
                                  })
                                }
                                variant="secondary"
                                size="sm"
                              >
                                api links
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="mx-auto">
                      <div className="py-4 text-[#C2C6D1] text-base font-medium mt-5">
                        No proxies found
                      </div>
                    </div>
                  )}
                  {proxies && proxies.total > 10 && (
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
      <Modal
        isOpen={modalIsOpen}
        className="max-w-[1017px] w-full border-0 px-7 py-8"
        onClose={handleCloseModal}
      >
        <div className="flex flex-col gap-8">
          <div className="w-full flex-col justify-start items-center gap-8">
            <div className="text-gray-300 text-2xl font-medium leading-[32px]">
              API Links
            </div>
          </div>
          <div className="w-full h-px bg-custom-gradient-5" />
          <Tabs defaultValue="HTTP" className="w-full">
            <TabsList className="bg-transparent justify-start items-center gap-3 flex mb-5">
              <div className="text-[#9B9A9D] text-base font-medium uppercase leading-normal mr-3">
                protocol
              </div>
              <TabsTrigger
                className="py-2 px-4 text-[#D8DADF] data-[state=active]:bg-custom-gradient-7 data-[state=active]:text-[#D8DADF]"
                value="HTTP"
              >
                HTTP
              </TabsTrigger>
              <TabsTrigger
                className="py-2 px-4 text-[#D8DADF] data-[state=active]:bg-custom-gradient-7 data-[state=active]:text-[#D8DADF]"
                value="Socks5"
              >
                Socks5
              </TabsTrigger>
            </TabsList>
            <TabsContent value="HTTP">
              <div className="flex-col justify-start items-start gap-6 flex">
                {apiLinks &&
                  Object.entries(apiLinks.api_links_http).map(
                    ([key, value], index) => (
                      <div
                        key={index}
                        className="w-full px-[27px] py-4 bg-custom-gradient-6 rounded-[7px] flex-col justify-start items-start gap-2.5 flex max-mobile-1:px-4"
                      >
                        <div className="flex-col justify-start items-start gap-2.5 flex">
                          <div className="text-[#1B88F6] font-semibold uppercase">
                            {key.replace("_", " ")}
                          </div>
                          <div className="text-[#C2C6D1] text-sm leading-tight">
                            {value}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </TabsContent>
            <TabsContent value="Socks5">
              <div className="flex-col justify-start items-start gap-6 flex">
                {apiLinks &&
                  Object.entries(apiLinks.api_links_socks5).map(
                    ([key, value], index) => (
                      <div
                        key={index}
                        className="w-full px-[27px] py-4 bg-custom-gradient-6 rounded-[7px] flex-col justify-start items-start gap-2.5 flex max-mobile-1:px-4"
                      >
                        <div className="flex-col justify-start items-start gap-2.5 flex">
                          <div className="text-[#1B88F6] font-semibold uppercase">
                            {key.replace("_", " ")}
                          </div>
                          <div className="text-[#C2C6D1] text-sm leading-tight">
                            {value}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </TabsContent>
          </Tabs>
          <div className="m-auto">
            <Link
              to={`/dashboard/api-documentation`}
              className={cn(buttonVariants({ variant: "blue" }))}
            >
              api documentation
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientMyProxies;
