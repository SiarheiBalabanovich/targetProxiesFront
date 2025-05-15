import axios from "axios";

import { analiticsDataItem } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const graphicRevenue = async (
  token: string,
  period: string,
): Promise<analiticsDataItem[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/graphics/revenue?period=${period}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as analiticsDataItem[];
};

export const graphicSurvey = async (
  token: string,
  period: string,
): Promise<analiticsDataItem[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/graphics/survey?period=${period}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as analiticsDataItem[];
};

export const graphicRevenueSource = async (
  token: string,
  period: string,
): Promise<analiticsDataItem[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/graphics/revenueSource?period=${period}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as analiticsDataItem[];
};

export const graphicLocation = async (
  token: string,
  period: string,
): Promise<analiticsDataItem[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/graphics/location?period=${period}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as analiticsDataItem[];
};

export const graphicSalesCarrier = async (
  token: string,
  period: string,
): Promise<analiticsDataItem[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/graphics/salesCarrier?period=${period}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as analiticsDataItem[];
};

export const graphicSalesCustomer = async (
  token: string,
  period: string,
): Promise<analiticsDataItem[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/graphics/salesCustomer?period=${period}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as analiticsDataItem[];
};
