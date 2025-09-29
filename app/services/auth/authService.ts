import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

// LOGIN
export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  const { accessToken, refreshToken, userId } = response.data;

  await AsyncStorage.setItem("accessToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);
  await AsyncStorage.setItem("userId", userId.toString());

  return response.data;
};

// REGISTER
export const register = async (email: string, password: string) => {
  const response = await api.post("/register", { email, password });
  return response.data;
};

// REFRESH TOKEN
export const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  const response = await api.post("/refresh-token", { refreshToken });
  await AsyncStorage.setItem("accessToken", response.data.accessToken);
  return response.data.accessToken;
};

// VERIFY TOKEN
export const verifyToken = async () => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const response = await api.post(
    "/verify-token",
    {},
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};
