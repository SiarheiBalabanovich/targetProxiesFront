import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { authBg } from "src/assets/images/background/bg-ui.tsx";
import { EyeSlash, GoogleIcon } from "src/assets/images/icons/icons-ui.tsx";
import { logoV1 } from "src/assets/images/icons/img-ui.ts";
import { Button } from "ui/button.tsx";
import { Input } from "ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import { Checkbox } from "ui/checkbox.tsx";
import { getAuthToken, getUserInfo } from "src/core/services/auth";
import { useDispatch } from "react-redux";
import { setStoreUserInfo } from "src/store/slices/userInfoSlice.ts";
import { authRedirect } from "src/core/utils/authRedirect";
import { emailValidation } from "src/core/utils/validations";
import { handleGoogle, useGoogleAuthEffect } from "src/core/utils/googleAuth";

interface FormData {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>({ mode: "onBlur" });
  const [passwordShown, setPasswordShown] = useState(false);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    authRedirect();
  }, []);

  const onSubmit = async (data: FormData) => {
    const { email, password, remember } = data;
    await getAuthToken(email, password, remember)
      .then(async (response) => {
        localStorage.setItem("authToken", response);

        await getUserInfo(response)
          .then((userInfo) => {
            dispatch(setStoreUserInfo(userInfo));

            if (userInfo.role === "customer") {
              window.location.href = "/dashboard";
            } else if (userInfo.role === "admin") {
              window.location.href = "/admin";
            }
          })
          .catch(() => {
            setErrorLogin("Login or password is incorrect");
          });
      })
      .catch(() => {
        setErrorLogin("Login or password is incorrect");
      });
  };

  const togglePasswordVisibility = (): void => {
    setPasswordShown(!passwordShown);
  };

  useGoogleAuthEffect();

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
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-1 m-5 flex w-full max-w-[780px] flex-col items-start justify-start gap-6 rounded-[7px] bg-custom-gradient border-[#00A2CA] border-[1px] px-6 pb-4 md:m-auto md:px-[118px] md:pb-10"
      >
        <div className="flex w-full flex-col items-center justify-start gap-9">
          <div>
            <img src={logoV1} alt="Logo" />
          </div>
          <div className="text-[28px] font-bold text-[#F7F7F7] uppercase leading-7 font-['Orbitron'] text-center max-mobile-2:text-2xl">
            log in
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-4 md:gap-5">
          <Label className="flex w-full flex-col">
            <div className="relative w-full">
              <Input
                name="fakeemailremembered"
                className="hidden"
                type="email"
                placeholder="Email"
              />
              <Input
                {...register("email", emailValidation)}
                type="email"
                placeholder="Email"
              />
            </div>
          </Label>
          <Label className="flex w-full flex-col items-start justify-start">
            <div className="relative w-full">
              <Input
                name="fakepasswordremembered"
                className="hidden"
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
              />
              <Input
                {...register("password", { required: true })}
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
              />
              <button
                onClick={togglePasswordVisibility}
                type={"button"}
                className="absolute right-0 top-0 p-4 border-none bg-transparent"
              >
                <EyeSlash className="text-[#6F7279] text-sm" />
              </button>
            </div>
          </Label>
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-5 md:gap-7">
          <div className="flex w-full justify-between">
            <Label className="flex items-center gap-2">
              <Checkbox {...register("remember")} />
              <span className="text-[#6F7279] text-sm">Remember me</span>
            </Label>
            <Link
              to="/reset-password"
              className="text-[#00A2CA] text-sm no-underline"
            >
              Forgot password?
            </Link>
          </div>
          {errorLogin && <div className="text-red-500">{errorLogin}</div>}
          <Button type="submit" className="w-full">
            login
          </Button>
          <div className="max-w-full w-full h-5 justify-between items-center inline-flex">
            <div className="max-w-[45%] w-full h-px bg-slate-800" />
            <div className="text-[#F7F7F7] text-sm font-light leading-tight">
              or
            </div>
            <div className="max-w-[45%] w-full h-px  -rotate-180 bg-slate-800" />
          </div>
          <Button
            type="button"
            onClick={handleGoogle}
            variant="secondary"
            className="normal-case w-full"
          >
            <GoogleIcon /> Continue with Google
          </Button>
          <div className="w-full text-center">
            <span className="leading-tight font-medium text-sm text-[#6F7279]">
              Don`t have an account?{` `}
            </span>
            <Link
              to="/registration"
              className="font-medium text-sm leading-tight text-[#0085FF] no-underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
