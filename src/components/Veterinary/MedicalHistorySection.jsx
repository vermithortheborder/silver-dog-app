import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAppTheme } from "@/components/AppTheme";
import { useRouter } from "expo-router";

export function MedicalHistorySection({ history, petId }) {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: 12, marginBottom: 12 }}>
      <Text
        style={{
          fontFamily: "Sora_800ExtraBold",
          fontSize: 20,
          color: colors.primary,
          marginBottom: 16,
        }}
      >
        Historial Médico
      </Text>

      {history.slice(0, 3).map((entry) => (
        <View
          key={entry.id}
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
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 16,
                color: colors.primary,
              }}
            >
              {entry.title}
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 12,
                color: colors.secondary,
              }}
            >
              {new Date(entry.entry_date).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>
          {entry.description && (
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 14,
                color: colors.secondary,
                marginTop: 4,
              }}
            >
              {entry.description}
            </Text>
          )}
        </View>
      ))}

      {history.length > 3 && (
        <TouchableOpacity
          onPress={() => router.push(`/medical-history/${petId}`)}
          style={{
            backgroundColor: colors.accent,
            borderRadius: 12,
            padding: 16,
            marginTop: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 16,
              color: "#FFFFFF",
            }}
          >
            Ver Historial Completo ({history.length} registros)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
