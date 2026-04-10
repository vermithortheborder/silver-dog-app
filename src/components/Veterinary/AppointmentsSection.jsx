import React from "react";
import { View, Text } from "react-native";
import { FileText } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";

export function AppointmentsSection({ appointments }) {
  const { colors, isDark } = useAppTheme();

  return (
    <View style={{ paddingHorizontal: 12, marginBottom: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontFamily: "Sora_800ExtraBold",
            fontSize: 20,
            color: colors.primary,
          }}
        >
          Consultas
        </Text>
      </View>

      {appointments?.length === 0 ? (
        <View
          style={{
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 24,
            alignItems: "center",
          }}
        >
          <FileText size={48} color={colors.secondary} />
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 16,
              color: colors.secondary,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            No hay consultas registradas
          </Text>
        </View>
      ) : (
        appointments?.slice(0, 3).map((appointment) => (
          <View
            key={appointment.id}
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              shadowColor: colors.cardShadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                {appointment.appointment_type.charAt(0).toUpperCase() +
                  appointment.appointment_type.slice(1)}
              </Text>
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                }}
              >
                {new Date(appointment.appointment_date).toLocaleDateString(
                  "es-ES",
                  {
                    day: "numeric",
                    month: "short",
                  },
                )}
              </Text>
            </View>
            {appointment.veterinarian_name && (
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                Veterinario: {appointment.veterinarian_name}
              </Text>
            )}
          </View>
        ))
      )}
    </View>
  );
}
