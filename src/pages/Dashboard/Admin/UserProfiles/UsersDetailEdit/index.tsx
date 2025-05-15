import React, { useEffect, useState } from "react";

import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import { Label } from "@radix-ui/react-label";
import { Input } from "ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select.tsx";
import countries from "i18n-iso-countries";
import english from "i18n-iso-countries/langs/en.json";
import { Controller, type RegisterOptions, useForm } from "react-hook-form";
import {
  getCurrentUserInfo,
  updateUserInfo,
} from "src/core/services/editProfile";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "ui/button.tsx";
import { AxiosError } from "axios";
import { toast } from "sonner";

countries.registerLocale(english);
const countriesList = countries.getNames("en", { select: "official" });

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  city: string;
  country: string;
}

interface RouteParams {
  [key: string]: string | undefined;
  userId: string;
}

interface ErrorResponse {
  detail: string[];
}

export interface UserDetail {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  user_detail: {
    survey: string;
    survey_detail: string;
    phone_number: string;
    city: string;
    country: string;
  };
}

const AdminUsersDetailEdit: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<FormData>();
  const [error, setError] = useState("");
  const { userId } = useParams<RouteParams>();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<UserDetail | null>(null);

  const nameValidation: RegisterOptions = {
    required: "This field is required",
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const response = await getCurrentUserInfo(
            userId !== undefined ? Number(userId) : 0,
          );
          setUserInfo(response);
          reset();
          setValue("country", response.user_detail?.country);
        } catch (error) {
          console.log("Error getting user info:", error);
        }
      }
    })();
  }, [dispatch]);

  const onSubmitUpdateUser = async (data: FormData) => {
    const { first_name, last_name, email, phone_number, city, country } = data;

    const token = localStorage.getItem("authToken");
    if (token && userInfo) {
      try {
        const response = await updateUserInfo(
          userId !== undefined ? Number(userId) : 0,
          first_name,
          last_name,
          email,
          userInfo.user_detail?.survey ?? "",
          userInfo.user_detail?.survey_detail ?? "",
          phone_number,
          city,
          country,
        );
        toast.success("User updated successfully");

        console.log("Response from updateUserInfo:", response);
      } catch (error) {
        console.log("Error updateUserInfo:", error);
        const axiosError = error as AxiosError;
        const errorData = axiosError.response?.data as ErrorResponse; // Type assertion here
        if (errorData && errorData.detail.includes("email")) {
          setError(
            "The email of the user is already in use. Please select a different email.",
          );
        }
      }
    }
  };

  if (!userInfo) return null;

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={7} admin={true} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="User & Profilies" admin={true} />
        <div className="flex flex-col gap-5 w-full max-w-[1416px]">
          <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
            Users Details
          </div>
          <form
            onSubmit={handleSubmit(onSubmitUpdateUser)}
            className="p-10 bg-custom-gradient-3 rounded-[7px] flex-col justify-start items-start flex w-full max-mobile-2:p-6"
          >
            <div className="w-full grid grid-cols-3 gap-x-6 gap-y-8 max-mobile-1:grid-cols-2 max-mobile-1:gap-y-6 max-mobile-2:grid-cols-1 max-mobile-2:gap-5">
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    first name
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    {...register("first_name", nameValidation)}
                    type="text"
                    required
                    defaultValue={userInfo.first_name ?? ""}
                    placeholder="First name *"
                    className="w-full"
                  />
                </div>
                {errors.first_name &&
                  typeof errors.first_name.message === "string" && (
                    <p className="mt-1 text-red-500">
                      {errors.first_name.message}
                    </p>
                  )}
              </Label>
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    Last name
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    {...register("last_name", nameValidation)}
                    type="text"
                    required
                    defaultValue={userInfo.last_name ?? ""}
                    placeholder="Last name *"
                    className="w-full"
                  />
                </div>
                {errors.last_name &&
                  typeof errors.last_name.message === "string" && (
                    <p className="mt-1 text-red-500">
                      {errors.last_name.message}
                    </p>
                  )}
              </Label>
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    email
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    {...register("email")}
                    type="email"
                    required
                    defaultValue={userInfo.email ?? ""}
                    placeholder="Enter * "
                    className="w-full"
                  />
                </div>
                {errors.email && typeof errors.email.message === "string" && (
                  <p className="mt-1 text-red-500">{errors.email.message}</p>
                )}
              </Label>
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    Phone number
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    {...register("phone_number")}
                    type="text"
                    required
                    defaultValue={userInfo.user_detail?.phone_number ?? ""}
                    placeholder="Phone Number"
                    className="w-full"
                  />
                </div>
                {errors.phone_number &&
                  typeof errors.phone_number.message === "string" && (
                    <p className="mt-1 text-red-500">
                      {errors.phone_number.message}
                    </p>
                  )}
              </Label>
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    city
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    {...register("city", nameValidation)}
                    type="text"
                    required
                    defaultValue={userInfo.user_detail?.city ?? ""}
                    placeholder="City *"
                    className="w-full"
                  />
                </div>
                {errors.city && typeof errors.city.message === "string" && (
                  <p className="mt-1 text-red-500">{errors.city.message}</p>
                )}
              </Label>
              <Label className="flex w-full gap-4 flex-col">
                <div>
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    country {userInfo.user_detail?.country ?? ""}
                  </span>
                </div>
                <div className="relative w-full">
                  <Controller
                    control={control}
                    name="country"
                    rules={nameValidation}
                    defaultValue={userInfo.user_detail?.country ?? ""}
                    render={({ field: { onChange, value } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger className="px-6">
                          <SelectValue placeholder="Country *" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.entries(countriesList).map(
                              ([code, name]) => (
                                <SelectItem key={code} value={code}>
                                  <div className="flex gap-2.5 items-center">
                                    {name}
                                  </div>
                                </SelectItem>
                              ),
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.country &&
                  typeof errors.country.message === "string" && (
                    <p className="mt-1 text-red-500">
                      {errors.country.message}
                    </p>
                  )}
              </Label>
              <Button type="submit" className="w-full">
                Save
              </Button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersDetailEdit;
