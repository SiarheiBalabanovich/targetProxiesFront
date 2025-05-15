import axios from "axios";

import { lastPurchase } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getLastPurchase = async (token: string): Promise<lastPurchase> => {
  const response = await axios.get(`${API_BASE_URL}/purchases/last_payment`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as lastPurchase;
};
