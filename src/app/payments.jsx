import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function PaymentsScreen() {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { auth } = useAuth();

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ["payments", auth?.user?.id],
    queryFn: async () => {
      if (!auth?.user?.id) return { payments: [] };
      const response = await fetch(`/api/payments?userId=${auth.user.id}`);
      if (!response.ok) return { payments: [] };
      return response.json();
    },
    enabled: !!auth?.user?.id,
  });

  if (!fontsLoaded) {
    return null;
  }

  const payments = paymentsData?.payments || [];

  const getStatusIcon = (status) => {
    if (status === "completed") {
      return <CheckCircle size={20} color="#10B981" />;
    } else if (status === "failed") {
      return <XCircle size={20} color={colors.destructive} />;
    } else {
      return <Clock size={20} color="#F59E0B" />;
    }
  };

  const getStatusText = (status) => {
    if (status === "completed") return "Completado";
    if (status === "failed") return "Fallido";
    return "Pendiente";
  };

  const getStatusColor = (status) => {
    if (status === "completed") return "#10B981";
    if (status === "failed") return colors.destructive;
    return "#F59E0B";
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: colors.cardBackground,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 24,
              color: colors.primary,
            }}
          >
            Historial de Pagos
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Cargando pagos...
            </Text>
          </View>
        ) : payments.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 40,
            }}
          >
            <CreditCard size={64} color={colors.secondary} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginTop: 24,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              No hay pagos registrados
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              Tus compras aparecerán aquí
            </Text>
          </View>
        ) : (
          <FlatList
            data={payments}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: insets.bottom + 20,
            }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const date = new Date(item.payment_date);
              const statusColor = getStatusColor(item.status);

              return (
                <View
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 16,
                    shadowColor: colors.cardShadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.3 : 0.06,
                    shadowRadius: 8,
                    elevation: 4,
                    borderLeftWidth: 4,
                    borderLeftColor: statusColor,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 18,
                          color: colors.primary,
                          marginBottom: 4,
                        }}
                      >
                        ${parseFloat(item.amount).toFixed(2)}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Sora_400Regular",
                          fontSize: 14,
                          color: colors.secondary,
                          textTransform: "capitalize",
                        }}
                      >
                        {item.payment_type === "course" ? "Curso" : "Accesorio"}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        backgroundColor: statusColor + "20",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                      }}
                    >
                      {getStatusIcon(item.status)}
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 12,
                          color: statusColor,
                        }}
                      >
                        {getStatusText(item.status)}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontFamily: "Sora_400Regular",
                      fontSize: 13,
                      color: colors.secondary,
                    }}
                  >
                    {format(date, "d 'de' MMMM yyyy, h:mm a", { locale: es })}
                  </Text>

                  {item.reference_id && (
                    <View
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Sora_400Regular",
                          fontSize: 12,
                          color: colors.secondary,
                        }}
                      >
                        Ref: #{item.reference_id}
                      </Text>
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}
