import React from "react";

import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select.tsx";
import { Input } from "ui/input.tsx";
import { MasterCardIcon, VisaIcon } from "src/assets/images/icons/icons-ui.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "ui/popover.tsx";
import { Button } from "ui/button.tsx";
import { cn } from "src/components/lib/utils.ts";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "ui/calendar.tsx";

const AdminOrdersDetail: React.FC = () => {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={8} admin={true} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="Payment & Order" admin={true} />
        <div className="flex flex-col gap-5 w-full max-w-[1416px]">
          <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
            Customer Order Details
          </div>
          <div className="w-full bg-custom-gradient-3 rounded-[7px] p-7 gap-7 flex flex-col justify-start items-start max-mobile-2:py-6 max-mobile-2:px-4">
            <div className="w-full grid grid-cols-3 gap-x-6 gap-y-8 max-mobile-1:grid-cols-2 max-mobile-2:grid-cols-1 max-mobile-1:gap-y-5">
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    carrier
                  </span>
                </div>
                <div className="relative w-full">
                  <Select defaultValue="1">
                    <SelectTrigger className="w-full text-base">
                      <SelectValue placeholder="Newest first" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">
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
                        <SelectItem value="2">
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
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </Label>
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    renewal term
                  </span>
                </div>
                <div className="relative w-full">
                  <Select>
                    <SelectTrigger className="w-full text-base">
                      <SelectValue placeholder="Select a renewal term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="renewal 1">renewal 1</SelectItem>
                        <SelectItem value="renewal 2">renewal 2</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </Label>
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    amount
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    type="text"
                    required
                    defaultValue="$120.00"
                    placeholder="amount"
                    className="w-full px-3"
                  />
                </div>
              </Label>
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    discount coupon
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    type="text"
                    required
                    defaultValue="QWE3627281G"
                    placeholder="Discount coupon"
                    className="w-full px-3"
                  />
                </div>
              </Label>
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    discount
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    type="text"
                    required
                    defaultValue="$12.00"
                    placeholder="Discount"
                    className="w-full px-3"
                  />
                </div>
              </Label>
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    payment method
                  </span>
                </div>
                <div className="relative w-full">
                  <Select defaultValue="visa">
                    <SelectTrigger className="w-full text-base">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="visa">
                          <VisaIcon />
                        </SelectItem>
                        <SelectItem value="master-card">
                          <MasterCardIcon />
                        </SelectItem>
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
                          "w-full justify-start normal-case h-[52px] text-base px-3",
                          !date && "text-[#C2C6D1]",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <>Select an order date</>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Calendar
                        mode="single"
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
                  <Select>
                    <SelectTrigger className="w-full text-base">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="status 1">Status 1</SelectItem>
                        <SelectItem value="status 2">status 2</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersDetail;
