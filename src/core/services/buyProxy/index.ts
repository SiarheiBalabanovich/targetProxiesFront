import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const createProxyBuy = async (
  proxy: string,
  duration: string,
  durationCount: number,
  paymentMethod: string,
  price: number,
  quantity: number,
  autoExtended: boolean,
  location: string,
  discount?: string,
): Promise<string> => {
  const token = localStorage.getItem("authToken");
  const response = await axios.post(
    `${API_BASE_URL}/create-checkout-session?proxy=${proxy}&duration=${duration}&duration_count=${durationCount}&payment_method=${paymentMethod}&price=${price}&quantity=${quantity}&auto_extended=${autoExtended}${discount !== undefined ? `&discount=${discount}` : ""}&location=${location}`,
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

export const createProxyBuyCrypto = async (
  proxy: string,
  duration: string,
  durationCount: number,
  paymentMethod: string,
  price: number,
  quantity: number,
  autoExtended: boolean,
  location: string,
  discount?: string,
): Promise<string> => {
  const token = localStorage.getItem("authToken");
  const response = await axios.post(
    `${API_BASE_URL}/create-crypto-checkout-session?proxy=${proxy}&duration=${duration}&duration_count=${durationCount}&payment_method=${paymentMethod}&price=${price}&quantity=${quantity}&auto_extended=${autoExtended}${discount !== undefined ? `&discount=${discount}` : ""}&location=${location}`,
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

export const createProxyBuyCryptoCloud = async (
  proxy: string,
  duration: string,
  durationCount: number,
  paymentMethod: string,
  price: number,
  quantity: number,
  autoExtended: boolean,
  location: string,
  discount?: string,
): Promise<string> => {
  const token = localStorage.getItem("authToken");
  const response = await axios.post(
    `${API_BASE_URL}/create-crypto-cloud-checkout-session?proxy=${proxy}&duration=${duration}&duration_count=${durationCount}&payment_method=${paymentMethod}&price=${price}&quantity=${quantity}&auto_extended=${autoExtended}${discount !== undefined ? `&discount=${discount}` : ""}&location=${location}`,
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
