import axios from "axios";

import { paymentsList } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getPayments = async (
  token: string,
  id: number,
  offset: number,
  limit?: number,
): Promise<paymentsList> => {
  const response = await axios.get(
    `${API_BASE_URL}/subscription/customer/charges/list?user_id=${id}&offset=${offset}&limit=${limit ? limit : "10"}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as paymentsList;
};
