import React, { useEffect, useState } from "react";
import { Controller, RegisterOptions, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
// import { Modal } from "src/components/base/modal";
import { authBg } from "src/assets/images/background/bg-ui.tsx";
import {
  EyeSlash,
  GoogleIcon,
  MailCheckIcon,
  MailIcon,
} from "src/assets/images/icons/icons-ui.tsx";
import { logoV1 } from "src/assets/images/icons/img-ui.ts";
import { Input } from "ui/input.tsx";
import { Label } from "@radix-ui/react-label";
import { Button } from "ui/button.tsx";
import { RadioGroup, RadioGroupItem } from "ui/radio-group.tsx";
import { Checkbox } from "ui/checkbox.tsx";
import { createUser, emailSend, emailVerify } from "src/core/services/auth";
import { cn } from "components/lib/utils.ts";
import { buttonVariants } from "ui/buttonVariants.tsx";
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
import { authRedirect } from "src/core/utils/authRedirect";
import {
  emailValidation,
  nameValidation,
  passwordValidation,
} from "src/core/utils/validations";
import { Eye } from "lucide-react";
import axios from "axios";
import { handleGoogle, useGoogleAuthEffect } from "src/core/utils/googleAuth";
import ReCAPTCHA from "react-google-recaptcha";

countries.registerLocale(english);
const countriesList = countries.getNames("en", { select: "official" });

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

function decryptVerifyParam(verifyParam: string): [string, string] {
  const decoded = atob(verifyParam);
  return decoded.split("::") as [string, string];
}

interface FormData {
  _user_firstName_user_: string;
  _user_lastName_user_: string;
  _user_email_user_: string;
  _user_password_user_: string;
  _user_survey_user_: string;
  _user_surveyDetail_user_?: string;
  _user_phoneNumber_user_: string;
  _user_city_user_: string;
  _user_country_user_: string;
  _user_confirmPassword_user_: string;
  termsOfService: string;
  agreeNotUse: string;
  codeAuth: string;
}

const Registration: React.FC = () => {
  const {
    control,
    register,
    getValues,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onBlur",
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const urlSearchParams = new URLSearchParams(window.location.search);
  const verifyParam = urlSearchParams.get("verify");
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);

  useEffect(() => {
    const handleAnimationStart = (event: AnimationEvent) => {
      if (event.animationName === "onAutoFillStart") {
        const input = event.target as HTMLInputElement;
        setValue(input.name as keyof FormData, input.value, {
          shouldValidate: true,
        });
      }
    };

    document.addEventListener("animationstart", handleAnimationStart, false);
    return () => {
      document.removeEventListener("animationstart", handleAnimationStart);
    };
  }, [setValue]);

  // if (verifyParam) {
  //   const [email, codeAuth] = decryptVerifyParam(verifyParam);

  //   // Вызов функции верификации
  //   emailVerify(email, codeAuth).finally(() => {
  //     handleActivateClick();
  //   });
  // }

  const handleRecaptchaChange = (value: string | null) => {
  setRecaptchaValue(value);
  };

  const togglePasswordVisibility = (): void => {
    setPasswordShown(!passwordShown);
  };

  const handleNext = async () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!recaptchaValue) {
        setRegistrationError("Please complete the reCAPTCHA.");
        return;
      }

      // await emailSend(getValues("_user_email_user_"))
      //   .then(() => {
      //     setCurrentStep(currentStep + 1);
      //     setRegistrationError("");
      //   })
      //   .catch((error) => {
      //     setRegistrationError(error.response.data.detail);
      //   });
      handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleActivateClick = (): void => {
    setModalIsOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseModal = (): void => {
    setModalIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  useEffect(() => {
    authRedirect();
  }, []);

  const confirmPasswordValidation: RegisterOptions = {
    required: "This field is required",
    validate: (value) =>
      value === getValues("_user_password_user_") || "Passwords do not match",
  };

  const onSubmit = async (data: FormData) => {
    const {
      // codeAuth,
      _user_firstName_user_,
      _user_lastName_user_,
      _user_email_user_,
      _user_password_user_,
      _user_survey_user_,
      _user_surveyDetail_user_,
      _user_phoneNumber_user_,
      _user_city_user_,
      _user_country_user_,
    } = data;

    try {
      // await emailVerify(email, codeAuth);
      const response = await createUser(
        _user_firstName_user_,
        _user_lastName_user_,
        _user_email_user_,
        _user_password_user_,
        _user_survey_user_,
        _user_surveyDetail_user_ ?? undefined,
        _user_phoneNumber_user_,
        _user_city_user_,
        _user_country_user_,
        recaptchaValue
      );

      if (
        response === "User with this email already exists" ||
        response === "Entered code is wrong" ||
        response === "Entered code is expired"
      ) {
        setRegistrationError(response);
      } else {
        setRegistrationError(null);
        setRegistrationSuccess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setRegistrationError(error.response.data.message);
      } else if (error instanceof Error) {
        setRegistrationError(error.message);
      } else {
        console.error("An error occurred during registration:", error);
        setRegistrationError("An unexpected error occurred. Please try again.");
      }
    }
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
            sign up
          </div>
        </div>
        <div className="w-full flex gap-4 flex-col">
          <div>
            {/* Tabs/Steps */}
            <div className="flex w-full flex-col items-start justify-start gap-4 md:gap-8">
              {/* Content */}
              {currentStep === 1 && (
                <div className="w-full flex flex-col gap-6 max-mobile-2:gap-4">
                  <div className="text-center">
                    <span className="text-[#F7F7F7] text-base font-medium leading-7">
                      Step 1/2:
                    </span>
                    <span className="text-neutral-400 text-base font-normal leading-7">
                      {" "}
                      Account creation
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 md:gap-5">
                    <div className="flex w-full items-start justify-start gap-6 max-mobile-2:flex-col max-mobile-2:gap-4">
                      <Label className="flex w-full flex-col">
                        <div className="relative w-full">
                          <Input
                            {...register(
                              "_user_firstName_user_",
                              nameValidation,
                            )}
                            autoComplete="off"
                            type="text"
                            required
                            placeholder="First Name *"
                          />
                        </div>
                        {errors._user_firstName_user_ &&
                          typeof errors._user_firstName_user_.message ===
                            "string" && (
                            <p className="mt-1 text-red-500">
                              {errors._user_firstName_user_.message}
                            </p>
                          )}
                      </Label>

                      <Label className="flex w-full flex-col">
                        <div className="relative w-full">
                          <Input
                            {...register(
                              "_user_lastName_user_",
                              nameValidation,
                            )}
                            type="text"
                            required
                            autoComplete="off"
                            placeholder="Last Name *"
                          />
                        </div>
                        {errors._user_lastName_user_ &&
                          typeof errors._user_lastName_user_.message ===
                            "string" && (
                            <p className="mt-1 text-red-500">
                              {errors._user_lastName_user_.message}
                            </p>
                          )}
                      </Label>
                    </div>
                    <div className="flex w-full items-start justify-start gap-6 max-mobile-2:flex-col max-mobile-2:gap-4">
                      <Label className="flex w-full flex-col">
                        <div className="relative w-full">
                          <Input
                            {...register("_user_email_user_", emailValidation)}
                            type="email"
                            required
                            autoComplete="off"
                            placeholder="Enter email *"
                          />
                        </div>
                        {errors._user_email_user_ &&
                          typeof errors._user_email_user_.message ===
                            "string" && (
                            <p className="mt-1 text-red-500">
                              {errors._user_email_user_.message}
                            </p>
                          )}
                      </Label>

                      <Label className="flex w-full flex-col">
                        <div className="relative w-full">
                          <Input
                            {...register("_user_phoneNumber_user_")}
                            type="tel"
                            required
                            autoComplete="off"
                            placeholder="Phone Number"
                          />
                        </div>
                        {errors._user_phoneNumber_user_ &&
                          typeof errors._user_phoneNumber_user_.message ===
                            "string" && (
                            <p className="mt-1 text-red-500">
                              {errors._user_phoneNumber_user_.message}
                            </p>
                          )}
                      </Label>
                    </div>

                    <div className="flex w-full items-start justify-start gap-6 max-mobile-2:flex-col max-mobile-2:gap-4">
                      <Label className="flex w-full flex-col">
                        <div className="relative w-full">
                          <Input
                            {...register("_user_city_user_", nameValidation)}
                            type="text"
                            required
                            placeholder="City *"
                            autoComplete="off"
                          />
                        </div>
                        {errors._user_city_user_ &&
                          typeof errors._user_city_user_.message ===
                            "string" && (
                            <p className="mt-1 text-red-500">
                              {errors._user_city_user_.message}
                            </p>
                          )}
                      </Label>
                      <Label className="flex w-full flex-col">
                        <div className="relative w-full">
                          <Controller
                            control={control}
                            name="_user_country_user_"
                            rules={nameValidation}
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
                        {errors._user_country_user_ &&
                          typeof errors._user_country_user_.message ===
                            "string" && (
                            <p className="mt-1 text-red-500">
                              {errors._user_country_user_.message}
                            </p>
                          )}
                      </Label>
                    </div>

                    <Label className="flex w-full gap-4 flex-col">
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        Password
                      </span>
                      <div className="relative w-full">
                        <Input
                          {...register(
                            "_user_password_user_",
                            passwordValidation,
                          )}
                          type={passwordShown ? "text" : "password"}
                          required
                          defaultValue=""
                          autoComplete="off"
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
                      {errors._user_password_user_ &&
                        typeof errors._user_password_user_.message ===
                          "string" && (
                          <p className="mt-1 text-red-500">
                            {errors._user_password_user_.message}
                          </p>
                        )}
                    </Label>
                    <Label className="flex w-full gap-4 flex-col">
                      <span className="text-[#6F7279] text-sm uppercase leading-tight">
                        Confirm Password
                      </span>
                      <div className="relative w-full">
                        <Input
                          {...register(
                            "_user_confirmPassword_user_",
                            confirmPasswordValidation,
                          )}
                          type={passwordShown ? "text" : "password"}
                          required
                          defaultValue=""
                          placeholder="Confirm Password *"
                          autoComplete="off"
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
                      {errors._user_confirmPassword_user_ &&
                        typeof errors._user_confirmPassword_user_.message ===
                          "string" && (
                          <p className="mt-1 text-red-500">
                            {errors._user_confirmPassword_user_.message}
                          </p>
                        )}
                    </Label>

                    <Label
                      htmlFor="termsOfService"
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        required
                        id="termsOfService"
                        {...register("termsOfService", {
                          required: true,
                        })}
                        checked={true}
                      />
                      <span className="text-[#6F7279] text-sm">
                        I have read and agree to the Terms of Service.
                      </span>
                    </Label>

                    <Label
                      htmlFor="agreeNotUse"
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        required
                        id="agreeNotUse"
                        {...register("agreeNotUse", { required: true })}
                        checked={true}
                      />
                      <span className="text-[#6F7279] text-sm">
                        I agree NOT to use the service for financial websites or
                        any illegal activity
                      </span>
                    </Label>

                    <div className="mt-2 flex w-full flex-col items-start justify-start gap-6">
                      <Button
                        onClick={handleNext}
                        disabled={!isValid}
                        className="w-full"
                      >
                        Create Account
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
                        <span className="leading-tight text-[#6F7279] text-sm">
                          Already have an account?{" "}
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
                </div>
              )}
              {currentStep === 2 && (
                <div className="w-full flex flex-col gap-6 max-mobile-2:gap-4">
                  <div className="text-center">
                    <span className="text-[#F7F7F7] text-base font-medium leading-7">
                      Step 2/2:
                    </span>
                    <span className="text-neutral-400 text-base font-normal leading-7">
                      {" "}
                      Short survey
                    </span>
                  </div>
                  <div className="w-full flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                      <div className="text-gray-300 text-lg font-medium leading-7">
                        Where did your here about us?
                      </div>
                      <Controller
                        control={control}
                        name="_user_survey_user_"
                        rules={nameValidation}
                        render={({ field: { onChange, value } }) => (
                          <RadioGroup
                            value={value}
                            onValueChange={onChange}
                            required
                            defaultValue="option-1"
                            className="text-[#C2C6D1] grid-cols-[150px_auto] gap-x-[60px] gap-y-5 max-sm:gap-x-[16px] max-[360px]:grid-cols-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Google" id="option-1" />
                              <Label htmlFor="option-1">Google</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="MP Social" id="option-2" />
                              <Label htmlFor="option-2">MP Social</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="BlackHatWorld"
                                id="option-3"
                              />
                              <Label htmlFor="option-3">BlackHatWorld</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="YouTube" id="option-4" />
                              <Label htmlFor="option-4">YouTube</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Instagram" id="option-5" />
                              <Label htmlFor="option-5">Instagram</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Email" id="option-6" />
                              <Label htmlFor="option-6">Email</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Facebook" id="option-7" />
                              <Label htmlFor="option-7">Facebook</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Other" id="option-8" />
                              <Label htmlFor="option-8">Other</Label>
                            </div>
                          </RadioGroup>
                        )}
                      />
                      {errors._user_survey_user_ &&
                        typeof errors._user_survey_user_.message ===
                          "string" && (
                          <p className="mt-1 text-red-500">
                            {errors._user_survey_user_.message}
                          </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <span className="text-gray-300 text-lg font-medium leading-7">
                          What locations would you like us to carry in the
                          future?{" "}
                        </span>
                        <span className="text-red-500">*</span>
                      </div>
                      <Label className="flex w-full flex-col">
                        <div className="relative w-full">
                          <Controller
                            control={control}
                            name="_user_surveyDetail_user_"
                            rules={nameValidation}
                            render={({ field: { onChange, value } }) => (
                              <Select value={value} onValueChange={onChange}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {US_STATES.map((state) => (
                                      <SelectItem key={state} value={state}>
                                        {state}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        {errors._user_surveyDetail_user_ &&
                          typeof errors._user_surveyDetail_user_.message ===
                            "string" && (
                            <p className="mt-1 text-red-500">
                              {errors._user_surveyDetail_user_.message}
                            </p>
                          )}
                      </Label>
                    </div>
                    {registrationError && (
                      <div className="text-red-500 text-center">
                        {registrationError}
                      </div>
                    )}
                    {registrationSuccess && (
  <div className="text-green-500 text-center">
    Registration successful! You can now{" "}
    <Link to="/login" className="underline text-blue-400">
      log in
    </Link>.
  </div>
)}
                    <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={handleRecaptchaChange}
                    />
                    <div
                      className={`flex gap-6 items-center justify-between max-sm:gap-3`}
                    >
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={handleBack}
                      >
                        back
                      </Button>
                      <Button
                        disabled={!isValid}
                        type="submit"
                        onClick={handleNext}
                        className="w-full"
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {/* {currentStep === 3 && (
                <div className="w-full flex flex-col gap-6 max-mobile-2:gap-4">
                  <div className="text-center">
                    <span className="text-[#F7F7F7] text-base font-medium leading-7">
                      Step 3/3:
                    </span>
                    <span className="text-neutral-400 text-base font-normal leading-7">
                      {" "}
                      Verify email address
                    </span>
                    <MailIcon className="mx-auto mt-6" />
                  </div>
                  <div className="text-[#F7F7F7] text-3xl font-bold font-['Orbitron'] uppercase leading-[33px] max-mobile-2:text-2xl text-center">
                    Verify Your Email Address
                  </div>
                  <div>
                    <div className="flex-col justify-start items-center gap-10 flex">
                      <div className="w-full max-w-[541px] text-center text-[#C2C6D1] text-base font-normal leading-normal">
                        To complete your registration, please check your e-mail
                        address. We have sent a confirmation link to the e-mail
                        address you provided during registration. Please click
                        on that link to confirm and complete the registration
                        process.
                      </div>
                      {registrationError && (
                        <div className="text-red-500 text-center">
                          {registrationError}
                        </div>
                      )} */}

                      {/*<Label className="flex max-w-[400px] m-auto w-full flex-col">*/}
                      {/*  <div className="relative w-full">*/}
                      {/*    <Input*/}
                      {/*      {...register("_user_codeAuth_user_", nameValidation)}*/}
                      {/*      type="text"*/}
                      {/*      required*/}
                      {/*      placeholder="Code auth"*/}
                      {/*    />*/}
                      {/*  </div>*/}
                      {/*  {errors._user_codeAuth_user_ &&*/}
                      {/*    typeof errors._user_codeAuth_user_.message === "string" && (*/}
                      {/*      <p className="mt-3 text-red-500">*/}
                      {/*        {errors._user_codeAuth_user_.message}*/}
                      {/*      </p>*/}
                      {/*    )}*/}
                      {/*</Label>*/}

                      {/*<div className="flex-col justify-start items-center gap-9 flex max-mobile-2:w-full">*/}
                      {/*  <Button*/}
                      {/*    type="submit"*/}
                      {/*    className="max-w-[217px] w-full max-mobile-2:max-w-full"*/}
                      {/*  >*/}
                      {/*    Verify Email*/}
                      {/*  </Button>*/}
                      {/*  <div className="opacity-90 text-center">*/}
                      {/*    <span className="text-[#6F7279] text-sm font-normal leading-7">*/}
                      {/*      Didn`t receive an email?{" "}*/}
                      {/*    </span>*/}
                      {/*    <a*/}
                      {/*      href="#"*/}
                      {/*      className="text-[#0085FF] text-sm font-bold leading-7"*/}
                      {/*    >*/}
                      {/*      Resend*/}
                      {/*    </a>*/}
                      {/*  </div>*/}
                      {/*</div>*/}
                    {/* </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </form>
      {/* <Modal
        isOpen={modalIsOpen}
        className="max-w-[1017px] w-full pt-[69px] pb-[114px] p-5"
        onClose={handleCloseModal}
      >
        <>
          <div className="max-w-[587px] mx-auto flex flex-col justify-start items-center gap-[45px]">
            <MailCheckIcon />
            <div className="flex-col justify-start items-center gap-[26px] flex">
              <div className="flex-col justify-start items-center gap-[49px] flex max-mobile-2:gap-4">
                <div className="flex-col justify-center items-center gap-[23px] flex">
                  <div className="text-[#F7F7F7] text-3xl font-bold font-['Orbitron'] uppercase leading-[33px] max-mobile-2:text-2xl text-center">
                    Email Successfully Verified
                  </div>
                  <div className="text-center text-[#F7F7F7] text-lg font-light leading-7">
                    Thank you for confirming your email address. Your
                    registration is now complete, and you're ready to explore
                    our platform. Welcome aboard!
                  </div>
                </div>
                <div className="justify-center items-start gap-6 inline-flex max-mobile-2:flex-col max-mobile-2:w-full max-mobile-2:gap-4"> */}
                  {/*<Link*/}
                  {/*  to={"/login"}*/}
                  {/*  className={`${cn(*/}
                  {/*    buttonVariants({ variant: "outline", size: "default" }),*/}
                  {/*  )} max-mobile-2:w-full`}11*/}
                  {/*  onClick={handleCloseModal}*/}
                  {/*>*/}
                  {/*  Login to Account*/}
                  {/*</Link>*/}
                  {/* <Link
                    to={"/login"}
                    className={`${cn(
                      buttonVariants({ variant: "default", size: "default" }),
                    )} max-mobile-2:w-full`}
                    onClick={handleCloseModal}
                  >
                    Login to Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      </Modal> */}
    </div>
  );
};

export default Registration;