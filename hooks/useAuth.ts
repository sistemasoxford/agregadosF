import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { verifyToken } from "../app/services/auth/authService";

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          setUserId(null);
        } else {
          const data = await verifyToken();
          setUserId(data.decoded.userId); // usamos decoded.userId del backend
        }
      } catch (error) {
        // Token inválido o expirado → limpiar AsyncStorage
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        await AsyncStorage.removeItem("userId");
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    setUserId(null);
  };

  return { userId, setUserId, logout, loading };
};
