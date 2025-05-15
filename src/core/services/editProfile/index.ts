import axios from "axios";
import { userInfo } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const updateUserInfo = async (
  id: number,
  first_name: string,
  last_name: string,
  email: string,
  survey: string,
  survey_detail: string,
  phone_number: string,
  city: string,
  country: string,
): Promise<string> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await axios.patch(
    `${API_BASE_URL}/users/update/${id}?first_name=${first_name}&last_name=${last_name}&email=${email}&survey=${survey}&survey_detail=${survey_detail}&phone_number=${phone_number}&city=${city}&country=${country}`,
    {},
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getCurrentUserInfo = async (id: number): Promise<userInfo> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await axios.get(`${API_BASE_URL}/users/detail/${id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as userInfo;
};

export const changePassword = async (
  current_password: string,
  new_password: string,
  confirm_password: string,
): Promise<string> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await axios.post(
    `${API_BASE_URL}/password/change?current_password=${current_password}&new_password=${new_password}&confirm_password=${confirm_password}`,
    {},
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
