import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const renewBuy = async (
  subscriptionId: number,
  duration: string,
  durationCount: number,
  amount: number,
): Promise<string> => {
  const token = localStorage.getItem("authToken");
  const response = await axios.post(
    `${API_BASE_URL}/subscription/renew/${subscriptionId}?&duration=${duration}&duration_count=${durationCount}&amount=${amount}`,
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
