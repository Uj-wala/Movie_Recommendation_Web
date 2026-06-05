import api from "../api/axios";

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  security_question: string;
  security_answer: string;
  country_id: string;
  role: string;
}

export const registerUser = async (data: RegisterPayload) => {
    const response =
      await api.post("/auth/register/email",
        data
      );

    return response;
  };