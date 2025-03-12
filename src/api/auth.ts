import axiosI from "../axiosInterceptor";
import { User } from "../context/AuthContext";

export async function loginRequest(
  userName: string,
  password: string
): Promise<{ access_token: string }> {
  return await axiosI.post("");
}

export async function registerRequest(
  userName: string,
  password: string
): Promise<{ access_token: string }> {
  return await axiosI.post("");
}

export const getMeRequest = async (): Promise<User> => {
  return await axiosI.get("/users/me");
};
