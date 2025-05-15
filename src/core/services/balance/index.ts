import axios from "axios";

import { balanceInfo } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getBalanceInfo = async (token: string): Promise<balanceInfo> => {
  const response = await axios.get(`${API_BASE_URL}/purchases/balance`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as balanceInfo;
};
