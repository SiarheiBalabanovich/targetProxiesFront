import React, { useEffect, useState } from "react";

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
import { Popover, PopoverContent, PopoverTrigger } from "ui/popover.tsx";
import { Button } from "ui/button.tsx";
import { cn } from "src/components/lib/utils.ts";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "ui/calendar.tsx";
import { discountsDetail, updateDiscount } from "src/core/services/discounts";
import { discountListItem } from "src/core/models/interfaces";
import { Controller, type RegisterOptions, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { formatDate } from "src/core/utils/helpers/formatDate.ts";
import { useParams } from "react-router-dom";
import { Skeleton } from "ui/skeleton.tsx";
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

interface RouteParams {
  [key: string]: string | undefined;
  discountId: string;
}

const AdminDiscountDetail: React.FC = () => {
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
  const [isLimited, setIsLimited] = useState(true);
  const [isDiscountType, setIsDiscountType] = useState("fixed");
  const [dataDetail, setDataDetail] = React.useState<discountListItem>({
    code: "1",
    order_amount: 0,
    id: 1,
    effective_date: "2024-01-02T10:12:03+00:00",
    type: isDiscountType,
    discount_amount: 1,
    limit_users: 1,
    expiry_date: "2024-01-02T10:12:03+00:00",
  });
  const [error, setError] = useState("");
  const [selectedExpiryDate, setSelectedExpiryDate] = useState<string>(
    new Date().toISOString(),
  );
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState<string>(
    new Date().toISOString(),
  );
  const { discountId } = useParams<RouteParams>();

  const nameValidation: RegisterOptions = {
    required: "This field is required",
  };

  const onChangeLimitValue = () => {
    setIsLimited(!isLimited);
  };

  const onChangeTypeValue = () => {
    setIsDiscountType(isDiscountType === "fixed" ? "percent" : "fixed");
  };

  const onSubmit = async (data: FormData) => {
    const { code, order_amount, effective_date, expiry_date, discount_amount } =
      data;

    const formattedEffectiveDate = new Date(effective_date).toISOString();
    const formattedExpiryDate = new Date(expiry_date).toISOString();

    const modifiedLimitUsers = isLimited ? data.limit_users : undefined;

    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const discountValue =
          discount_amount === undefined ? 0 : discount_amount;

        await updateDiscount(
          token,
          discountId !== undefined ? Number(discountId) : 0,
          code,
          order_amount,
          formattedEffectiveDate,
          formattedExpiryDate,
          isDiscountType,
          discountValue,
          modifiedLimitUsers,
        );
        toast.success("Discount updated successfully");
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

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const detailData = await discountsDetail(
            token,
            discountId !== undefined ? Number(discountId) : 0,
          );
          setDataDetail(detailData);

          if (detailData) {
            const formattedData: FormData = {
              code: detailData.code,
              order_amount: Number(detailData.order_amount),
              effective_date: detailData.effective_date,
              expiry_date: detailData.expiry_date,
              discount_amount: detailData.discount_amount
                ? Number(detailData.discount_amount)
                : undefined,
              limit_users: detailData.limit_users
                ? Number(detailData.limit_users)
                : undefined,
            };

            setSelectedExpiryDate(detailData.expiry_date);
            setSelectedEffectiveDate(detailData.effective_date);
            setIsLimited(!!detailData.limit_users);
            setIsDiscountType(detailData.type);
            reset(formattedData);
            setIsLoading(false);
          }
        } catch (error) {
          console.log("discountsDetail - Error");
        }
      }
    })();
  }, [discountId, reset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataDetail((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={9} admin={true} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="Payment & Order" admin={true} />
        <div className="flex flex-col gap-5 w-full max-w-[1416px]">
          <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
            Discount Details
          </div>
          {isLoading ? (
            <>
              <Skeleton className="w-full h-[396px] rounded-xl" />
            </>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full bg-custom-gradient-3 rounded-[7px] p-7 gap-7 flex flex-col justify-start items-start max-mobile-2:p-6 max-mobile-2:py-6 max-mobile-2:px-4"
            >
              <div className="w-full grid grid-cols-3 gap-x-6 gap-y-8 max-mobile-1:grid-cols-2  max-mobile-1:gap-y-5 max-mobile-2:grid-cols-1">
                <Label className="flex w-full gap-4 flex-col">
                  <div>
                    <span className="text-[#6F7279] text-sm uppercase leading-tight">
                      users
                    </span>
                  </div>
                  <div className="relative w-full">
                    <Select
                      value={isLimited ? "limited" : "unlimited"}
                      onValueChange={onChangeLimitValue}
                    >
                      <SelectTrigger className="w-full text-base">
                        <SelectValue placeholder="Select type limited" />
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
                      discount type
                    </span>
                  </div>
                  <div className="relative w-full">
                    <Select
                      value={isDiscountType}
                      onValueChange={onChangeTypeValue}
                    >
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
                      minimum order amount
                    </span>
                  </div>
                  <div className="relative w-full">
                    <Input
                      type="number"
                      required
                      {...register("order_amount", nameValidation)}
                      value={dataDetail.order_amount}
                      onChange={handleChange}
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
                        required
                        disabled={!isLimited}
                        {...register(
                          "limit_users",
                          isLimited
                            ? { required: "This field is required" }
                            : {},
                        )}
                        value={`${dataDetail.limit_users}`}
                        onChange={handleChange}
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
                      value={dataDetail.code}
                      onChange={handleChange}
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
                      discount amount
                    </span>
                  </div>
                  <div className="relative w-full">
                    <Input
                      type="text"
                      required
                      max={isDiscountType === "fixed" ? 10000000 : 100}
                      {...register("discount_amount", nameValidation)}
                      value={dataDetail.discount_amount}
                      name="discount_amount"
                      onChange={handleChange}
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
                      Effective date
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
                <Label className="flex w-full gap-4 flex-col">
                  <div>
                    <span className="text-[#6F7279] text-sm uppercase leading-tight">
                      Change
                    </span>
                  </div>
                  <Button
                    disabled={
                      !watch("code") ||
                      !watch("order_amount") ||
                      !watch("effective_date") ||
                      !watch("expiry_date") ||
                      !watch("discount_amount") ||
                      (isLimited && !watch("limit_users"))
                    }
                    type="submit"
                  >
                    Save
                  </Button>
                </Label>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDiscountDetail;
