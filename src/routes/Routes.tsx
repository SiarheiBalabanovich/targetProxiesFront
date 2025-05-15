import { type RouteObject } from "react-router-dom";

import ErrorPage from "src/pages/ErrorPage.tsx";
import Root from "src/pages/Root.tsx";

import HomePage from "src/pages/Home";

import LoginPage from "src/pages/Auth/Login";
import RegisterPage from "src/pages/Auth/Registration";
import NewPassword from "src/pages/Auth/NewPassword";
import ResetPassword from "src/pages/Auth/ResetPassword";

import Dashboard from "src/pages/Dashboard/Customer";
import ClientOverview from "src/pages/Dashboard/Customer/Overview";
import ClientMyProxies from "src/pages/Dashboard/Customer/MyProxies";
import ClientProfileOrders from "src/pages/Dashboard/Customer/ProfileOrders";
import ClientAPIDocumentation from "src/pages/Dashboard/Customer/APIDocumentation";
import ClientSubscription from "src/pages/Dashboard/Customer/Subscription";

import AdminDashboard from "src/pages/Dashboard/Admin";
import AdminAnalytics from "src/pages/Dashboard/Admin/Analytics";
import AdminOrdersOutlet from "src/pages/Dashboard/Admin/PaymentOrder/Orders";
import AdminOrdersList from "src/pages/Dashboard/Admin/PaymentOrder/Orders/OrdersList";
import AdminOrdersDetail from "src/pages/Dashboard/Admin/PaymentOrder/Orders/OrdersDetail";
import AdminDiscountsOutlet from "src/pages/Dashboard/Admin/PaymentOrder/Discounts";
import AdminDiscountsList from "src/pages/Dashboard/Admin/PaymentOrder/Discounts/DiscountsList";
import AdminDiscountsDetail from "src/pages/Dashboard/Admin/PaymentOrder/Discounts/DiscountDetail";
import AdminPagesOutlet from "src/pages/Dashboard/Admin/Pages";
import AdminPagesList from "src/pages/Dashboard/Admin/Pages/PagesList";
import AdminPagesDetail from "src/pages/Dashboard/Admin/Pages/PagesDeteil";
import AdminPagesNew from "src/pages/Dashboard/Admin/Pages/PagesNew";
import AdminUsersOutlet from "src/pages/Dashboard/Admin/UserProfiles";
import AdminUserProfilesList from "src/pages/Dashboard/Admin/UserProfiles/UsersList";
import AdminUsersDetailEdit from "src/pages/Dashboard/Admin/UserProfiles/UsersDetailEdit";
import AdminUsersDetailProfile from "src/pages/Dashboard/Admin/UserProfiles/UsersDetailProfile";
import AdminUsersDetailSubscription from "src/pages/Dashboard/Admin/UserProfiles/UsersDetailSubscription";

export const routes = [
  {
    path: "/login",
    key: "loginPage",
    label: "Login page",
    element: <LoginPage />,
  },
  {
    path: "/registration",
    key: "registerPage",
    label: "Register page",
    element: <RegisterPage />,
  },
  {
    path: "/new-password",
    key: "newPassword",
    label: "New password page",
    element: <NewPassword />,
  },
  {
    path: "/reset-password",
    key: "resetPassword",
    label: "Reset password page",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    key: "dashboard",
    label: "dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "",
        key: "overview",
        label: "Overview",
        element: <ClientOverview />,
      },
      {
        path: "my-proxies",
        key: "myProxies",
        label: "My proxies",
        element: <ClientMyProxies />,
      },
      {
        path: "profile-orders",
        key: "profileOrders",
        label: "Profile and orders",
        element: <ClientProfileOrders />,
      },
      {
        path: "subscriptions",
        key: "subscriptions",
        label: "Subscriptions",
        element: <ClientSubscription />,
      },
      {
        path: "api-documentation",
        key: "APIDocumentation",
        label: "API Documentation",
        element: <ClientAPIDocumentation />,
      },
    ],
  },
  {
    path: "/admin",
    key: "admin",
    label: "Dashboard",
    element: <AdminDashboard />,
    children: [
      {
        path: "",
        key: "analytics",
        label: "Analytics",
        element: <AdminAnalytics />,
      },
      {
        path: "orders",
        key: "customerOrders",
        label: "Customer orders",
        element: <AdminOrdersOutlet />,
        children: [
          {
            path: "",
            key: "orderList",
            label: "Order List",
            element: <AdminOrdersList />,
          },
          {
            path: ":orderId",
            key: "orderDetail",
            label: "Order Detail",
            element: <AdminOrdersDetail />,
          },
        ],
      },
      {
        path: "discounts",
        key: "discounts",
        label: "PaymentDiscounts",
        element: <AdminDiscountsOutlet />,
        children: [
          {
            path: "",
            key: "discountsList",
            label: "Discounts List",
            element: <AdminDiscountsList />,
          },
          {
            path: ":discountId",
            key: "discountDetail",
            label: "discount Detail",
            element: <AdminDiscountsDetail />,
          },
        ],
      },
      {
        path: "user-profiles",
        key: "userProfiles",
        label: "User Profiles",
        element: <AdminUsersOutlet />,
        children: [
          {
            path: "",
            key: "userProfilesList",
            label: "User Profiles List",
            element: <AdminUserProfilesList />,
          },
          {
            path: ":userId",
            key: "userProfilesDetail",
            label: "User Profiles Detail",
            element: <AdminUsersDetailProfile />,
          },
          {
            path: ":userId/edit",
            key: "userProfilesEdit",
            label: "User Profiles Edit",
            element: <AdminUsersDetailEdit />,
          },
          {
            path: ":userId/subscription/:subscriptionId",
            key: "userProfilesSubscription",
            label: "User Profiles Subscription",
            element: <AdminUsersDetailSubscription />,
          },
        ],
      },
      {
        path: "pages",
        key: "pages",
        label: "Pages",
        element: <AdminPagesOutlet />,
        children: [
          {
            path: "",
            key: "pagesList",
            label: "Pages List",
            element: <AdminPagesList />,
          },
          {
            path: ":pageId",
            key: "pageDetail",
            label: "Page Detail",
            element: <AdminPagesDetail />,
          },
          {
            path: "new",
            key: "pagesNew",
            label: "Pages New",
            element: <AdminPagesNew />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    key: "homePage",
    label: "Home page",
    element: <HomePage />,
  },
];

export const appRoutes: RouteObject[] = [
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: routes,
  },
];
