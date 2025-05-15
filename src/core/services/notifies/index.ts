import axios from "axios";

import { defaultResponse, notifiesListProps } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getNotifies = async (
  token: string,
  limit?: boolean,
): Promise<notifiesListProps | null> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/notifies?offset=0${limit !== false ? "&limit=1000" : "&limit=1000"}&is_read=false`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data as notifiesListProps;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 404
    ) {
      return null;
    } else {
      console.error(error);
      throw error;
    }
  }
};

export const updateNotifies = async (
  token: string,
  id: number,
): Promise<defaultResponse> => {
  const response = await axios.patch(
    `${API_BASE_URL}/notifies/update/?notify_id=${id}`,
    null,
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
