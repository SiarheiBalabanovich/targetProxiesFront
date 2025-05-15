import React, { useEffect, useState } from "react";
import { Controller, type RegisterOptions, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import { DottedIcon, PercentIcon } from "src/assets/images/icons/icons-ui.tsx";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "ui/menubar.tsx";
import { Button } from "ui/button.tsx";
import { CalendarIcon, Pencil, PlusIcon, Trash2 } from "lucide-react";
import { AdminDeleteModal } from "src/components/modules/AdminDeleteModal";
import { Modal } from "src/components/base/modal";
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
import { Popover, PopoverContent, PopoverTrigger } from "ui/popover.tsx";
import { cn } from "src/components/lib/utils.ts";
import { Calendar } from "ui/calendar.tsx";
import {
  createDiscount,
  deleteDiscount,
  discountsList,
} from "src/core/services/discounts";
import { formatDate } from "src/core/utils/helpers/formatDate.ts";
import { AxiosError } from "axios";
import { Skeleton } from "ui/skeleton.tsx";
import { discountListItem } from "src/core/models/interfaces";
import { toast } from "sonner";

interface FormData {
  code: string;
  order_amount: number;
  effective_date: string;
  expiry_date: string;
  discount_amount?: number;
  limit_users?: number;
}

interface ErrorResponse {
  detail: string[];
}

const AdminDiscountsList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const [expiryDate] = useState<Date | undefined>(new Date());
  const [effectiveDate] = useState<Date | undefined>(new Date());
  useState<string>("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsAddDiscountOpen, setModalIsAddDiscountOpen] = useState(false);
  const [isLimited, setIsLimited] = useState(true);
  const [isDiscountType, setIsDiscountType] = useState("fixed");
  const [discounts, setDiscounts] = useState<discountListItem[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [selectedExpiryDate, setSelectedExpiryDate] = useState<string>(
    new Date().toISOString(),
  );
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState<string>(
    new Date().toISOString(),
  );

  const nameValidation: RegisterOptions = {
    required: "This field is required",
  };

  const handleActivateClick = (id: number): void => {
    setModalIsOpen(true);
    setDeleteId(id);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseModal = (): void => {
    setModalIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  const handleAddDiscountClick = (): void => {
    setModalIsAddDiscountOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseAddDiscountClick = (): void => {
    setModalIsAddDiscountOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  const onChangeLimitValue = () => {
    setIsLimited(!isLimited);
  };

  const onChangeTypeValue = () => {
    setIsDiscountType(isDiscountType === "fixed" ? "percent" : "fixed");
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          setDiscounts(await discountsList(token));
        } catch (error) {
          console.log("discountsList - Error");
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const onSubmit = async (data: FormData) => {
    const { code, order_amount, effective_date, expiry_date, discount_amount } =
      data;

    const modifiedLimitUsers = isLimited ? data.limit_users : undefined;

    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const discountValue =
          discount_amount === undefined ? 0 : discount_amount;

        await createDiscount(
          token,
          code,
          order_amount,
          effective_date,
          expiry_date,
          isDiscountType,
          discountValue,
          modifiedLimitUsers,
        );

        reset();
        setDiscounts(await discountsList(token));
        handleCloseAddDiscountClick();
        toast.success("Discount created successfully");
      } catch (error) {
        console.log("Error creating discount:", error);
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as ErrorResponse; // Type assertion here
        if (errorData && errorData.detail.includes("Сбой целостности данных")) {
          setError(
            "The name of the discount is already in use. Please select a different name.",
          );
        }
      }
    }
  };

  const handleDelete = (): void => {
    if (deleteId) {
      (async () => {
        const token = localStorage.getItem("authToken");

        if (token) {
          try {
            await deleteDiscount(token, deleteId);

            try {
              setDiscounts(await discountsList(token));
              reset();
            } catch (error) {
              console.log("discountsList - Error");
            }
            handleCloseModal();
          } catch (error) {
            console.log("deleteDiscount - Error");
          }
        }
      })();
    }
  };

  const getGradientClass = (discountValue: number): string => {
    if (discountValue <= 7) {
      return "bg-custom-gradient-13";
    } else if (discountValue > 7 && discountValue <= 10) {
      return "bg-custom-gradient-15";
    } else if (discountValue > 10 && discountValue <= 13) {
      return "bg-custom-gradient-2";
    } else {
      return "bg-custom-gradient-14";
    }
  };

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={9} admin={true} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="Payment & Order" admin={true} />
        <div className="flex flex-col gap-5 w-full max-w-[1416px]">
          <div className="w-full flex justify-between gap-5 items-center flex-wrap">
            <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
              Discounts
            </div>
            <Button
              className="max-mobile-2:w-full max-mobile-2:max-w-full"
              variant="blue"
              size="xs"
              onClick={handleAddDiscountClick}
            >
              <PlusIcon className="w-5 h-5" />
              add discount
            </Button>
          </div>
          <div className="w-full justify-start items-center gap-6 grid grid-cols-4 max-1600:grid-cols-3 max-mobile-1:grid-cols-2 max-mobile-2:grid-cols-1">
            {isLoading ? (
              <>
                <Skeleton className="h-[244px] rounded-xl" />
                <Skeleton className="h-[244px] rounded-xl" />
                <Skeleton className="h-[244px] rounded-xl" />
                <Skeleton className="h-[244px] rounded-xl" />
                <Skeleton className="h-[244px] rounded-xl" />
                <Skeleton className="h-[244px] rounded-xl" />
                <Skeleton className="h-[244px] rounded-xl" />
                <Skeleton className="h-[244px] rounded-xl" />
                <Skeleton className="h-[244px] rounded-xl" />
                <Skeleton className="h-[244px] rounded-xl" />
                <Skeleton className="h-[244px] rounded-xl" />
                <Skeleton className="h-[244px] rounded-xl" />
              </>
            ) : (
              discounts.map((discount, index) => (
                <div
                  key={index}
                  className="relative bg-custom-gradient-3 rounded-[7px]"
                >
                  <div className="right-10 top-[6px] absolute">
                    <PercentIcon />
                  </div>
                  <div className="flex-col justify-start items-center gap-6 flex pt-6 pb-4 px-7 max-mobile-2:p-6 relative z-[1]">
                    <div className="flex-col justify-start items-start gap-5 flex w-full">
                      <div className="flex-col justify-start items-start gap-2 flex w-full">
                        <div className="w-full max-w-full justify-between items-center flex max-mobile-1:max-w-full">
                          <div className="h-6 w-full items-center flex justify-between">
                            <div className="text-[#9B9A9D] font-medium uppercase leading-normal">
                              {discount.limit_users !== null
                                ? "limited"
                                : "unlimited"}
                            </div>
                            <div className="justify-start items-start gap-[99px] flex">
                              <div className="text-[#C2C6D1] text-sm leading-tight">
                                {discount.limit_users !== null
                                  ? discount.limit_users + " Users"
                                  : ""}
                              </div>
                            </div>
                          </div>
                          <Menubar>
                            <MenubarMenu>
                              <MenubarTrigger className="ml-auto">
                                <DottedIcon className="w-5 h-5 text-[#C2C6D1] cursor-pointer" />
                              </MenubarTrigger>
                              <MenubarContent>
                                <MenubarItem className="p-0 [&_a]:px-5 [&_a]:py-2.5">
                                  <Link
                                    to={`${discount.id}`}
                                    className="flex gap-2.5 w-full"
                                  >
                                    <Pencil className="w-5 h-5 text-[#F7F7F7]" />
                                    <div className="text-[#F7F7F7] text-sm leading-tight">
                                      Edit
                                    </div>
                                  </Link>
                                </MenubarItem>
                                <MenubarItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleActivateClick(discount.id)
                                  }
                                >
                                  <Trash2 className="text-[#D45858] w-5 h-5" />
                                  <div className="text-[#D45858] text-sm leading-tight">
                                    Delete
                                  </div>
                                </MenubarItem>
                              </MenubarContent>
                            </MenubarMenu>
                          </Menubar>
                        </div>
                      </div>
                      <div className="flex-col justify-start items-start gap-1 flex">
                        <div className="flex-col justify-end items-start gap-1 flex">
                          <div
                            className={`bg-clip-text text-transparent ${getGradientClass(discount.type === "fixed" ? discount.discount_amount / 10 : discount.discount_amount)} text-[42px] font-bold uppercase leading-[46px]`}
                          >
                            {discount.discount_amount}{" "}
                            {discount.type === "fixed" ? "$" : "%"}
                          </div>
                          <div className="text-[#D8DADF] text-xs leading-tight">
                            {discount.code}
                          </div>
                        </div>
                        <div className="justify-start items-start gap-3 inline-flex">
                          <div className="text-[#6F7279] text-sm leading-tight">
                            Min order amount:
                          </div>
                          <div className="text-[#C2C6D1] text-sm font-medium leading-tight">
                            ${discount.order_amount}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full h-px bg-custom-gradient-5 rounded-[3px] absolute left-0 right-0" />
                      <div className="w-full justify-start items-end gap-[71px] flex pt-4">
                        <div className="flex-col justify-start items-start gap-1 inline-flex">
                          <div className="text-[#6F7279] text-sm leading-tight">
                            Effective date
                          </div>
                          <div className="text-[#C2C6D1] text-xs leading-none">
                            {formatDate(
                              discount.effective_date.replace(
                                /(\d{2})\/(\d{2})\/(\d{2})/,
                                "$2/$1/$3",
                              ),
                            )}
                          </div>
                        </div>
                        <div className="flex-col justify-start items-start gap-1 inline-flex">
                          <div className="text-[#6F7279] text-sm leading-tight">
                            Expiry date
                          </div>
                          <div className="text-[#C2C6D1] text-xs leading-none">
                            {formatDate(
                              discount.expiry_date.replace(
                                /(\d{2})\/(\d{2})\/(\d{2})/,
                                "$2/$1/$3",
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <AdminDeleteModal
        isOpen={modalIsOpen}
        onClose={handleCloseModal}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={modalIsAddDiscountOpen}
        className="max-w-[962px] w-full border-0 px-8 py-10"
        onClose={handleCloseAddDiscountClick}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="w-full flex-col justify-start items-center gap-8">
            <div className="text-gray-300 text-2xl font-medium leading-[32px]">
              Add Discount
            </div>
          </div>
          <div className="w-full h-px bg-custom-gradient-5" />
          <div className="w-full grid grid-cols-2 gap-x-6 gap-y-8 max-mobile-2:grid-cols-1 max-mobile-2:gap-5">
            <Label className="flex w-full gap-4 flex-col">
              <div>
                <span className="text-[#6F7279] text-sm uppercase leading-tight">
                  users
                </span>
              </div>
              <div className="relative w-full">
                <Select
                  defaultValue="limited"
                  onValueChange={onChangeLimitValue}
                >
                  <SelectTrigger className="w-full text-base">
                    <SelectValue placeholder="Select users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </Label>
            <Label className="flex w-full gap-4 flex-col">
              <div>
                <span className="text-[#6F7279] text-sm uppercase leading-tight">
                  minimum order amount
                </span>
              </div>
              <div className="relative w-full">
                <Input
                  type="number"
                  required
                  {...register("order_amount", nameValidation)}
                  placeholder="Minimum order amount"
                  className="w-full px-3"
                />
              </div>
              {errors.order_amount &&
                typeof errors.order_amount.message === "string" && (
                  <p className="mt-1 text-red-500">
                    {errors.order_amount.message}
                  </p>
                )}
            </Label>
            {isLimited && (
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    the number of users
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    type="number"
                    disabled={!isLimited}
                    {...register(
                      "limit_users",
                      isLimited ? { required: "This field is required" } : {},
                    )}
                    placeholder="The number of users"
                    className="w-full px-3"
                  />
                </div>
                {errors.limit_users && (
                  <p className="mt-1 text-red-500">
                    {errors.limit_users.message}
                  </p>
                )}
              </Label>
            )}
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
                  {...register("code", nameValidation)}
                  placeholder="Discount coupon"
                  className="w-full px-3"
                />
              </div>
              {errors.code && typeof errors.code.message === "string" && (
                <p className="mt-1 text-red-500">{errors.code.message}</p>
              )}
            </Label>
            <Label className="flex w-full gap-4 flex-col">
              <div>
                <span className="text-[#6F7279] text-sm uppercase leading-tight">
                  discount type
                </span>
              </div>
              <div className="relative w-full">
                <Select defaultValue="fixed" onValueChange={onChangeTypeValue}>
                  <SelectTrigger className="w-full text-base">
                    <SelectValue placeholder="Select users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="percent">Percent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </Label>
            <Label className="flex w-full gap-4 flex-col">
              <div>
                <span className="text-[#6F7279] text-sm uppercase leading-tight">
                  discount amount
                </span>
              </div>
              <div className="relative w-full">
                <Input
                  type="number"
                  max={isDiscountType === "fixed" ? 10000000 : 100}
                  required
                  {...register("discount_amount", nameValidation)}
                  placeholder="Discount amount"
                  className="w-full px-3"
                />
              </div>
              {errors.discount_amount &&
                typeof errors.discount_amount.message === "string" && (
                  <p className="mt-1 text-red-500">
                    {errors.discount_amount.message}
                  </p>
                )}
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
                        !effectiveDate && "text-[#C2C6D1]",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(selectedEffectiveDate)}
                    </Button>
                  </PopoverTrigger>
                  <Controller
                    name="effective_date"
                    control={control}
                    rules={{ required: "Effective date is required" }}
                    render={({ field }) => (
                      <PopoverContent className="w-full p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              const formattedDate =
                                date instanceof Date
                                  ? date.toISOString()
                                  : date;
                              field.onChange(formattedDate);
                              setSelectedEffectiveDate(formattedDate);
                            }
                          }}
                          initialFocus
                          className="bg-[#141927] w-full rounded-[6px]"
                        />
                      </PopoverContent>
                    )}
                  />
                </Popover>
              </div>
            </Label>
            <Label className="flex w-full gap-4 flex-col">
              <div>
                <span className="text-[#6F7279] text-sm uppercase leading-tight">
                  Expiry date
                </span>
              </div>
              <div className="relative w-full">
                <Popover>
                  <PopoverTrigger asChild className="w-full">
                    <Button
                      variant="dark"
                      className={cn(
                        "w-full justify-start normal-case h-[52px] text-base px-3",
                        !expiryDate && "text-[#C2C6D1]",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDate(selectedExpiryDate)}
                    </Button>
                  </PopoverTrigger>
                  <Controller
                    name="expiry_date"
                    control={control}
                    rules={{ required: "Expiry date is required" }}
                    render={({ field }) => (
                      <PopoverContent className="w-full p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              const formattedDate =
                                date instanceof Date
                                  ? date.toISOString()
                                  : date;
                              field.onChange(formattedDate);
                              setSelectedExpiryDate(formattedDate);
                            }
                          }}
                          initialFocus
                          className="bg-[#141927] w-full rounded-[6px]"
                        />
                      </PopoverContent>
                    )}
                  />
                </Popover>
              </div>
            </Label>
            <div className="flex w-full max-w-[48%]"></div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex gap-5 justify-center">
            <Button variant="secondary" onClick={handleCloseAddDiscountClick}>
              Cancel
            </Button>
            <Button
              variant="default"
              disabled={
                !watch("code") ||
                !watch("order_amount") ||
                !watch("effective_date") ||
                !watch("expiry_date") ||
                !watch("discount_amount") ||
                (isLimited && !watch("limit_users"))
              }
              className="max-w-[240px] w-full"
              type="submit"
            >
              SUBMIT
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDiscountsList;
