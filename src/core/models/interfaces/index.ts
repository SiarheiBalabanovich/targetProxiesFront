export interface userInfo {
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

export interface balanceInfo {
  total_payment_per_month: number;
  total_purchases: number;
  crypto_balance: number;
}

export interface lastPurchase {
  order_id: number;
  subscription_id: number;
  subscription_item_id: number;
  date_payment: string;
  amount: number;
  is_active: boolean;
  http_ip: string;
  http_port: number;
  socks5_ip: string;
  socks5_port: number;
  carrier_name: string;
  proxy_location: string;
}

export interface upcomingPurchase {
  subscription_id: number;
  subscription_item_id: number;
  carrier_name: string;
  proxy_location: string;
  days_left: number;
}

export interface subscriptionItemProps {
  auto_extend: boolean;
  subscription_id: number;
  subscription_item_id: number;
  payment_per_period: number;
  order_id: number;
  payment_data: {
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
  };
  period_str: string;
  due_date: string;
  expires: number;
}

export interface subscriptionListProps {
  subscriptions: subscriptionItemProps[];
  total: number;
}

export interface ordersItem {
  subscription_id: number;
  subscription_item_id: number;
  price_bought: number;
  carrier: string;
  period_str: string;
  order_id: number;
  order_date: string;
  discount: string;
  discount_code: string;
  is_active: boolean;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  date_created: string;
  amount: number;
  payment_method: string;
  discount_amount: number;
  payment_link: string;
}

export interface ordersList {
  orders: ordersItem[];
  total: number;
}

export interface proxiesItem {
  modem_id: number;
  http_ip: string;
  http_port: number;
  socks5_ip: string;
  socks5_port: number;
  login: string;
  password: string;
  location: string;
  subscription_id: number;
  subscription_item_id: number;
  proxy_id: number;
  discount: number;
  discount_code: string;
  auto_rotation: boolean;
  modem_name: string;
  modem_ip: string;
  modem_port: number;
  expired: string;
  status: boolean;
  api_links_http: {
    rotate: string;
    auto_rotation: string;
    proxy_status: string;
    change_user: string;
  };
  api_links_socks5: {
    rotate: string;
    auto_rotation: string;
    proxy_status: string;
    change_user: string;
  };
}

export interface proxiesList {
  proxies: proxiesItem[];
  total: number;
}

export interface paymentsItem {
  order_id: number;
  payment_date: string;
  subscription_id: number;
  subscription_item_id: number;
  modem_name: string;
  proxy_id: number;
  proxy_location: string;
  period_str: string;
  discount: number;
  amount: number;
  transaction_id: number;
}

export interface paymentsList {
  payments: paymentsItem[];
  total: number;
}

export interface pagesItem {
  name: "string";
  title: "string";
  content: "string";
  comments: "string";
  visibility: "public";
  status: "draft";
  id: 0;
  user_created: {
    id: 0;
    email: "string";
  };
  user_updated: {
    id: 0;
    email: "string";
  };
  date_created: "string";
  date_updated: "string";
}

export interface pagesList {
  pages: pagesItem[];
  total: number;
}

export interface detailSubscription {
  order_id: number;
  payment_date: string;
  subscription_id: number;
  date_end: string;
  subscription_item_id: number;
  transaction_id: number;
  modem_name: string;
  proxy_id: number;
  proxy_location: string;
  period_str: string;
  discount: number;
  amount: number;
  renewal_date: string;
  payment_item_per_month: number;
  next_payment_days: number;
  login: string;
  password: string;
  payment_method: {
    brand: string;
  };
}

export interface analiticsDataItem {
  name: string;
  amount: number;
  period?: string;
}

export interface discountListItem {
  id: number;
  code: string;
  order_amount: number;
  effective_date: string;
  expiry_date: string;
  type: string;
  discount_amount: number;
  limit_users: number | null;
}

export interface defaultResponse {
  status: string;
  message: string;
}

export interface allCustomersStats {
  total: number;
  total_with_active_sub: number;
  total_with_discount: number;
  total_paid: number;
}

export interface responseCustomersList {
  total: number;
  users: userInfo[];
}

export interface notifiesItemProps {
  date_created: string;
  id: number;
  is_read: boolean;
  message: string;
  type: string;
}

export interface notifiesListProps {
  notifies: notifiesItemProps[];
  total: number;
}
