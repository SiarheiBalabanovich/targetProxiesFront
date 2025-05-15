import React, { useState } from "react";
import { RegisterOptions, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Modal } from "src/components/base/modal";
import { authBg } from "src/assets/images/background/bg-ui.tsx";
import { EyeSlash, MailCheckIcon } from "src/assets/images/icons/icons-ui.tsx";
import { logoV1 } from "src/assets/images/icons/img-ui.ts";
import { Label } from "@radix-ui/react-label";
import { Input } from "ui/input.tsx";
import { Button } from "ui/button.tsx";
import { Eye } from "lucide-react";
import { passwordValidation } from "src/core/utils/validations";
import { recoverUpdate } from "src/core/services/auth";
import { cn } from "components/lib/utils.ts";
import { buttonVariants } from "ui/buttonVariants.tsx";

interface FormData {
  password: string;
  confirmPassword: string;
}

const NewPassword: React.FC = () => {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onBlur",
  });
  const [error, setError] = useState<string | null>(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const query = window.location.search.split("=")[1];

  const confirmPasswordValidation: RegisterOptions = {
    required: "This field is required",
    validate: (value) =>
      value === getValues("password") || "Passwords do not match",
  };

  const onSubmit = async (data: FormData) => {
    const { password, confirmPassword } = data;

    await recoverUpdate(query, password, confirmPassword)
      .then((response) => {
        console.log(response);
        handleActivateClick();
      })
      .catch((error) => {
        setError(error.response?.data.message || "An error occurred");
        setError(null);
      });
  };

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
    <div className="relative flex min-h-screen items-end justify-between bg-black p-[50px] max-[1400px]:flex-col-reverse max-[1400px]:items-center max-1024:p-5 max-[1400px]:justify-center">
      <div className="max-1024:hidden">
        <img
          src={authBg}
          className="absolute object-cover top-0 left-0 h-full"
          alt="background"
        />
        <div className="relative z-1 max-w-[672px] w-full text-[46px] text-[#F7F7F7] font-bold leading-[64.5px] font-['Orbitron']">
          <span>
            Login <br />
            to{" "}
          </span>
          <span className="text-[#00A2CA]">Make a Purchase</span>
          <span>
            {" "}
            <br />
            or to Access <br />
            the{" "}
          </span>
          <span className="text-[#00A2CA]">Customer Dashboard</span>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-1 m-5 flex w-full max-w-[780px] flex-col items-start justify-start gap-6 rounded-[7px] bg-custom-gradient border-[#00A2CA] border-[1px] px-6 pb-4 md:m-auto md:px-[118px] md:pb-10"
      >
        <div className="flex w-full flex-col items-center justify-start gap-9">
          <div>
            <img src={logoV1} alt="Logo" />
          </div>
          <div className="text-[28px] font-bold text-[#F7F7F7] uppercase leading-7 font-['Orbitron'] text-center max-mobile-2:text-2xl">
            New Password
          </div>
        </div>
        <div className="text-[#6F7279] text-center">
          Please create a new password for your account.
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-5 md:gap-5">
          <Label className="flex w-full flex-col items-start justify-start">
            <div className="relative w-full">
              <Input
                {...register("password", passwordValidation)}
                type={passwordShown ? "text" : "password"}
                required
                defaultValue=""
                placeholder="Password *"
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
            {errors.password && typeof errors.password.message === "string" && (
              <p className="mt-1 text-red-500">{errors.password.message}</p>
            )}
          </Label>
          <Label className="flex w-full flex-col items-start justify-start">
            <div className="relative w-full">
              <Input
                {...register("confirmPassword", confirmPasswordValidation)}
                type={passwordShown ? "text" : "password"}
                required
                defaultValue=""
                placeholder="Confirm Password *"
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
            {errors.confirmPassword &&
              typeof errors.confirmPassword.message === "string" && (
                <p className="mt-1 text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
          </Label>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex w-full flex-col items-start justify-start gap-6">
            <Button disabled={!isValid} type="submit" className="w-full">
              Create New Password
            </Button>
            <div className="w-full text-center">
              <span className="leading-tight font-medium text-sm text-[#6F7279]">
                Don&#39;t want to change your password?{" "}
              </span>
              <Link
                to="/login"
                className="font-medium text-sm leading-tight text-[#0085FF] no-underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </form>
      <Modal
        isOpen={modalIsOpen}
        className="max-w-[700px] w-full py-[69px]"
        onClose={handleCloseModal}
      >
        <>
          <div className="max-w-[587px] mx-auto flex flex-col justify-start items-center gap-[45px]">
            <MailCheckIcon />
            <div className="flex-col justify-start items-center gap-[26px] flex">
              <div className="flex-col justify-start items-center gap-[49px] flex max-mobile-2:gap-4">
                <div className="flex-col justify-center items-center gap-[23px] flex">
                  <div className="text-[#F7F7F7] text-3xl font-bold font-['Orbitron'] uppercase leading-[33px] max-mobile-2:text-2xl text-center">
                    Successfully!
                  </div>
                  <div className="text-center text-[#F7F7F7] text-lg font-light leading-7">
                    Your password has been successfully changed.
                  </div>
                </div>
                <div className="justify-center items-start gap-6 inline-flex max-mobile-2:flex-col max-mobile-2:w-full">
                  <Link
                    to="/login"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default NewPassword;
