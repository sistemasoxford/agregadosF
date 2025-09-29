import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, View } from "react-native";
import { login } from "../../app/services/auth/authService";
import LoginForm from "../../components/ui/LoginForm";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const { userId, setUserId } = useAuth();

  // Si ya hay sesión → redirige automáticamente
  useEffect(() => {
    if (userId) {
      router.replace("/(tabs)");
    }
  }, [userId, router]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await login(email, password);
      if (!data.accessToken) throw new Error("No se recibió token");

      // Guardar userId en hook
      setUserId(data.userId);

      Alert.alert("Éxito", `Bienvenido usuario ${data.userId}`);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <LoginForm onSubmit={handleLogin} />
    </View>
  );
}
