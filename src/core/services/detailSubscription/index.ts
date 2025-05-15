import axios from "axios";

import { detailSubscription } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getDetailSubscriptionList = async (
  token: string,
  id: number,
): Promise<detailSubscription[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/subscription/customer/last?user_id=${id}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as detailSubscription[];
};

export const getSubscriptionList = async (
  token: string,
  id: number,
): Promise<detailSubscription> => {
  const response = await axios.get(
    `${API_BASE_URL}/subscription/customer/charges/list?user_id=${id}&offset=0&limit=10`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as detailSubscription;
};
