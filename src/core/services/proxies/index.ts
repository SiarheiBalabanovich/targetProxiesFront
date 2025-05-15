import axios from "axios";

import { proxiesList } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getProxies = async (
  token: string,
  offset: number,
  limit?: number,
): Promise<proxiesList> => {
  const response = await axios.get(
    `${API_BASE_URL}/proxies/customer/list?offset=${offset}&limit=${limit ? limit : "10"}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as proxiesList;
};
