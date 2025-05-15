import axios from "axios";
import { userInfo } from "src/core/models/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const getAuthToken = async (
  email: string,
  password: string,
  rememberMe?: boolean,
): Promise<string> => {
  const params = new URLSearchParams();
  params.append("email", email);
  params.append("password", password);

  const response = await axios.post(
    `${API_BASE_URL}/auth/token${rememberMe === true ? "?remember=true" : ""}`,
    params,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  if (response.data.access_token) {
    localStorage.setItem("authToken", response.data.access_token);
    return response.data.access_token as string;
  } else if (response.data.code === 403) {
    return Promise.reject("Wrong Token");
  }
  return Promise.reject("An error occurred");
};

export const checkPassword = async (password: string) => {
  const token = localStorage.getItem("authToken");
  if (token !== null) {
    const response = await axios.post(
      `${API_BASE_URL}/password/verify?password=${password}`,
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
  }
  return false;
};

export const postRecoveryPassword = async (email: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/password/recover/sendLink?email=${email}`,
    null,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  return response.data as string;
};

export const getUserInfo = async (token: string): Promise<userInfo> => {
  const response = await axios.get(`${API_BASE_URL}/users/detail/token`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as userInfo;
};

export const googleAuth = async (): Promise<string> => {
  const response = await axios.get(`${API_BASE_URL}/auth/google-login`, {
    headers: {
      Accept: "application/json",
    },
  });

  return response.data as string;
};

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  survey: string,
  surveyDetail: string | undefined,
  phoneNumber: string,
  city: string,
  country: string,
  recaptchaToken: string | null,
): Promise<string> => {
  try {
    const url = `${API_BASE_URL}/users/create?recaptcha_token=${recaptchaToken || ""}`;

    const data = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      survey,
      survey_detail: surveyDetail,
      phone_number: phoneNumber,
      city,
      country,
    };

    const response = await axios.post(url, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return response.data as string;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data;
      if (
        serverError &&
        serverError.error === "User with this email already exists"
      ) {
        return "User with this email already exists";
      }
    }
    console.error("An error occurred during user creation:", error);
    throw error;
  }
};


export const recoverUpdate = async (
  query: string,
  password: string,
  confirmPassword: string,
): Promise<string> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/password/recover/update?query=${query}&new_password=${password}&confirm_password=${confirmPassword}`,
      null,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    console.log(response.data as string);
    return response.data as string;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data;
      if (
        serverError &&
        serverError.error === "User with this email already exists"
      ) {
        return "User with this email already exists";
      }
    }
    console.error("An error occurred during user creation:", error);
    throw error;
  }
};

export const emailSend = async (email: string): Promise<string> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/auth/register/email/send?email=${email}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return response.data as string;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data;
      if (
        serverError &&
        serverError.error === "User with this email already exists"
      ) {
        return "User with this email already exists";
      }
    }
    console.error("An error occurred during user creation:", error);
    throw error;
  }
};

export const emailVerify = async (
  email: string,
  otp: string,
): Promise<void> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/auth/register/email/verify?email=${email}&otp=${otp}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    if (response.data.detail) {
      throw new Error(response.data.detail);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    console.error("An error occurred during email verification:", error);
    throw error;
  }
};
