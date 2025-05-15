import axios from "axios";

import { upcomingPurchase } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getUpcomingPurchases = async (
  token: string,
): Promise<upcomingPurchase[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/purchases/closest_payments?offset=0&limit=3`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.payments as upcomingPurchase[];
};
