import axios from "axios";

import { defaultResponse, pagesList } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getPages = async (
  token: string,
  limit?: boolean,
): Promise<pagesList> => {
  const response = await axios.get(
    `${API_BASE_URL}/pages/list?offset=0${limit !== false ? "&limit=1000" : "&limit=1000"}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data as pagesList;
};

export const createPages = async (
  token: string,
  name: string,
  title: string,
  content: string,
): Promise<defaultResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/pages/create?name=${name}&title=${title}&content=${content}&visibility=public&status=published`,
    null,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log(response.data as defaultResponse);
  return response.data as defaultResponse;
};

export const updatePages = async (
  token: string,
  name: string,
  title: string,
  content: string,
  id: number,
): Promise<defaultResponse> => {
  const response = await axios.patch(
    `${API_BASE_URL}/pages/update/${id}?name=${name}&title=${title}&content=${content}&visibility=public&status=published`,
    null,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log(response.data as defaultResponse);
  return response.data as defaultResponse;
};

export const deletePage = async (
  token: string,
  id: number,
): Promise<defaultResponse> => {
  const response = await axios.delete(`${API_BASE_URL}/pages/${id}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response.data as defaultResponse);
  return response.data as defaultResponse;
};
