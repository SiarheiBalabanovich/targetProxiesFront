import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Modal } from "src/components/base/modal";
import { authBg } from "src/assets/images/background/bg-ui.tsx";
import { MailCheckIcon } from "src/assets/images/icons/icons-ui.tsx";
import { logoV1 } from "src/assets/images/icons/img-ui.ts";
import { Input } from "ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import { Button } from "ui/button.tsx";
import { postRecoveryPassword } from "src/core/services/auth";

interface FormData {
  email: string;
}

const ResetPassword: React.FC = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleActivateClick = (): void => {
    setModalIsOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseModal = (): void => {
    setModalIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  const onSubmit = async (data: FormData) => {
    const { email } = data;

    const response = await postRecoveryPassword(email);

    if (response === "User with this email already exists") {
      setRegistrationError(
        "User with this email already exists. Please try another email.",
      );
    } else {
      setRegistrationError(null);
      handleActivateClick();
    }
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
            Password Recovery
          </div>
        </div>
        <div className="text-[#6F7279] text-center">
          Enter your user account&#39;s verified email address and we will send
          you a password reset link.
        </div>

        <div className="flex w-full flex-col items-start justify-start gap-5 md:gap-5">
          <Label className="flex w-full flex-col">
            <div className="relative w-full">
              <Input
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                type="email"
                placeholder="Email"
              />
            </div>
            {errors.email && typeof errors.email.message === "string" && (
              <p className="mt-1 text-red-500">{errors.email.message}</p>
            )}
          </Label>
          {registrationError && (
            <div className="text-red-500 text-center">{registrationError}</div>
          )}
          <div className="flex w-full flex-col items-start justify-start gap-6">
            <Button type="submit" disabled={!watch("email")} className="w-full">
              Recover Password
            </Button>
            <div className="w-full text-center">
              <span className="leading-tight font-medium text-sm text-[#6F7279]">
                Back to{" "}
              </span>
              <Link
                to="/login"
                className="font-medium text-sm leading-tight text-[#0085FF] no-underline"
              >
                Login
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
                    An email with further instructions has been sent to your
                    email address.
                  </div>
                </div>
                <div className="justify-center items-start gap-6 inline-flex max-mobile-2:flex-col max-mobile-2:w-full">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="max-mobile-2:w-full"
                  >
                    Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default ResetPassword;
