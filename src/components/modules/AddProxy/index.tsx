import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "src/hooks/useAppDispatch";
import { AppState } from "src/store/store";
import { closeModal, openModal } from "src/store/actions/modalActions";

import { Modal } from "src/components/base/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ui/tabs.tsx";
import { logoV1 } from "src/assets/images/icons/img-ui.ts";
import { Link } from "react-router-dom";
import { CheckIcon, TicketPercent } from "lucide-react";
import { Button } from "ui/button.tsx";
import { Label } from "ui/label.tsx";
import { Input } from "ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select.tsx";
import { Controller, type RegisterOptions, useForm } from "react-hook-form";
import {
  createProxyBuy,
  createProxyBuyCrypto,
  createProxyBuyCryptoCloud,
} from "src/core/services/buyProxy";
import { RadioGroup, RadioGroupItem } from "ui/radio-group.tsx";
import {
  ATTIcon,
  BankCardIcon,
  Crypto2Icon,
  TMobileIcon,
  VarizonIcon,
} from "src/assets/images/icons/icons-ui.tsx";
import { discountApply } from "src/core/services/discounts";
import { discountListItem } from "src/core/models/interfaces";
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "src/core/utils/cookieHelpers";

const countriesList = [
  { name: "Minnesota", code: "Minnesota" },
  { name: "Illinois/Missouri", code: "Illinois/Missouri" },
];
const nameValidation: RegisterOptions = {
  required: "This field is required",
};

interface FormData {
  proxy: string;
  duration: string;
  paymentMethod: string;
  quantity: number;
  location: string;
}

const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const AddProxy: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalIsOpen = useSelector((state: AppState) => state.modal.isOpen);

  useEffect(() => {
    const openCheckout = getCookie("trgx_openCheckout");
    if (window.location.hash === "#purchase") {
      dispatch(openModal());
    } else if (openCheckout) {
      dispatch(openModal());
      deleteCookie("trgx_openCheckout");
    }
  }, [dispatch]);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      proxy: "",
      duration: "",
      paymentMethod: "",
      quantity: 1,
      location: "",
    },
  });

  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );
  const [couponRegistrationError, setCouponRegistrationError] = useState<
    string | null
  >(null);
  const [currentTab, setCurrentTab] = useState("confirmPurchase");
  const [couponCodeModal, setCouponCodeModal] = useState<boolean>(false);

  const [price, setPrice] = useState<number>(0);
  const [priceWithoutDiscount, setPriceWithoutDiscount] = useState<number>(0);
  const [discount, setDiscount] = useState<discountListItem | null>(null);
  const [discountCode, setDiscountCode] = useState<string>("");

  const selectedProxy = watch("proxy");
  const selectedQuantity = watch("quantity");
  const selectedDuration = watch("duration");
  const selectedLocation = watch("location");

  const handleCloseModal = (): void => {
    dispatch(closeModal());
    document.body.classList.remove("overflow-hidden");
  };

  const calculatePrice = (durationUnit: string, quantity: number): number => {
    let durationPrice = 0;

    switch (durationUnit) {
      case "Day":
        durationPrice = 6;
        break;
      case "Week":
        durationPrice = 40;
        break;
      case "Month":
        durationPrice = 120;
        break;
    }

    return durationPrice * quantity;
  };

  const onSubmit = async (data: FormData) => {
    const { proxy, location, quantity, duration, paymentMethod } = data;

    if (paymentMethod === "Crypto") {
      await createProxyBuyCrypto(
        proxy,
        duration.toLowerCase(),
        1,
        paymentMethod,
        price,
        quantity,
        true,
        location,
        discount?.code ? discount?.code : "",
      )
        .then((data) => {
          if (isValidUrl(data)) {
            window.location.href = data;
          }
        })
        .catch((error) => {
          if (error.response.data.detail) {
            setRegistrationError(error.response.data.detail);
          } else {
            setRegistrationError(null);
          }
        });
    } else if (paymentMethod === "Crypto2") {
      await createProxyBuyCryptoCloud(
        proxy,
        duration.toLowerCase(),
        1,
        paymentMethod,
        price,
        quantity,
        true,
        location,
        discount?.code ? discount?.code : "",
      )
        .then((data) => {
          if (isValidUrl(data)) {
            window.location.href = data;
          }
        })
        .catch((error) => {
          if (error.response.data.detail) {
            setRegistrationError(error.response.data.detail);
          } else {
            setRegistrationError(null);
          }
        });
    } else {
      await createProxyBuy(
        proxy,
        duration.toLowerCase(),
        1,
        paymentMethod,
        price,
        quantity,
        true,
        location,
        discount?.code ? discount?.code : "",
      )
        .then((data) => {
          if (isValidUrl(data)) {
            window.location.href = data;
          }
        })
        .catch((error) => {
          if (error.response.data.detail) {
            setRegistrationError(error.response.data.detail);
          } else {
            setRegistrationError(null);
          }
        });
    }
  };

  useEffect(() => {
    const cookieCarrier = getCookie("trgx_selectedCarrier"); // "ATT" / "T-MOBILE" / "Verizon"
    const cookieLocation = getCookie("trgx_selectedLocation"); // "minnesota" / "illinois/missouri" (URLencoded?)
    const cookiePlan = getCookie("trgx_selectedPlan"); // "monthly" / "weekly" / "24-hours"?

    // Преобразуем план к формату "Day" / "Week" / "Month"
    let durationValue = "";
    if (cookiePlan === "monthly") durationValue = "Month";
    if (cookiePlan === "weekly") durationValue = "Week";
    if (cookiePlan === "24-hours") durationValue = "Day";

    // Раскодируем локацию
    let decodedLoc = cookieLocation ? decodeURIComponent(cookieLocation) : "";
    // Пример: превращаем "illinois/missouri" -> "Illinois/Missouri"
    if (decodedLoc.toLowerCase() === "illinois/missouri") {
      decodedLoc = "Illinois/Missouri";
    }

    // Если хоть что-то не пустое
    if (cookieCarrier || decodedLoc || durationValue) {
      reset({
        proxy: cookieCarrier || "",
        location: decodedLoc || "",
        duration: durationValue || "",
        quantity: 1,
        paymentMethod: "",
      });
    }
  }, [reset]);

  // При изменении proxy/location/duration — пишем обратно в куки
  useEffect(() => {
    if (selectedProxy) {
      setCookie("trgx_selectedCarrier", selectedProxy);
    }
    if (selectedLocation) {
      // Можно привести к нижнему регистру, если нужно
      setCookie("trgx_selectedLocation", selectedLocation);
    }
    // duration -> plan
    if (selectedDuration) {
      let planCookie = "";
      if (selectedDuration === "Day") planCookie = "24-hours";
      if (selectedDuration === "Week") planCookie = "weekly";
      if (selectedDuration === "Month") planCookie = "monthly";
      if (planCookie) {
        setCookie("trgx_selectedPlan", planCookie);
      }
    }
  }, [selectedProxy, selectedLocation, selectedDuration]);

  useEffect(() => {
    const subscription = watch((value) => {
      const { proxy, duration, quantity } = value;
      if (proxy && duration && quantity) {
        let newPrice = calculatePrice(duration, quantity);

        setPriceWithoutDiscount(newPrice);

        if (discount) {
          if (discount.type === "fixed") {
            newPrice -= discount.discount_amount;
          } else if (discount.type === "percentage") {
            newPrice -= (newPrice * discount.discount_amount) / 100;
          }

          if (newPrice < discount.order_amount) {
            setCouponRegistrationError(
              `Discount is not applicable for this order - minimum order amount is $${discount.order_amount}`,
            );
            setDiscount(null);
          }
        }

        setPrice(newPrice);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, discount]);

  // Пересчет цены/скидки при смене любых полей
  useEffect(() => {
    const newPrice = calculatePrice(selectedDuration, selectedQuantity);
    setPriceWithoutDiscount(newPrice);

    let finalPrice = newPrice;
    if (discount) {
      if (discount.type === "fixed") {
        finalPrice -= discount.discount_amount;
      } else if (discount.type === "percentage") {
        finalPrice -= (finalPrice * discount.discount_amount) / 100;
      }
      if (finalPrice < discount.order_amount) {
        setCouponRegistrationError(
          `Discount not applicable — min order is $${discount.order_amount}`,
        );
        setDiscount(null);
      }
    }
    setPrice(finalPrice);
  }, [
    selectedProxy,
    selectedLocation,
    selectedDuration,
    selectedQuantity,
    discount,
  ]);

  const handleNextTab = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleCouponCode = async (couponCode: string) => {
    await discountApply(couponCode)
      .then((data) => {
        if (typeof data !== "string") {
          setDiscount(data);

          let newPrice = priceWithoutDiscount;
          if (data.type === "fixed") {
            newPrice -= data.discount_amount;
          } else if (data.type === "percent") {
            newPrice -= (newPrice * data.discount_amount) / 100;
          }

          if (newPrice < data.order_amount) {
            setCouponRegistrationError(
              `${couponCode} - Discount is not applicable for this order - minimum order amount is $${data.order_amount}`,
            );
            setDiscount(null);
          } else {
            setCouponRegistrationError("");
            setCouponCodeModal(false);
            setPrice(newPrice);
          }
        }
      })
      .catch((error) => {
        if (error.response.data.detail) {
          setCouponRegistrationError(error.response.data.detail);
        } else {
          setCouponRegistrationError(null);
        }
      });
  };

  const removeDiscount = () => {
    setDiscount(null);
    setPrice(priceWithoutDiscount);
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        className="max-w-[100%] m-0 border-none rounded-none min-h-lvh w-full pt-1 pb-10"
        onClose={handleCloseModal}
        background={"bg-[#0E0E16]"}
        marginNo={true}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            defaultValue="confirmPurchase"
            className="w-full rounded-[7px] px-11 flex flex-col gap-20 max-mobile-2:px-0 max-mobile-2:gap-15"
          >
            <TabsList className="h-auto p-0 bg-transparent flex justify-center">
              <Link to={"/"} className="mr-auto max-mobile-2:hidden">
                <img src={logoV1} alt="Logo" />
              </Link>
              <div className="mr-auto relative right-[130px] max-mobile-2:right-0 max-mobile-2:mt-5">
                <TabsTrigger
                  value="confirmPurchase"
                  className="h-[60px] py-4 px-3 bg-transparent text-[#9B9A9D] rounded-none border-b-[#00A2CA] data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-[#00A2CA] data-[state=active]:border-b-[4px] data-[state=active]:border-b-[#00A2CA] data-[state=active]:shadow-none"
                >
                  Confirm Purchase
                </TabsTrigger>
                <TabsTrigger
                  value="checkout"
                  className="pointer-events-none h-[60px] py-4 px-3 bg-transparent text-[#9B9A9D] rounded-none border-b-[#00A2CA] data-[state=active]:bg-transparent data-[state=active]:font-bold data-[state=active]:text-[#00A2CA] data-[state=active]:border-b-[4px] data-[state=active]:border-b-[#00A2CA] data-[state=active]:shadow-none"
                >
                  Checkout
                </TabsTrigger>
              </div>
            </TabsList>
            <TabsContent value="confirmPurchase">
              <div className="max-w-[960px] m-auto w-full flex flex-col gap-5">
                <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
                  Confirm Purchase
                </div>
                <div className="flex gap-6 max-1024:flex-col max-mobile-2:flex-col">
                  <div className="w-full max-w-[512px] flex flex-col gap-6 max-1024:max-w-full max-mobile-2:max-w-full">
                    <Controller
                      control={control}
                      name="proxy"
                      rules={nameValidation}
                      render={({ field: { onChange, value } }) => (
                        <RadioGroup
                          value={value}
                          onValueChange={onChange}
                          className="w-full flex-col justify-start items-start gap-5 flex bg-custom-gradient-3 p-9 rounded-[7px] max-mobile-2:p-3"
                        >
                          <Label className="w-full justify-start items-center gap-4 flex">
                            <RadioGroupItem
                              className="min-w-6 min-h-6"
                              value="Verizon"
                              id="Verizon"
                            />
                            <div className="w-full pr-5 py-5 rounded-[7px] border border-[#00CCFF21] flex-col justify-center items-start gap-2.5 flex max-mobile-2:px-0">
                              <div className="px-6 justify-start items-center gap-4 flex max-mobile-2:px-3 max-mobile-2:gap-2">
                                <VarizonIcon className="w-[135px] h-[46px] max-mobile-2:w-[85px] max-mobile-2:h-[30px]" />
                                <div className="flex-col justify-start items-start gap-2.5 flex">
                                  <div className="flex-col justify-start items-start gap-3 flex">
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        5G Ultra Wideband
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        75mbps - 425mbps
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        Large IP Pool
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        New IP with every rotation
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        Unlimited Data
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Label>
                          <Label className="w-full justify-start items-center gap-4 flex">
                            <RadioGroupItem
                              className="min-w-6 min-h-6"
                              value="T-MOBILE"
                              id="T-MOBILE"
                            />
                            <div className="w-full pr-5 py-5 rounded-[7px] border border-[#00CCFF21] flex-col justify-center items-start gap-2.5 flex max-mobile-2:px-0">
                              <div className="px-6 justify-start items-center gap-4 flex max-mobile-2:px-3 max-mobile-2:gap-2">
                                <TMobileIcon className="w-[135px] h-[46px] max-mobile-2:w-[85px] max-mobile-2:h-[30px]" />
                                <div className="flex-col justify-start items-start gap-2.5 flex">
                                  <div className="flex-col justify-start items-start gap-3 flex">
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        5G Ultra Wideband
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        75mbps - 425mbps
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        Large IP Pool
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        New IP with every rotation
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        Unlimited Data
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Label>
                          <Label className="w-full justify-start items-center gap-4 flex">
                            <RadioGroupItem
                              className="min-w-6 min-h-6"
                              value="ATT"
                              id="ATT"
                            />
                            <div className="w-full pr-5 py-5 rounded-[7px] border border-[#00CCFF21] flex-col justify-center items-start gap-2.5 flex max-mobile-2:px-0">
                              <div className="px-6 justify-start items-center gap-4 flex max-mobile-2:px-3 max-mobile-2:gap-2">
                                <ATTIcon className="w-[135px] h-[46px] max-mobile-2:w-[85px] max-mobile-2:h-[30px]" />
                                <div className="flex-col justify-start items-start gap-2.5 flex">
                                  <div className="flex-col justify-start items-start gap-3 flex">
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        5G Ultra Wideband
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        75mbps - 425mbps
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        Large IP Pool
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        New IP with every rotation
                                      </div>
                                    </div>
                                    <div className="justify-start items-center gap-2 flex">
                                      <CheckIcon className="w-5 h-5 text-[#1B88F6]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        Unlimited Data
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Label>
                        </RadioGroup>
                      )}
                    />
                    {errors.proxy &&
                      typeof errors.proxy.message === "string" && (
                        <p className="mt-1 text-red-500">
                          {errors.proxy.message}
                        </p>
                      )}
                    <div className="w-full p-9 bg-custom-gradient-3 flex flex-col gap-6 rounded-[7px] max-mobile-2:p-6 max-mobile-2:px-4">
                      <Label className="flex w-full gap-4 flex-col">
                        <span className="text-[#6F7279] text-sm uppercase leading-tight">
                          location
                        </span>
                        <div className="relative w-full">
                          <Controller
                            control={control}
                            name="location"
                            rules={nameValidation}
                            render={({ field: { onChange, value } }) => {
                              const filteredCountries = countriesList.filter(
                                (country) => {
                                  switch (selectedProxy) {
                                    case "ATT":
                                      return country.code !== "Minnesota"; // Исключить "Minnesota" для AT&T
                                    case "T-MOBILE":
                                      return (
                                        country.code !== "Illinois/Missouri"
                                      ); // Исключить "Illinois/Missouri" для T-Mobile
                                    case "Verizon":
                                      return country.code === "Minnesota"; // Оставить только "Minnesota" для Verizon
                                    default:
                                      return true; // Все локации доступны, если оператор не выбран
                                  }
                                },
                              );
                              return (
                                <Select value={value} onValueChange={onChange}>
                                  <SelectTrigger className="px-6">
                                    <SelectValue placeholder="Location *" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {filteredCountries.map((item) => (
                                        <SelectItem
                                          key={item.code}
                                          value={item.code}
                                        >
                                          <div className="flex gap-2.5 items-center">
                                            {item.name}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              );
                            }}
                          />
                        </div>
                        {errors.location &&
                          typeof errors.location.message === "string" && (
                            <p className="mt-1 text-red-500">
                              {errors.location.message}
                            </p>
                          )}
                      </Label>
                      <Label className="flex w-full gap-4 flex-col">
                        <span className="text-[#6F7279] text-sm uppercase leading-tight">
                          Subscription Length
                        </span>
                        <div className="relative w-full">
                          <Controller
                            control={control}
                            name="duration"
                            rules={nameValidation}
                            render={({ field: { onChange, value } }) => (
                              <Select value={value} onValueChange={onChange}>
                                <SelectTrigger className="px-6">
                                  <SelectValue placeholder="Subscription Length *" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="Day">
                                      24 hours
                                    </SelectItem>
                                    <SelectItem value="Week">1 Week</SelectItem>
                                    <SelectItem value="Month">
                                      1 Month
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        {errors.duration &&
                          typeof errors.duration.message === "string" && (
                            <p className="mt-1 text-red-500">
                              {errors.duration.message}
                            </p>
                          )}
                      </Label>
                      <Label className="flex w-full gap-4 flex-col">
                        <span className="text-[#6F7279] text-sm uppercase leading-tight">
                          quantity
                        </span>
                        <div className="relative w-full">
                          <Controller
                            name="quantity"
                            control={control}
                            rules={{
                              required: "This required field ",
                              min: { value: 1, message: "Min quantity 1" },
                              max: { value: 10, message: "Max quantity 10" },
                              pattern: {
                                value: /^[0-9]$|^[1-4][0-9]$|^10/,
                                message: "Type count 1 - 10",
                              },
                            }}
                            render={({ field }) => (
                              <Input
                                {...field}
                                min={1}
                                max={10}
                                placeholder="Quantity"
                                className="w-full px-4"
                                autoComplete="off"
                                type="number"
                              />
                            )}
                          />
                        </div>
                        {errors.quantity &&
                          typeof errors.quantity.message === "string" && (
                            <p className="mt-1 text-red-500">
                              {errors.quantity.message}
                            </p>
                          )}
                      </Label>
                      {/*<Label className="flex w-full gap-4 flex-col opacity-0 pointer-events-none h-0">*/}
                      {/*  <span className="text-[#6F7279] text-sm uppercase leading-tight">*/}
                      {/*    auto rotation*/}
                      {/*  </span>*/}
                      {/*  <div className="relative w-full flex items-center gap-2">*/}
                      {/*    <Controller*/}
                      {/*      control={control}*/}
                      {/*      name="autoExtended"*/}
                      {/*      rules={nameValidation}*/}
                      {/*      render={({ field }) => (*/}
                      {/*        // eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                      {/*        <input*/}
                      {/*          type="checkbox"*/}
                      {/*          {...field}*/}
                      {/*          className="peer h-6 w-6 max-w-6 shrink-0 rounded-sm border-2 border-[#22293B] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-custom-gradient-2 data-[state=checked]:text-primary-foreground max-mobile-2:ml-auto"*/}
                      {/*          checked={Boolean(field.value)}*/}
                      {/*          defaultChecked={true}*/}
                      {/*          onChange={(*/}
                      {/*            e: ChangeEvent<HTMLInputElement>,*/}
                      {/*          ) => {*/}
                      {/*            return field.onChange(e.target.checked);*/}
                      {/*          }}*/}
                      {/*        />*/}
                      {/*      )}*/}
                      {/*    />*/}
                      {/*    <span className="text-[#F7F7F7] text-sm leading-tight">*/}
                      {/*      Enable auto rotation*/}
                      {/*    </span>*/}
                      {/*  </div>*/}
                      {/*</Label>*/}
                    </div>
                  </div>
                  <div className="w-full max-w-[423px] flex-col justify-start items-start gap-6 flex max-1024:max-w-full max-mobile-2:max-w-full">
                    <div className="p-9 bg-custom-gradient-3 rounded-[7px] w-full max-mobile-2:px-4 max-mobile-2:py-6">
                      <div className="flex-col justify-start items-start gap-9 flex w-full">
                        <div className="flex-col justify-start items-start gap-6 flex w-full">
                          <div className="text-[#6F7279] font-medium uppercase">
                            order summary
                          </div>
                          <div className="flex-col justify-start items-start gap-6 flex w-full">
                            <div className="text-[#C2C6D1]">
                              {selectedProxy} Proxy - {selectedDuration}
                              {selectedQuantity > 1
                                ? `* (${selectedQuantity} Proxies)`
                                : ""}
                            </div>
                            <div className="w-full h-px bg-custom-gradient-5 rounded-[3px]" />
                            <div className="w-full justify-between items-start flex">
                              <div className="text-[#C2C6D1] text-sm leading-tight">
                                Subtotal
                              </div>
                              <div className="text-[#C2C6D1] text-sm leading-tight">
                                ${priceWithoutDiscount}
                              </div>
                            </div>
                            {discount && (
                              <>
                                <div className="w-full h-px bg-custom-gradient-5 rounded-[3px]" />
                                <div className="w-full justify-between items-start flex">
                                  <div className="text-[#C2C6D1] text-sm leading-tight">
                                    Discount
                                  </div>
                                  <div className="text-[#C2C6D1] text-sm leading-tight text-nowrap">
                                    -{discount.discount_amount}
                                    {discount.type === "fixed" ? "$" : "%"}
                                  </div>
                                </div>
                              </>
                            )}
                            <div className="w-full h-px bg-custom-gradient-5 rounded-[3px]" />
                            <div className="justify-between items-start flex w-full">
                              <div className="text-[#C2C6D1] font-bold">
                                Total
                              </div>
                              <div className="text-[#C2C6D1] font-bold">
                                ${price}
                              </div>
                            </div>
                          </div>
                        </div>
                        {registrationError && (
                          <div className="text-red-500 text-center">
                            {registrationError}
                          </div>
                        )}
                        <Button
                          type="button"
                          onClick={() => handleNextTab("checkout")}
                          disabled={
                            !watch("quantity") ||
                            !watch("duration") ||
                            !watch("location") ||
                            !watch("proxy") ||
                            !isValid
                          }
                          className="w-full"
                        >
                          Checkout
                        </Button>
                      </div>
                    </div>
                    <div className="w-full px-9 py-8 bg-[#161D2D47] rounded-[7px] max-mobile-2:p-6">
                      <div className="w-full justify-between items-center gap-3 flex">
                        <div className="justify-start items-center gap-3 flex">
                          <TicketPercent className="text-[#9B9A9D] w-5 h-5" />
                          <div className="text-[#9B9A9D] max-mobile-2:text-sm">
                            Have a discount?
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => setCouponCodeModal(true)}
                          variant="link"
                          disabled={
                            !watch("quantity") ||
                            !watch("duration") ||
                            !watch("location") ||
                            !watch("proxy")
                          }
                          className="text-[#00A2CA] normal-case p-0 h-auto max-mobile-2:text-sm"
                        >
                          Use a coupon code
                        </Button>
                      </div>
                      {(!watch("quantity") ||
                        !watch("duration") ||
                        !watch("location") ||
                        !watch("proxy")) && (
                        <div className="text-red-500 text-center mt-4 text-[14px]">
                          First specify all the parameters for the purchase
                        </div>
                      )}
                      {couponRegistrationError && (
                        <div className="text-red-500 text-center mt-4 text-[14px]">
                          {couponRegistrationError}
                        </div>
                      )}
                    </div>
                    {discount && (
                      <div className="w-full px-9 py-8 bg-custom-gradient-3 rounded-[7px] max-mobile-2:px-4 max-mobile-2:py-6">
                        <div className="w-full justify-between items-center flex">
                          <div className="justify-start items-center gap-3 flex">
                            <TicketPercent className="text-[#9B9A9D] w-5 h-5" />
                            <div className="text-[#9B9A9D]">
                              {discount.code}
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={() => removeDiscount()}
                            variant="link"
                            className="text-[#D45858] normal-case p-0 h-auto"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="checkout">
              <div className="max-w-[960px] m-auto w-full flex flex-col gap-5">
                <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
                  Select Payment Method
                </div>
                <div className="flex gap-6 max-1024:flex-col max-mobile-2:flex-col">
                  <div className="w-full max-w-[512px] flex flex-col gap-6 max-1024:max-w-full max-mobile-2:max-w-full">
                    <div className="w-full flex-col justify-start items-start gap-5 flex bg-custom-gradient-3 p-9 rounded-[7px] max-mobile-2:px-6 max-mobile-2:py-8">
                      <div className="w-full flex-col justify-start items-start gap-8 flex">
                        <Controller
                          control={control}
                          name="paymentMethod"
                          rules={nameValidation}
                          render={({ field: { onChange, value } }) => (
                            <RadioGroup
                              value={value}
                              onValueChange={onChange}
                              className="w-full flex-col justify-start items-start gap-5 flex bg-custom-gradient-3 p-9 rounded-[7px] max-mobile-2:p-3"
                            >
                              <div className="w-full h-px bg-custom-gradient-5 rounded-[3px]" />
                              <Label className="w-full h-full justify-start items-center gap-5 flex">
                                <RadioGroupItem
                                  className="min-w-6"
                                  value="Card"
                                />
                                <div className="w-full justify-between items-start flex">
                                  <div className="flex-col justify-start items-start gap-1 inline-flex">
                                    <div className="text-[#C2C6D1]">
                                      Credit Card
                                    </div>
                                    <div className="text-zinc-500 text-xs leading-none">
                                      Visa, American Express and MasterCard are
                                      accepted
                                    </div>
                                  </div>
                                  <div className="w-[52px] h-[26px] relative rounded-md border border-[#22293B] flex justify-center items-center">
                                    <BankCardIcon />
                                  </div>
                                </div>
                              </Label>
                              <div className="w-full h-px bg-custom-gradient-5 rounded-[3px]" />
                              <Label className="w-full h-full justify-start items-center gap-5 flex">
                                <RadioGroupItem
                                  className="min-w-6"
                                  value="Crypto"
                                />
                                <div className="w-full justify-between items-center flex">
                                  <div className="text-[#C2C6D1]">Crypto</div>
                                  <div className="w-[52px] h-[26px] rounded-md border border-[#22293B] flex justify-center items-center">
                                    <Crypto2Icon className="w-[18px] h-[18px]" />
                                  </div>
                                </div>
                              </Label>
                              <div className="w-full h-px bg-custom-gradient-5 rounded-[3px]" />
                              <Label className="w-full h-full justify-start items-center gap-5 flex">
                                <RadioGroupItem
                                  className="min-w-6"
                                  value="Crypto2"
                                />
                                <div className="w-full justify-between items-center flex">
                                  <div className="text-[#C2C6D1]">
                                    Crypto Cloud
                                  </div>
                                  <div className="w-[52px] h-[26px] rounded-md border border-[#22293B] flex justify-center items-center">
                                    <Crypto2Icon className="w-[18px] h-[18px]" />
                                  </div>
                                </div>
                              </Label>
                            </RadioGroup>
                          )}
                        />
                        {errors.paymentMethod &&
                          typeof errors.paymentMethod.message === "string" && (
                            <p className="mt-1 text-red-500">
                              {errors.paymentMethod.message}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="text-center text-xs leading-none">
                      <span className="text-[#6F7279]">
                        We do not store any of your credit card details.
                        <br />
                        All payment methods are stored and processed by{" "}
                      </span>
                      <a href="#" className="text-[#00A2CA]">
                        Stripe.
                      </a>
                    </div>
                  </div>
                  <div className="w-full max-w-[423px] flex-col justify-start items-start gap-6 flex max-1024:max-w-full">
                    <div className="p-9 bg-custom-gradient-3 rounded-[7px] w-full max-mobile-2:px-4 max-mobile-2:py-6">
                      <div className="flex-col justify-start items-start gap-9 flex">
                        <div className="flex-col justify-start items-start gap-6 flex w-full">
                          <div className="text-[#6F7279] font-medium uppercase">
                            order summary
                          </div>
                          <div className="w-full flex-col justify-start items-start gap-6 flex">
                            <div className="w-full justify-between items-start flex">
                              <div className="text-[#C2C6D1]">
                                {selectedProxy} Proxy - {selectedDuration}
                              </div>
                              <Button
                                type="button"
                                onClick={() => handleNextTab("confirmPurchase")}
                                variant="link"
                                className="text-[#00A2CA] text-sm p-0 h-auto"
                              >
                                Edit
                              </Button>
                            </div>
                            <div className="w-full h-px bg-custom-gradient-5 rounded-[3px]" />
                            <div className="w-full gap-12 justify-start items-start gap columns-2 max-w-[960px]:columns-1">
                              <div className="min-w-[100px] flex-col justify-start items-start gap-2 flex">
                                <div className="text-[#6F7279] text-xs uppercase leading-none">
                                  Location
                                </div>
                                <div className="text-[#C2C6D1] text-sm leading-tight">
                                  {selectedLocation}
                                </div>
                              </div>
                              <div className="flex-col justify-start items-start gap-2 flex">
                                <div className="text-[#6F7279] text-xs uppercase leading-none">
                                  quantity
                                </div>
                                <div className="text-[#C2C6D1] text-sm leading-tight">
                                  {selectedQuantity}
                                </div>
                              </div>
                            </div>
                            <div className="w-full gap-12 justify-start items-start gap columns-2 max-w-[960px]:columns-1">
                              <div className="min-w-[100px] flex-col justify-start items-start gap-2 flex">
                                <div className="text-[#6F7279] text-xs uppercase leading-none">
                                  Subscription Length
                                </div>
                                <div className="text-[#C2C6D1] text-sm leading-tight">
                                  {selectedDuration}
                                </div>
                              </div>
                              {/*<div className="flex-col justify-start items-start gap-2 flex">*/}
                              {/*  <div className="text-[#6F7279] text-xs uppercase leading-none">*/}
                              {/*    auto-extended*/}
                              {/*  </div>*/}
                              {/*  <div className="text-[#C2C6D1] text-sm leading-tight">*/}
                              {/*    Yes*/}
                              {/*  </div>*/}
                              {/*</div>*/}
                            </div>
                            <div className="w-full h-px bg-custom-gradient-5 rounded-[3px]" />
                            <div className="w-full justify-between items-start flex">
                              <div className="text-[#C2C6D1] text-sm leading-tight">
                                Subtotal
                              </div>
                              <div className="text-[#C2C6D1] text-sm leading-tight">
                                ${priceWithoutDiscount}
                              </div>
                            </div>
                            {discount && (
                              <>
                                <div className="w-full h-px bg-custom-gradient-5 rounded-[3px]" />
                                <div className="w-full justify-between items-start flex">
                                  <div className="text-[#C2C6D1] text-sm leading-tight">
                                    Discount
                                  </div>
                                  <div className="text-[#C2C6D1] text-sm leading-tight text-nowrap">
                                    -{discount.discount_amount}
                                    {discount.type === "fixed" ? "$" : "%"}
                                  </div>
                                </div>
                              </>
                            )}
                            <div className="w-full h-px bg-custom-gradient-5 rounded-[3px]" />
                            <div className="justify-between items-start flex w-full">
                              <div className="text-[#C2C6D1] font-bold">
                                Total
                              </div>
                              <div className="text-[#C2C6D1] font-bold">
                                ${price}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          disabled={
                            !watch("quantity") ||
                            !watch("duration") ||
                            !watch("location") ||
                            !watch("proxy") ||
                            !watch("paymentMethod")
                          }
                          className="w-full"
                        >
                          PAY NOW
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Modal>
      <Modal
        isOpen={couponCodeModal}
        className="max-w-[910px] w-full border-0 px-8 py-10"
        onClose={() => setCouponCodeModal(false)}
      >
        <div className="flex-col justify-start items-center gap-[60px] flex mt-[70px] max-mobile-1:mt-12">
          <div className="flex-col justify-start items-center gap-6 flex">
            <div className="text-[#F7F7F7] text-3xl font-bold font-['Orbitron'] text-center uppercase leading-[33px] max-mobile-1:text-2xl">
              use coupon code
            </div>
            <Label className="flex w-full flex-col items-center justify-start gap-2  max-w-[430px]">
              <div className="text-[#9B9A9D] text-sm leading-tight">
                Enter the code and claim your discount
              </div>
              <div className="relative w-full">
                <Input
                  type="text"
                  onChange={(e) => {
                    setDiscountCode(e.target.value);
                  }}
                  required
                  placeholder="Coupon code"
                />
              </div>
            </Label>
            {couponRegistrationError && (
              <div className="text-red-500 text-center">
                {couponRegistrationError}
              </div>
            )}
          </div>
          <div className="w-full flex gap-5 justify-center max-mobile-2:flex-col max-mobile-2:w-full">
            <Button
              variant="secondary"
              onClick={() => setCouponCodeModal(false)}
              className="max-mobile-2:w-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => handleCouponCode(discountCode)}
              variant="default"
              className="max-w-[240px] w-full max-mobile-2:max-w-full"
            >
              Activate
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
