import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loginUser = async (
  email_or_phone: string,
  password: string
) => {
  const response = await API.post(
    "/auth/login",
    {
      email_or_phone,
      password,
    }
  );

  return response.data;
};

export const forgotPassword = async (
  email?: string,
  phone_number?: string
) => {

  const payload: any = {};

  if (email?.trim()) {
    payload.email = email.trim();
  }

  if (phone_number?.trim()) {
    payload.phone_number =
      phone_number.trim();
  }

  const response =
    await API.post(
      "/auth/forgot-password",
      payload
    );

  return response.data;
};

export const verifyOTP =
  async (
    email?: string,
    phone_number?: string,
    otp?: string
  ) => {

    const payload: any = {
      otp
    };

    if (email?.trim()) {
      payload.email = email.trim();
    }

    if (phone_number?.trim()) {
      payload.phone_number =
        phone_number.trim();
    }

    const response =
      await API.post(
        "/auth/verify-forgot-password-otp",
        payload
      );

    return response.data;
  };

export const createNewPassword = async (
  email_or_phone: string,
  new_password: string,
  confirm_password: string
) => {

  const response = await API.post(
    "/auth/create-new-password",
    {
      email_or_phone,
      new_password,
      confirm_password,
    }
  );

  return response.data;
};

export const verifyBlockedAccount = async (
  email_or_phone: string,
  security_question: string,
  security_answer: string
) => {

  const response = await API.post(
    "/auth/reset-blocked-account-password",
    {
      email_or_phone,
      security_question,
      security_answer,
    }
  );

  return response.data;
};

export default API;