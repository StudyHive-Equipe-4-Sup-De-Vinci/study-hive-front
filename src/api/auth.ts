import axiosI from "../axiosInterceptor";
import { UserLogin, UserSignup } from "../context/AuthContext";

export async function loginRequest(
  user: UserLogin
): Promise<{ token: string }> {
  return (await axiosI.post("/login", user)).data;
}

export async function registerRequest(user: UserSignup) {
  return await axiosI.post("/register", user);
}
export async function getProtected() {
  return await axiosI.get("/protected");
}

// export const getMeRequest = async (): Promise<User> => {
//   return await axiosI.get("/users/me");
// };
