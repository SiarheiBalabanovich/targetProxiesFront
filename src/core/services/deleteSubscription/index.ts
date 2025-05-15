import axios from "axios";

import { defaultResponse } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const deleteSubscription = async (
  token: string,
  id: string,
): Promise<defaultResponse> => {
  const response = await axios.delete(
    `${API_BASE_URL}/subscription/customer/deleteItem/${id}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as defaultResponse;
};
