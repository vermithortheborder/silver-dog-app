import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react-native";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import LoadingLogo from "@/components/LoadingLogo";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSubmit = async () => {
    if (!email) {
      setError("Por favor ingresa tu email");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el email");
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              ¡Email Enviado!
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Si el email existe en nuestro sistema, recibirás un enlace para
              restablecer tu contraseña.
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#9CA3AF",
                textAlign: "center",
                marginBottom: 32,
              }}
            >
              Revisa tu bandeja de entrada y tu carpeta de spam.
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
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
                Volver al inicio de sesión
              </Text>
            </TouchableOpacity>
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
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <ArrowLeft size={24} color="#1F2937" />
          <Text
            style={{
              fontSize: 16,
              color: "#1F2937",
              marginLeft: 8,
              fontWeight: "600",
            }}
          >
            Volver
          </Text>
        </TouchableOpacity>

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
            ¿Olvidaste tu contraseña?
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
            Recuperar Contraseña
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
            No te preocupes, te enviaremos un enlace para restablecerla
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

          {/* Email Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Email
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
              <Mail size={20} color="#9CA3AF" style={{ marginRight: 12 }} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
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
                Enviar enlace de restablecimiento
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Sign In */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingVertical: 8 }}
          >
            <Text
              style={{ color: "#6B7280", fontSize: 14, textAlign: "center" }}
            >
              ← Volver al inicio de sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingAnimatedView>
  );
}
