import React, { useEffect, useState } from "react";
import { Controller, type RegisterOptions, useForm } from "react-hook-form";

import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/tabs";
import { Input } from "ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import {
  EyeSlash,
  LockIcon,
  RequestIcon,
} from "src/assets/images/icons/icons-ui.tsx";
import { Button } from "ui/button.tsx";
import { Modal } from "components/base/modal";
import { Orders } from "components/modules/Orders";
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
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "src/store/store.ts";
import { changePassword, updateUserInfo } from "src/core/services/editProfile";
import { getUserInfo } from "src/core/services/auth";
import { setStoreUserInfo } from "src/store/slices/userInfoSlice.ts";
import { nameValidation, passwordValidation } from "src/core/utils/validations";
import { Eye } from "lucide-react";
import { toast } from "sonner";

countries.registerLocale(english);
const countriesList = countries.getNames("en", { select: "official" });

interface FormData1 {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  city: string;
  country: string;
}

interface FormData2 {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const ClientProfileOrders: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const userInfo = useSelector((state: AppState) => state.userInfo);
  const dispatch = useDispatch();
  const form1 = useForm<FormData1>();
  const form2 = useForm<FormData2>();
  const [passwordShown, setPasswordShown] = useState(false);

  const {
    register: registerForm1,
    reset: resetForm1,
    setValue: setValueForm1,
    handleSubmit: handleSubmitForm1,
    formState: { errors: errorsForm1 },
  } = form1;

  const {
    register: registerForm2,
    handleSubmit: handleSubmitForm2,
    getValues: getValues,
    formState: { errors: errorsForm2 },
  } = form2;

  const confirmPasswordValidation: RegisterOptions = {
    required: "This field is required",
    validate: (value) =>
      value === getValues("new_password") || "Passwords do not match",
  };

  const onSubmitUpdateUser = async (data: FormData1) => {
    const { first_name, last_name, email, phone_number, city, country } = data;

    try {
      const response = await updateUserInfo(
        userInfo.id,
        first_name,
        last_name,
        email,
        userInfo.user_detail?.survey,
        userInfo.user_detail?.survey_detail,
        phone_number,
        city,
        country,
      );

      toast.success("Profile updated successfully");
      console.log("Response from updateUserInfo:", response);
      const token = localStorage.getItem("authToken");
      if (token) {
        const userInfo = await getUserInfo(token);
        dispatch(setStoreUserInfo(userInfo));
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const onSubmitPassword = async (data: FormData2) => {
    const { current_password, new_password, confirm_password } = data;

    try {
      const response = await changePassword(
        current_password,
        new_password,
        confirm_password,
      );
      handleCloseModal();
      toast.success("Password changed successfully");
      console.log("Response from updateUserInfo:", response);
      form2.reset();
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const userInfo = await getUserInfo(token);
          dispatch(setStoreUserInfo(userInfo));
          resetForm1();
          setValueForm1("country", userInfo.user_detail?.country);
        } catch (error) {
          console.log("GetUserInfo", error);
        }
      }
    })();
  }, [dispatch, resetForm1, setValueForm1]);

  const handleActivateClick = (): void => {
    setModalIsOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseModal = (): void => {
    setModalIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  const togglePasswordVisibility = (): void => {
    setPasswordShown(!passwordShown);
  };
  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={3} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="Profile and Orders" />
        <div className="max-w-[1416px] w-full">
          <Tabs
            defaultValue="information"
            className="w-full bg-[#0B101D] rounded-[7px] px-10 py-4 max-tablet:px-4"
          >
            <TabsList className="h-auto p-0 bg-transparent">
              <TabsTrigger
                className="h-[60px] py-4 px-3 bg-transparent text-base text-[#9B9A9D] rounded-none border-b-[#00A2CA] data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-[#00A2CA] data-[state=active]:border-b-[2px] data-[state=active]:border-b-[#00A2CA] data-[state=active]:shadow-none"
                value="information"
              >
                My Information
              </TabsTrigger>
              <TabsTrigger
                className="h-[60px] py-4 px-3 bg-transparent text-base text-[#9B9A9D] rounded-none border-b-[#00A2CA] data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-[#00A2CA] data-[state=active]:border-b-[2px] data-[state=active]:border-b-[#00A2CA] data-[state=active]:shadow-none"
                value="orders"
              >
                Orders
              </TabsTrigger>
            </TabsList>
            <div className="h-px w-full bg-custom-gradient-5"></div>
            <TabsContent className="mt-9" value="information">
              <form
                onSubmit={handleSubmitForm1(onSubmitUpdateUser)}
                className="flex-col justify-start items-start gap-[60px] flex max-mobile-2:gap-9"
              >
                <div className="w-full grid grid-cols-3 gap-x-6 gap-y-8 max-mobile-1:grid-cols-2 max-mobile-1:gap-y-6  max-mobile-2:grid-cols-1 max-mobile-1:gap-y-5">
                  <Label className="flex w-full gap-4 flex-col">
                    <div>
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        first name{" "}
                      </span>
                      <span className="text-red-500 text-sm uppercase leading-tight">
                        *
                      </span>
                    </div>
                    <div className="relative w-full">
                      <Input
                        {...registerForm1("first_name", nameValidation)}
                        type="text"
                        required
                        defaultValue={userInfo.first_name}
                        placeholder="First name *"
                        className="w-full"
                      />
                    </div>
                    {errorsForm1.first_name &&
                      typeof errorsForm1.first_name.message === "string" && (
                        <p className="mt-1 text-red-500">
                          {errorsForm1.first_name.message}
                        </p>
                      )}
                  </Label>
                  <Label className="flex w-full gap-4 flex-col">
                    <div>
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        Last name{" "}
                      </span>
                      <span className="text-red-500 text-sm uppercase leading-tight">
                        *
                      </span>
                    </div>
                    <div className="relative w-full">
                      <Input
                        {...registerForm1("last_name", nameValidation)}
                        type="text"
                        required
                        defaultValue={userInfo.last_name}
                        placeholder="Last name *"
                        className="w-full"
                      />
                    </div>
                    {errorsForm1.last_name &&
                      typeof errorsForm1.last_name.message === "string" && (
                        <p className="mt-1 text-red-500">
                          {errorsForm1.last_name.message}
                        </p>
                      )}
                  </Label>
                  <Label className="flex w-full gap-4 flex-col">
                    <div>
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        E-mail{" "}
                      </span>
                      <span className="text-red-500 text-sm uppercase leading-tight">
                        *
                      </span>
                    </div>
                    <div className="relative w-full">
                      <Input
                        {...registerForm1("email")}
                        type="email"
                        required
                        defaultValue={userInfo.email}
                        placeholder="Enter * "
                        className="w-full"
                      />
                    </div>
                    {errorsForm1.email &&
                      typeof errorsForm1.email.message === "string" && (
                        <p className="mt-1 text-red-500">
                          {errorsForm1.email.message}
                        </p>
                      )}
                  </Label>
                  <Label className="flex w-full gap-4 flex-col">
                    <div>
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        Phone Number{" "}
                      </span>
                      <span className="text-red-500 text-sm uppercase leading-tight">
                        *
                      </span>
                    </div>
                    <div className="relative w-full">
                      <Input
                        {...registerForm1("phone_number")}
                        type="text"
                        required
                        defaultValue={userInfo.user_detail?.phone_number ?? ""}
                        placeholder="Phone Number"
                        className="w-full"
                      />
                    </div>
                    {errorsForm1.phone_number &&
                      typeof errorsForm1.phone_number.message === "string" && (
                        <p className="mt-1 text-red-500">
                          {errorsForm1.phone_number.message}
                        </p>
                      )}
                  </Label>
                  <Label className="flex w-full gap-4 flex-col">
                    <div>
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        City{" "}
                      </span>
                      <span className="text-red-500 text-sm uppercase leading-tight">
                        *
                      </span>
                    </div>
                    <div className="relative w-full">
                      <Input
                        {...registerForm1("city", nameValidation)}
                        type="text"
                        required
                        defaultValue={userInfo.user_detail?.city ?? ""}
                        placeholder="City *"
                        className="w-full"
                      />
                    </div>
                    {errorsForm1.city &&
                      typeof errorsForm1.city.message === "string" && (
                        <p className="mt-1 text-red-500">
                          {errorsForm1.city.message}
                        </p>
                      )}
                  </Label>
                  <Label className="flex w-full gap-4 flex-col">
                    <div>
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        Country{" "}
                      </span>
                      <span className="text-red-500 text-sm uppercase leading-tight">
                        *
                      </span>
                    </div>
                    <div className="relative w-full">
                      <Controller
                        control={form1.control}
                        name="country"
                        rules={nameValidation}
                        defaultValue={userInfo.user_detail?.country}
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
                    {errorsForm1.country &&
                      typeof errorsForm1.country.message === "string" && (
                        <p className="mt-1 text-red-500">
                          {errorsForm1.country.message}
                        </p>
                      )}
                  </Label>
                  <Button type="submit" className="w-full">
                    Save
                  </Button>
                </div>
              </form>
              <div className="mt-[60px] flex-col w-full justify-start items-start gap-6 flex">
                <div className="text-[#6F7279] text-sm font-medium uppercase leading-normal">
                  account
                </div>
                <div className="pr-10 py-8 w-full bg-custom-gradient-6 rounded-[7px] justify-between items-center gap-2.5 flex flex-wrap max-mobile-2:p-6">
                  <Button
                    variant="ghost"
                    className="pointer-events-none max-mobile-2:px-0"
                  >
                    <LockIcon />
                    Password
                  </Button>
                  <Button
                    onClick={handleActivateClick}
                    variant="secondary"
                    className="w-auto text-red-500 text-sm font-medium leading-tight"
                  >
                    <RequestIcon />
                    Change Password
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent className="mt-9" value="orders">
              <div className="w-full flex-col justify-start items-center gap-[39px] inline-flex">
                <div className="w-full flex-col justify-start items-start gap-6 flex">
                  <div className="px-4 text-[#6F7279] text-sm font-medium uppercase leading-normal">
                    inactive products
                  </div>
                  <div className="w-full max-tablet:px-0">
                    <Orders active={"failed"} perPage={12} />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        className="max-w-[500px] w-full pb-10"
        onClose={handleCloseModal}
      >
        <div className="flex flex-col gap-9 w-full px-9 py-8 max-mobile-1:p-0">
          <div className="flex flex-col gap-8 w-full">
            <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
              Change Password
            </div>
            <div className="w-full bg-custom-gradient-5 h-px" />
            <form
              onSubmit={handleSubmitForm2(onSubmitPassword)}
              className="flex-col justify-start items-start gap-[60px] flex max-mobile-2:gap-9"
            >
              <div className="w-full grid grid-cols-1 gap-x-6 gap-y-8">
                <Label className="flex w-full gap-4 flex-col">
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    Current password
                  </span>
                  <div className="relative w-full">
                    <Input
                      {...registerForm2("current_password", nameValidation)}
                      type={passwordShown ? "text" : "password"}
                      required
                      defaultValue=""
                      placeholder="Current password"
                      className="w-full"
                    />
                    <button
                      onClick={togglePasswordVisibility}
                      type={"button"}
                      className="absolute right-0 top-0 p-4 border-none bg-transparent"
                    >
                      <EyeSlash className="text-[#6F7279] text-sm" />
                    </button>
                  </div>
                  {errorsForm2.current_password &&
                    typeof errorsForm2.current_password.message ===
                      "string" && (
                      <p className="mt-1 text-red-500">
                        {errorsForm2.current_password.message}
                      </p>
                    )}
                </Label>
                <Label className="flex w-full gap-4 flex-col">
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    New password
                  </span>
                  <div className="relative w-full">
                    <Input
                      {...registerForm2("new_password", passwordValidation)}
                      type={passwordShown ? "text" : "password"}
                      required
                      defaultValue=""
                      placeholder="New password"
                      className="w-full"
                    />
                    <button
                      onClick={togglePasswordVisibility}
                      type={"button"}
                      className="absolute right-0 top-0 p-4 border-none bg-transparent"
                    >
                      {passwordShown ? (
                        <Eye className="text-[#6F7279] text-sm w-6 h-6" />
                      ) : (
                        <EyeSlash className="text-[#6F7279] text-sm w-6 h-6" />
                      )}
                    </button>
                  </div>
                  {errorsForm2.new_password &&
                    typeof errorsForm2.new_password.message === "string" && (
                      <p className="mt-1 text-red-500">
                        {errorsForm2.new_password.message}
                      </p>
                    )}
                </Label>
                <Label className="flex w-full gap-4 flex-col">
                  <span className="text-[#6F7279] text-sm uppercase leading-tight">
                    Confirm password
                  </span>
                  <div className="relative w-full">
                    <Input
                      {...registerForm2(
                        "confirm_password",
                        confirmPasswordValidation,
                      )}
                      type={passwordShown ? "text" : "password"}
                      required
                      defaultValue=""
                      placeholder="Confirm password"
                      className="w-full"
                    />
                    <button
                      onClick={togglePasswordVisibility}
                      type={"button"}
                      className="absolute right-0 top-0 p-4 border-none bg-transparent"
                    >
                      {passwordShown ? (
                        <Eye className="text-[#6F7279] text-sm w-6 h-6" />
                      ) : (
                        <EyeSlash className="text-[#6F7279] text-sm w-6 h-6" />
                      )}
                    </button>
                  </div>
                  {errorsForm2.confirm_password &&
                    typeof errorsForm2.confirm_password.message ===
                      "string" && (
                      <p className="mt-1 text-red-500">
                        {errorsForm2.confirm_password.message}
                      </p>
                    )}
                </Label>
              </div>
              <div className="w-full flex gap-5 justify-center max-mobile-2:flex-col">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  type="submit"
                  className="max-w-[240px] w-full"
                >
                  update password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientProfileOrders;
