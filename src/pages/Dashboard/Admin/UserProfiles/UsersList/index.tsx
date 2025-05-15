import React, { useEffect, useState } from "react";

import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import {
  DottedIcon,
  EyeSlash,
  ProfileCheckIcon,
} from "src/assets/images/icons/icons-ui.tsx";
import {
  Eye,
  MoveDownLeft,
  MoveUpRight,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "ui/input.tsx";
import { Button } from "ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/table.tsx";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "ui/menubar.tsx";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select.tsx";
import { AdminDeleteModal } from "src/components/modules/AdminDeleteModal";
import { Modal } from "src/components/base/modal";
import {
  deleteCustomer,
  getAllCustomersStats,
  getCustomersList,
} from "src/core/services/allCustomers";
import {
  allCustomersStats,
  responseCustomersList,
} from "src/core/models/interfaces";
import PaginationList from "components/modules/Pagination";
import { Controller, useForm } from "react-hook-form";
import { createUser } from "src/core/services/auth";
import { RadioGroup, RadioGroupItem } from "ui/radio-group.tsx";
import countries from "i18n-iso-countries";
import english from "i18n-iso-countries/langs/en.json";
import { Skeleton } from "ui/skeleton.tsx";
import {
  emailValidation,
  nameValidation,
  passwordValidation,
} from "src/core/utils/validations";
import { toast } from "sonner";

countries.registerLocale(english);
const countriesList = countries.getNames("en", { select: "official" });

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  survey: string;
  surveyDetail: string;
  phoneNumber: string;
  city: string;
  country: string;
}

const AdminUserProfilesList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<FormData>({ mode: "onBlur" });
  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { errors: errors, isValid },
    reset: reset,
  } = form;
  const [searchQuery, setSearchQuery] = useState(""); // Добавлено состояние для поискового запроса
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsAddUserOpen, setModalIsAddUserOpen] = useState(false);
  const [customersStats, setCustomersStats] = useState<allCustomersStats>(
    {} as allCustomersStats,
  );
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [customersList, setCustomersList] = useState<responseCustomersList>({
    users: [], // Ensure users is initialized to an empty array
    total: 0,
  });
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = customersList?.total
    ? Math.ceil(customersList.total / itemsPerPage)
    : 0;
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = (): void => {
    setPasswordShown(!passwordShown);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const onSubmit = async (data: FormData) => {
    const {
      firstName,
      lastName,
      email,
      password,
      survey,
      surveyDetail,
      phoneNumber,
      city,
      country,
    } = data;
    
    const recaptchaToken = null;
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        // Attempt to create the user
        const response = await createUser(
          firstName,
          lastName,
          email,
          password,
          survey,
          surveyDetail,
          phoneNumber,
          city,
          country,
          recaptchaToken
        );

        if (response === "User with this email already exists") {
          setRegistrationError(
            "Email is already taken. Please use a different email.",
          );
          toast.error("Email is already taken. Please use a different email.");
        } else {
          setRegistrationError(null);
          const updatedCustomersList = await getCustomersList(
            token,
            0,
            itemsPerPage,
          );
          reset();
          setCustomersList(updatedCustomersList);
          handleCloseAddUserClick();
          toast.success("User created successfully");
        }
      } catch (error) {
        console.error("An error occurred during user creation:", error);
        setRegistrationError("An error occurred during user creation");
      }
    }
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        setCustomersStats(await getAllCustomersStats(token));
        setCustomersList(
          await getCustomersList(
            token,
            (currentPage - 1) * itemsPerPage,
            itemsPerPage,
          ),
        );
        setIsLoading(false);
      }
    })();
  }, [currentPage]);

  const customersReverse = (): void => {
    setCustomersList((prevState) => {
      if (!prevState) {
        return { users: [], total: 0 };
      }
      const { users, total } = prevState;
      return {
        ...prevState,
        users: [...users].reverse(),
        total,
      };
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = customersList?.users.filter((user) =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = (): void => {
    if (deleteId) {
      (async () => {
        const token = localStorage.getItem("authToken");

        if (token) {
          try {
            await deleteCustomer(token, deleteId);

            try {
              setCustomersList(await getCustomersList(token, 0, itemsPerPage));
              setCurrentPage(1);
            } catch (error) {
              console.log("getCustomersList - Error");
            }
            handleCloseModal();
          } catch (error) {
            console.log("deleteCustomer - Error");
          }
        }
      })();
    }
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

  const handleAddUserClick = (): void => {
    setModalIsAddUserOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseAddUserClick = (): void => {
    setModalIsAddUserOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={7} admin={true} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="User & Profilies" admin={true} />
        <div className="flex flex-col gap-5 w-full max-w-[1416px]">
          <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
            User Profiles
          </div>
          <div className="w-full flex flex-col gap-6 max-mobile-2:gap-5">
            <div className="w-full grid grid-cols-4 gap-6 max-mobile-1:grid-cols-2 max-mobile-1:gap-5 max-mobile-2:grid-cols-1">
              <div className="px-[26px] py-6 bg-custom-gradient-3 rounded-[7px] flex-col justify-start items-start gap-2 flex w-full">
                <div className="flex-col justify-start items-start gap-3 flex w-full">
                  <div className="flex justify-between gap-3 w-full">
                    <div className="text-[#9B9A9D] text-sm font-medium uppercase">
                      Total Users
                    </div>
                    <div className="w-10 h-10 bg-[#212A38] flex justify-center items-center rounded-xl">
                      <ProfileCheckIcon className="text-[#C2C6D1]" />
                    </div>
                  </div>
                  <div className="text-[#C2C6D1] text-[32px] font-semibold leading-9">
                    {isLoading ? (
                      <>
                        <Skeleton className="w-9 h-9 rounded-xl" />
                      </>
                    ) : (
                      customersStats.total
                    )}
                  </div>
                </div>
                <div className="justify-start items-center gap-1.5 flex opacity-0">
                  <div className="justify-center items-center gap-2.5 w-4 h-4 flex rounded-full bg-[#0F211A]">
                    <MoveUpRight className="text-[#31AA7A] w-2.5 h-2.5" />
                  </div>
                  <div className="text-[#31AA7A] text-sm font-medium">+15%</div>
                </div>
              </div>
              <div className="px-[26px] py-6 bg-custom-gradient-3 rounded-[7px] flex-col justify-start items-start gap-2 flex w-full">
                <div className="flex-col justify-start items-start gap-3 flex w-full">
                  <div className="flex justify-between gap-3 w-full">
                    <div className="text-[#9B9A9D] text-sm font-medium uppercase">
                      Users with an active Subscription
                    </div>
                    <div className="w-10 h-10 bg-[#212A38] flex justify-center items-center rounded-xl">
                      <ProfileCheckIcon className="text-[#C2C6D1]" />
                    </div>
                  </div>
                  <div className="text-[#C2C6D1] text-[32px] font-semibold leading-9">
                    {isLoading ? (
                      <>
                        <Skeleton className="w-9 h-9 rounded-xl" />
                      </>
                    ) : (
                      customersStats.total_with_active_sub
                    )}
                  </div>
                </div>
                <div className="justify-start items-center gap-1.5 flex opacity-0">
                  <div className="justify-center items-center gap-2.5 w-4 h-4 flex rounded-full bg-[#0F211A]">
                    <MoveUpRight className="text-[#31AA7A] w-2.5 h-2.5" />
                  </div>
                  <div className="text-[#31AA7A] text-sm font-medium">+15%</div>
                </div>
              </div>
              <div className="px-[26px] py-6 bg-custom-gradient-3 rounded-[7px] flex-col justify-start items-start gap-2 flex w-full">
                <div className="flex-col justify-start items-start gap-3 flex w-full">
                  <div className="flex justify-between gap-3 w-full">
                    <div className="text-[#9B9A9D] text-sm font-medium uppercase">
                      Users with Discount
                    </div>
                    <div className="w-10 h-10 bg-[#212A38] flex justify-center items-center rounded-xl">
                      <ProfileCheckIcon className="text-[#C2C6D1]" />
                    </div>
                  </div>
                  <div className="text-[#C2C6D1] text-[32px] font-semibold leading-9">
                    {isLoading ? (
                      <>
                        <Skeleton className="w-9 h-9 rounded-xl" />
                      </>
                    ) : (
                      customersStats.total_with_discount
                    )}
                  </div>
                </div>
                <div className="justify-start items-center gap-1.5 flex opacity-0">
                  <div className="justify-center items-center gap-2.5 w-4 h-4 flex rounded-full bg-[#271519]">
                    <MoveDownLeft className="text-[#D45858] w-2.5 h-2.5" />
                  </div>
                  <div className="text-[#D45858] text-sm font-medium">
                    -3.5%
                  </div>
                </div>
              </div>
              <div className="px-[26px] py-6 bg-custom-gradient-3 rounded-[7px] flex-col justify-start items-start gap-2 flex w-full">
                <div className="flex-col justify-start items-start gap-3 flex w-full">
                  <div className="flex justify-between gap-3 w-full">
                    <div className="text-[#9B9A9D] text-sm font-medium uppercase">
                      Paid Users
                    </div>
                    <div className="w-10 h-10 bg-[#212A38] flex justify-center items-center rounded-xl">
                      <ProfileCheckIcon className="text-[#C2C6D1]" />
                    </div>
                  </div>
                  <div className="text-[#C2C6D1] text-[32px] font-semibold leading-9">
                    {isLoading ? (
                      <>
                        <Skeleton className="w-9 h-9 rounded-xl" />
                      </>
                    ) : (
                      customersStats.total_paid
                    )}
                  </div>
                </div>
                <div className="justify-start items-center gap-1.5 flex opacity-0">
                  <div className="justify-center items-center gap-2.5 w-4 h-4 flex rounded-full bg-[#0F211A]">
                    <MoveUpRight className="text-[#31AA7A] w-2.5 h-2.5" />
                  </div>
                  <div className="text-[#31AA7A] text-sm font-medium">+15%</div>
                </div>
              </div>
            </div>
            <div className="w-full bg-custom-gradient-3 rounded-[7px] px-4 py-5 gap-7 flex flex-col justify-start items-start xl:px-7">
              <div className="w-full flex flex-col gap-5">
                <div className="justify-between items-start flex w-full gap-5 max-mobile-2:flex-col">
                  <div className="flex-col justify-start items-start gap-1.5 flex">
                    <div className="text-[#9B9A9D] text-sm font-medium uppercase">
                      customer subscriptions
                    </div>
                    <div className="text-[#D8DADF] text-sm">
                      Manage your users from the dashboard
                    </div>
                  </div>
                  <Select
                    defaultValue="Newest first"
                    onValueChange={customersReverse}
                  >
                    <SelectTrigger className="w-[124px] h-8 px-3 py-1.5 gap-2 text-xs max-mobile-2:w-full">
                      <SelectValue placeholder="Newest first" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Newest first">
                          Newest first
                        </SelectItem>
                        <SelectItem value="Newest last">Newest last</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="justify-between items-end flex w-full gap-5 max-mobile-2:flex-col">
                  <Button
                    variant="blue"
                    size="xs"
                    onClick={handleAddUserClick}
                    className="max-mobile-2:w-full"
                  >
                    add user
                  </Button>
                  <Label className="flex w-full flex-col items-start justify-start max-w-[444px] max-mobile-2:max-w-full">
                    <div className="relative w-full">
                      <button
                        type={"button"}
                        className="absolute left-0-0 top-0 p-2.5 border-none bg-transparent"
                      >
                        <Search className="text-[#6F7279] w-5 h-5" />
                      </button>
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="py-2.5 pr-3 pl-10 h-10"
                        placeholder="Search user"
                      />
                    </div>
                  </Label>
                </div>
              </div>
              <div className="w-full flex-col justify-start items-center gap-[39px] inline-flex">
                {isLoading ? (
                  <>
                    <Skeleton className="w-full h-[50vh] rounded-xl" />
                  </>
                ) : (
                  <div className="w-full flex-col justify-start items-start gap-6 flex">
                    {customersList && customersList.total > 0 ? (
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
                          <TableRow>
                            <TableHead className="py-2.5 h-[60px]">
                              first name
                            </TableHead>
                            <TableHead className="py-2.5 h-[60px]">
                              last name
                            </TableHead>
                            <TableHead className="py-2.5 h-[60px]">
                              email
                            </TableHead>
                            <TableHead className="py-2.5 h-[60px] text-right">
                              ACTION
                            </TableHead>
                          </TableRow>
                          <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
                        </TableHeader>
                        <TableBody>
                          {filteredUsers?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell
                                data-label="first name"
                                className="h-[72px] max-mobile-1:h-auto text-[#F7F7F7] text-base "
                              >
                                {item.first_name}
                              </TableCell>
                              <TableCell
                                data-label="last name"
                                className="h-[72px] max-mobile-1:h-auto text-[#9B9A9D] text-base"
                              >
                                {item.last_name}
                              </TableCell>
                              <TableCell
                                data-label="email"
                                className="h-[72px] max-mobile-1:h-auto text-[#F7F7F7] text-base "
                              >
                                {item.email}
                              </TableCell>
                              <TableCell
                                data-label="ACTION"
                                className="h-[72px] max-mobile-1:h-auto text-right"
                              >
                                {item.role !== "admin" && (
                                  <Menubar className="justify-end pr-4">
                                    <MenubarMenu>
                                      <MenubarTrigger className="ml-auto">
                                        <DottedIcon className="w-5 h-5 text-[#C2C6D1] cursor-pointer" />
                                      </MenubarTrigger>
                                      <MenubarContent>
                                        <MenubarItem className="p-0 [&_a]:px-5 [&_a]:py-2.5">
                                          <Link
                                            to={`${item.id}`}
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
                                            handleActivateClick(item.id)
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
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="mx-auto">
                        <div className="text-[#C2C6D1] text-base font-medium mt-5">
                          No orders found
                        </div>
                      </div>
                    )}
                    {customersList && customersList.total > itemsPerPage && (
                      <PaginationList
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageClick={handlePageClick}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdminDeleteModal
        isOpen={modalIsOpen}
        onClose={handleCloseModal}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={modalIsAddUserOpen}
        className="max-w-[962px] w-full border-0 px-8 py-10"
        onClose={handleCloseAddUserClick}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 max-mobile-2:gap-5"
        >
          <div className="w-full flex-col justify-start items-center gap-8 max-mobile-2:gap-5">
            <div className="text-gray-300 text-2xl font-medium leading-[32px]">
              Add User
            </div>
          </div>
          <div className="w-full h-px bg-custom-gradient-5" />
          <div className="w-full flex flex-col grid-cols-2 gap-x-6 gap-y-3 min-mobile-2:gap-y-8 max-mobile-2:grid-cols-1 min-mobile-2:grid">
            <Label className="flex w-full gap-4 flex-col">
              <div>
                <span className="text-[#6F7279] text-sm uppercase leading-tight">
                  first name
                </span>
              </div>
              <div className="relative w-full">
                <Input
                  type="text"
                  required
                  {...register("firstName", nameValidation)}
                  placeholder="First name"
                  className="w-full px-3"
                />
              </div>
              {errors.firstName &&
                typeof errors.firstName.message === "string" && (
                  <p className="mt-1 text-red-500">
                    {errors.firstName.message}
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
                  type="text"
                  required
                  {...register("lastName", nameValidation)}
                  placeholder="Last name"
                  className="w-full px-3"
                />
              </div>
              {errors.lastName &&
                typeof errors.lastName.message === "string" && (
                  <p className="mt-1 text-red-500">{errors.lastName.message}</p>
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
                  type="email"
                  required
                  {...register("email", emailValidation)}
                  placeholder="Email"
                  className="w-full px-3"
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
                  type="text"
                  required
                  {...register("phoneNumber", nameValidation)}
                  placeholder="Phone number"
                  className="w-full px-3"
                />
              </div>
              {errors.phoneNumber &&
                typeof errors.phoneNumber.message === "string" && (
                  <p className="mt-1 text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
            </Label>
            {/*TETETETET*/}
            <Label className="flex w-full gap-4 flex-col">
              <div>
                <span className="text-[#6F7279] text-sm uppercase leading-tight">
                  City
                </span>
              </div>
              <div className="relative w-full">
                <Input
                  type="text"
                  required
                  {...register("city", nameValidation)}
                  placeholder="City"
                  className="w-full px-3"
                />
              </div>
              {errors.city && typeof errors.city.message === "string" && (
                <p className="mt-1 text-red-500">{errors.city.message}</p>
              )}
            </Label>
            <Label className="flex w-full gap-4 flex-col">
              <div>
                <span className="text-[#6F7279] text-sm uppercase leading-tight">
                  Country
                </span>
              </div>
              <div className="relative w-full">
                <Controller
                  control={form.control}
                  name="country"
                  rules={nameValidation}
                  render={({ field: { onChange, value } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger className="px-6">
                        <SelectValue placeholder="Country *" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(countriesList).map(([code, name]) => (
                            <SelectItem key={code} value={code}>
                              <div className="flex gap-2.5 items-center">
                                {name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.country && typeof errors.country.message === "string" && (
                <p className="mt-1 text-red-500">{errors.country.message}</p>
              )}
            </Label>
            <Label className="flex w-full gap-4 flex-col">
              <div>
                <span className="text-[#6F7279] text-sm uppercase leading-tight">
                  Password
                </span>
              </div>
              <div className="relative w-full">
                <Input
                  type={passwordShown ? "text" : "password"}
                  required
                  {...register("password", passwordValidation)}
                  placeholder="Password"
                  className="w-full px-3"
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
              {errors.password &&
                typeof errors.password.message === "string" && (
                  <p className="mt-1 text-red-500">{errors.password.message}</p>
                )}
            </Label>
            <Label className="flex w-full gap-4 flex-col">
              <div>
                <span className="text-[#6F7279] text-sm uppercase leading-tight">
                  locations would you like us to carry in the future
                </span>
              </div>
              <div className="relative w-full">
                <Input
                  type="text"
                  {...register("surveyDetail", nameValidation)}
                  placeholder="Product location"
                  className="w-full px-3"
                />
              </div>
              {errors.surveyDetail &&
                typeof errors.surveyDetail.message === "string" && (
                  <p className="mt-1 text-red-500">
                    {errors.surveyDetail.message}
                  </p>
                )}
            </Label>
            <Label className="flex w-full gap-4 flex-col col-span-2">
              <div>
                <span className="text-[#6F7279] text-sm uppercase leading-tight">
                  Where did your here about us?
                </span>
              </div>
              <div className="relative w-full">
                <Controller
                  control={form.control}
                  name="survey"
                  rules={nameValidation}
                  render={({ field: { onChange, value } }) => (
                    <RadioGroup
                      value={value}
                      onValueChange={onChange}
                      className="text-[#C2C6D1] grid-cols-[150px_150px_150px_150px] gap-x-[60px] gap-y-5 max-sm:gap-x-[16px] max-mobile-1:grid-cols-2 max-mobile-4:grid-cols-1"
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
                        <RadioGroupItem value="BlackHatWorld" id="option-3" />
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
                {errors.survey && typeof errors.survey.message === "string" && (
                  <p className="mt-1 text-red-500">{errors.survey.message}</p>
                )}
              </div>
            </Label>
          </div>
          {registrationError && (
            <div className="text-red-500 text-center">{registrationError}</div>
          )}
          <div className="flex gap-5 justify-center">
            <Button variant="secondary" onClick={handleCloseAddUserClick}>
              Cancel
            </Button>
            <Button
              variant="default"
              type="submit"
              disabled={!isValid}
              className="max-w-[240px] w-full"
            >
              SUBMIT
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUserProfilesList;
