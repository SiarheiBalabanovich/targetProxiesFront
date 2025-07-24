import axios from "axios";
import { defaultResponse, discountListItem } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// ТВОЙ ХАРДКОРНЫЙ ТОКЕН:
const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTM0NTU5NDYsInN1YiI6InMuYmFsYWJhbm92aWNoLmRldmVsb3BlckBnbWFpbC5jb20ifQ._60yxCjXuOav-tsv0KrI1B07ajB6LqkZslpKI63AiaE";

// Получить список скидок
export const discountsList = async (): Promise<discountListItem[]> => {
  const response = await axios.get(`${API_BASE_URL}/discount/`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${TEST_TOKEN}`,
    },
  });
  return response.data as discountListItem[];
};

// Получить одну скидку по id
export const discountsDetail = async (
  discount_id: number,
): Promise<discountListItem> => {
  const response = await axios.get(`${API_BASE_URL}/discount/${discount_id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${TEST_TOKEN}`,
    },
  });
  return response.data as discountListItem;
};

// Применить скидку по коду
export const discountApply = async (
  code: string,
): Promise<discountListItem | string> => {
  const response = await axios.get(
    `${API_BASE_URL}/discount/apply?code=${code}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    },
  );
  return response.data as discountListItem | string;
};

// Создать скидку
export const createDiscount = async (
  code: string,
  order_amount: number,
  effective_date: string,
  expiry_date: string,
  type: string,
  discount_amount: number,
  limit_users?: number,
): Promise<string> => {
  const payload = {
    code,
    order_amount,
    effective_date,
    expiry_date,
    type,
    discount_amount,
    ...(limit_users !== undefined && { limit_users }),
  };
  const response = await axios.post(
    `${API_BASE_URL}/discount/`,
    payload,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    }
  );
  return response.data as string;
};

// Обновить скидку
export const updateDiscount = async (
  id: number,
  code: string,
  order_amount: number,
  effective_date: string,
  expiry_date: string,
  type: string,
  discount_amount: number,
  limit_users?: number,
): Promise<string> => {
  const payload = {
    code,
    order_amount,
    effective_date,
    expiry_date,
    type,
    discount_amount,
    ...(limit_users !== undefined && { limit_users }),
  };
  const response = await axios.patch(
    `${API_BASE_URL}/discount/${id}`,
    payload,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${TEST_TOKEN}`,
      },
    }
  );
  return response.data as string;
};

// Удалить скидку
export const deleteDiscount = async (
  id: number,
): Promise<defaultResponse> => {
  const response = await axios.delete(`${API_BASE_URL}/discount/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${TEST_TOKEN}`,
    },
  });
  return response.data as defaultResponse;
};