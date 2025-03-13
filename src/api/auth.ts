import axiosI from "../axiosInterceptor";
import { User } from "../context/AuthContext";

export async function loginRequest(): Promise<{ access_token: string }> {
  return await axiosI.post("");
}

export async function registerRequest(): Promise<{ access_token: string }> {
  return await axiosI.post("");
}

export const getMeRequest = async (): Promise<User> => {
  return await axiosI.get("/users/me");
};
