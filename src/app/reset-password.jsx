import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Lock, CheckCircle, AlertCircle } from "lucide-react-native";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import LoadingLogo from "@/components/LoadingLogo";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const token = params.token;

  useEffect(() => {
    if (!token) {
      setError("Token de restablecimiento no encontrado");
    }
  }, [token]);

  const handleSubmit = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/password-reset/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al restablecer la contraseña");
      }

      setSuccess(true);
      setTimeout(() => {
        router.replace("/");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token && error) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF7ED" }}>
        <StatusBar style="dark" />
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingHorizontal: 20,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              padding: 32,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            }}
          >
            <AlertCircle size={80} color="#EF4444" strokeWidth={2} />
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                marginTop: 24,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Enlace Inválido
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              El enlace de restablecimiento no es válido.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/forgot-password")}
              style={{
                backgroundColor: "#FF6B35",
                paddingVertical: 16,
                paddingHorizontal: 32,
                borderRadius: 16,
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                Solicitar nuevo enlace
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (success) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF7ED" }}>
        <StatusBar style="dark" />
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingHorizontal: 20,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 24,
              padding: 32,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            }}
          >
            <CheckCircle size={80} color="#10B981" strokeWidth={2} />
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                marginTop: 24,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              ¡Contraseña Restablecida!
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Tu contraseña ha sido actualizada exitosamente.
            </Text>
            <Text
              style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center" }}
            >
              Redirigiendo al inicio de sesión...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingAnimatedView
      style={{ flex: 1, backgroundColor: "#FFF7ED" }}
      behavior="padding"
    >
      <StatusBar style="dark" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "800",
              color: "#1F2937",
              marginBottom: 8,
            }}
          >
            🐕 Silver Dog Training
          </Text>
          <Text style={{ fontSize: 16, color: "#6B7280" }}>
            Crear Nueva Contraseña
          </Text>
        </View>

        {/* Form Card */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 24,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 8,
            }}
          >
            Nueva Contraseña
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
            Ingresa tu nueva contraseña
          </Text>

          {error ? (
            <View
              style={{
                backgroundColor: "#FEE2E2",
                borderWidth: 1,
                borderColor: "#FCA5A5",
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <Text style={{ color: "#DC2626", fontSize: 14 }}>{error}</Text>
            </View>
          ) : null}

          {/* Password Input */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Nueva Contraseña
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F9FAFB",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}
            >
              <Lock size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                style={{ flex: 1, fontSize: 16, color: "#1F2937" }}
              />
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Confirmar Contraseña
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F9FAFB",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}
            >
              <Lock size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                style={{ flex: 1, fontSize: 16, color: "#1F2937" }}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#FCA5A5" : "#FF6B35",
              paddingVertical: 16,
              borderRadius: 16,
              marginBottom: 16,
            }}
          >
            {loading ? (
              <LoadingLogo size={24} />
            ) : (
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                Restablecer Contraseña
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingAnimatedView>
  );
}
