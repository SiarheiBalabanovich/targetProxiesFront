import axios from "axios";

import {
  allCustomersStats,
  defaultResponse,
  responseCustomersList,
} from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getAllCustomersStats = async (
  token: string,
): Promise<allCustomersStats> => {
  const response = await axios.get(`${API_BASE_URL}/adminPanel/stats`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as allCustomersStats;
};

export const getCustomersList = async (
  token: string,
  offset: number,
  limit?: number,
): Promise<responseCustomersList> => {
  const response = await axios.get(
    `${API_BASE_URL}/users/list?offset=0&limit=10&offset=${offset}&limit=${limit ? limit : "10"}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as responseCustomersList;
};

export const deleteCustomer = async (
  token: string,
  id: number,
): Promise<defaultResponse> => {
  const response = await axios.delete(`${API_BASE_URL}/users/delete/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response.data as defaultResponse);
  return response.data as defaultResponse;
};
