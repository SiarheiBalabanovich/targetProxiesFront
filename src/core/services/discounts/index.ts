import axios from "axios";

import { defaultResponse, discountListItem } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const discountsList = async (
  token: string,
): Promise<discountListItem[]> => {
  const response = await axios.get(`${API_BASE_URL}/discounts`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as discountListItem[];
};

export const discountsDetail = async (
  token: string,
  discount_id: number,
): Promise<discountListItem> => {
  const response = await axios.get(`${API_BASE_URL}/discount/${discount_id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as discountListItem;
};

export const discountApply = async (
  code: string,
): Promise<discountListItem | string> => {
  const response = await axios.get(
    `${API_BASE_URL}/discounts/apply?code=${code}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  return response.data as discountListItem | string;
};

export const createDiscount = async (
  token: string,
  code: string,
  order_amount: number,
  effective_date: string,
  expiry_date: string,
  type: string,
  discount_amount: number,
  limit_users?: number,
): Promise<string> => {
  const response = await axios.post(
    `${API_BASE_URL}/discount?&type=${type}&code=${code}${discount_amount !== null ? `&discount_amount=${discount_amount}` : ""}&order_amount=${order_amount}${limit_users !== undefined ? `&limit_users=${limit_users}` : ""}&effective_date=${effective_date}&expiry_date=${expiry_date}`,
    null,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as string;
};

export const updateDiscount = async (
  token: string,
  id: number,
  code: string,
  order_amount: number,
  effective_date: string,
  expiry_date: string,
  type: string,
  discount_amount: number,
  limit_users?: number,
): Promise<string> => {
  const response = await axios.patch(
    `${API_BASE_URL}/discount/${id}?&type=${type}&code=${code}${discount_amount !== null ? `&discount_amount=${discount_amount}` : ""}&order_amount=${order_amount}${limit_users !== undefined ? `&limit_users=${limit_users}` : ""}&effective_date=${effective_date}&expiry_date=${expiry_date}`,
    null,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as string;
};

export const deleteDiscount = async (
  token: string,
  id: number,
): Promise<defaultResponse> => {
  const response = await axios.delete(`${API_BASE_URL}/discount/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as defaultResponse;
};
