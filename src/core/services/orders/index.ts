import axios from "axios";

import { ordersList } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getOrders = async (
  token: string,
  offset: number,
  id?: number,
  active?: string,
  limit?: number,
): Promise<ordersList> => {
  const response = await axios.get(
    `${API_BASE_URL}/subscription/customer/order/list?${id ? `user_id=${id}` : ""}&offset=${offset}&limit=${limit ? limit : "10"}${active !== undefined ? `&status=${active}` : ""}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as ordersList;
};

export const getAllOrders = async (
  token: string,
  offset: number,
  limit?: number,
  query_search?: string,
  carrier?: string,
  payment_method?: string,
  order_date_start?: string,
  order_date_end?: string,
  status?: string,
): Promise<ordersList> => {
  const response = await axios.get(
    `${API_BASE_URL}/subscription/allCustomers/orders/list?offset=${offset}&limit=${limit ? limit : "10"}${query_search ? `&query_search=${query_search}` : ""}${carrier ? `&carrier=${carrier}` : ""}${payment_method ? `&payment_method=${payment_method}` : ""}${order_date_start ? `&order_date_start=${order_date_start}` : ""}${order_date_end ? `&order_date_end=${order_date_end}` : ""}${status ? `&status=${status}` : ""}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as ordersList;
};
