import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAppTheme } from "@/components/AppTheme";
import { usePremium } from "@/utils/usePremium";
import { X, Crown, Sparkles, Check } from "lucide-react-native";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import LoadingLogo from "@/components/LoadingLogo";

export default function PaywallScreen() {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { feature } = useLocalSearchParams();
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  const {
    isPremium,
    isLoading,
    isPurchasing,
    purchaseSubscription,
    restorePurchases,
    getAvailablePackages,
  } = usePremium();

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  const handlePurchase = async () => {
    try {
      const packages = getAvailablePackages();
      if (packages.length === 0) {
        Alert.alert("Error", "No hay planes disponibles en este momento.");
        return;
      }

      // Buscar por los identificadores específicos de Silver Dog Training
      const packageToPurchase = packages.find((pkg) => {
        const identifier = pkg.identifier.toLowerCase();
        return selectedPlan === "monthly"
          ? identifier.includes("silver_monthly_999") ||
              identifier.includes("month")
          : identifier.includes("silver_annual_5999") ||
              identifier.includes("year") ||
              identifier.includes("annual");
      });

      if (!packageToPurchase) {
        Alert.alert("Error", "Plan no encontrado");
        return;
      }

      const success = await purchaseSubscription(packageToPurchase);
      if (success) {
        Alert.alert(
          "¡Bienvenido a Premium!",
          "Ahora tienes acceso completo a todos los entrenamientos",
          [{ text: "Continuar", onPress: () => router.back() }],
        );
      }
    } catch (error) {
      if (!error.userCancelled) {
        Alert.alert("Error", "No se pudo completar la compra.");
      }
    }
  };

  const handleRestore = async () => {
    try {
      const success = await restorePurchases();
      if (success) {
        Alert.alert("¡Compra Restaurada!", "Tus compras han sido restauradas", [
          { text: "Continuar", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Sin Compras", "No se encontraron compras previas");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron restaurar las compras");
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingLogo size={100} />
      </View>
    );
  }

  if (isPremium) {
    router.back();
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: colors.cardBackground,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <X size={24} color={colors.accentLight} />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: "space-between",
          paddingTop: 32,
          paddingBottom: insets.bottom + 20,
        }}
      >
        <View>
          {/* Crown Icon */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: `${colors.accent}30`,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: colors.accent,
              }}
            >
              <Crown size={40} color={colors.accent} fill={colors.accent} />
            </View>
          </View>

          {/* Title */}
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 28,
              color: colors.primary,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Acceso Completo{"\n"}a Todos los Entrenamientos
          </Text>

          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 15,
              color: colors.accentLight,
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Desbloquea el potencial de tu perro
          </Text>

          {/* Beneficios con fondo naranja sobre negro */}
          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 20,
              padding: 24,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: `${colors.accent}40`,
            }}
          >
            <View style={{ gap: 16 }}>
              {[
                "Acceso ilimitado a todos los cursos",
                "Clases personalizadas con instructores",
                "Chat prioritario con expertos",
                "Videos exclusivos de entrenamiento",
                "Certificados de finalización",
              ].map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: colors.accent,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <Text
                    style={{
                      fontFamily: "Sora_400Regular",
                      fontSize: 15,
                      color: colors.primary,
                      flex: 1,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Plan Selection con diseño naranja */}
          <View style={{ gap: 12 }}>
            {/* Monthly Plan */}
            <TouchableOpacity
              onPress={() => setSelectedPlan("monthly")}
              style={{
                backgroundColor:
                  selectedPlan === "monthly"
                    ? colors.accent
                    : colors.cardBackground,
                borderWidth: 2,
                borderColor: colors.accent,
                borderRadius: 16,
                padding: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    fontFamily: "Sora_700Bold",
                    fontSize: 16,
                    color:
                      selectedPlan === "monthly" ? "#FFFFFF" : colors.primary,
                    marginBottom: 2,
                  }}
                >
                  Plan Mensual
                </Text>
                <Text
                  style={{
                    fontFamily: "Sora_400Regular",
                    fontSize: 12,
                    color:
                      selectedPlan === "monthly"
                        ? "#FFFFFF"
                        : colors.accentLight,
                  }}
                >
                  Facturación mensual
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 22,
                  color: selectedPlan === "monthly" ? "#FFFFFF" : colors.accent,
                }}
              >
                $9.99
                <Text style={{ fontSize: 12 }}>/mes</Text>
              </Text>
            </TouchableOpacity>

            {/* Annual Plan */}
            <TouchableOpacity
              onPress={() => setSelectedPlan("annual")}
              style={{
                backgroundColor:
                  selectedPlan === "annual"
                    ? colors.accent
                    : colors.cardBackground,
                borderWidth: 2,
                borderColor: colors.accent,
                borderRadius: 16,
                padding: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 2,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Sora_700Bold",
                      fontSize: 16,
                      color:
                        selectedPlan === "annual" ? "#FFFFFF" : colors.primary,
                    }}
                  >
                    Plan Anual
                  </Text>
                  <View
                    style={{
                      backgroundColor:
                        selectedPlan === "annual"
                          ? "#FFFFFF"
                          : colors.accentLight,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_700Bold",
                        fontSize: 9,
                        color:
                          selectedPlan === "annual"
                            ? colors.accent
                            : colors.background,
                      }}
                    >
                      AHORRA 50%
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontFamily: "Sora_400Regular",
                    fontSize: 12,
                    color:
                      selectedPlan === "annual"
                        ? "#FFFFFF"
                        : colors.accentLight,
                  }}
                >
                  Solo $4.99/mes
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 22,
                  color: selectedPlan === "annual" ? "#FFFFFF" : colors.accent,
                }}
              >
                $59.99
                <Text style={{ fontSize: 12 }}>/año</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Buttons */}
        <View>
          <TouchableOpacity
            onPress={handlePurchase}
            disabled={isPurchasing}
            style={{
              backgroundColor: colors.accent,
              paddingVertical: 18,
              borderRadius: 24,
              marginBottom: 12,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            {isPurchasing ? (
              <LoadingLogo size={24} />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Sparkles
                  size={20}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                  fill="#FFFFFF"
                />
                <Text
                  style={{
                    fontFamily: "Sora_700Bold",
                    fontSize: 16,
                    color: "#FFFFFF",
                    textAlign: "center",
                  }}
                >
                  Comenzar Ahora
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRestore} style={{ marginBottom: 8 }}>
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 13,
                color: colors.accentLight,
                textAlign: "center",
              }}
            >
              Restaurar Compras
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 11,
              color: colors.secondary,
              textAlign: "center",
            }}
          >
            Cancela cuando quieras • Sin compromiso
          </Text>
        </View>
      </View>
    </View>
  );
}
