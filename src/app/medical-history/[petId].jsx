import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppTheme } from "@/components/AppTheme";
import AppScreen from "@/components/AppScreen";
import AppHeader from "@/components/AppHeader";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { usePetHistory } from "@/hooks/usePetData";
import LoadingLogo from "@/components/LoadingLogo";

export default function MedicalHistoryScreen() {
  const { colors, isDark } = useAppTheme();
  const { petId } = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  const { data: historyData, isLoading } = usePetHistory(petId);

  if (!fontsLoaded) {
    return null;
  }

  const header = (
    <AppHeader
      title="Historial Completo"
      showBackButton={true}
      titleStyle={{
        fontFamily: "Sora_800ExtraBold",
        fontSize: 20,
      }}
    />
  );

  if (isLoading) {
    return (
      <AppScreen header={header}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LoadingLogo size={100} />
        </View>
      </AppScreen>
    );
  }

  const history = historyData?.history || [];

  return (
    <AppScreen header={header}>
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            fontFamily: "Sora_800ExtraBold",
            fontSize: 24,
            color: colors.primary,
            marginTop: 20,
            marginBottom: 8,
          }}
        >
          Historial Médico
        </Text>
        <Text
          style={{
            fontFamily: "Sora_400Regular",
            fontSize: 14,
            color: colors.secondary,
            marginBottom: 24,
          }}
        >
          {history.length} {history.length === 1 ? "registro" : "registros"} en
          total
        </Text>

        {history.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 16,
              padding: 32,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 16,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              No hay registros médicos
            </Text>
          </View>
        ) : (
          history.map((entry, index) => (
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
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Sora_600SemiBold",
                      fontSize: 16,
                      color: colors.primary,
                      marginBottom: 4,
                    }}
                  >
                    {entry.title}
                  </Text>
                  <View
                    style={{
                      backgroundColor: colors.accent + "20",
                      alignSelf: "flex-start",
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 12,
                        color: colors.accent,
                      }}
                    >
                      {entry.entry_type === "vacuna" && "💉 Vacuna"}
                      {entry.entry_type === "desparacitacion" &&
                        "🐛 Desparacitación"}
                      {entry.entry_type === "medicamento" && "💊 Medicamento"}
                      {entry.entry_type === "cirugia" && "🏥 Cirugía"}
                      {entry.entry_type === "nota" && "📝 Nota"}
                    </Text>
                  </View>
                </View>
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
                    year: "numeric",
                  })}
                </Text>
              </View>

              {entry.description && (
                <Text
                  style={{
                    fontFamily: "Sora_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                    lineHeight: 20,
                  }}
                >
                  {entry.description}
                </Text>
              )}

              {entry.attachments && entry.attachments.length > 0 && (
                <View style={{ marginTop: 12 }}>
                  <Text
                    style={{
                      fontFamily: "Sora_600SemiBold",
                      fontSize: 12,
                      color: colors.secondary,
                      marginBottom: 4,
                    }}
                  >
                    📎 {entry.attachments.length}{" "}
                    {entry.attachments.length === 1 ? "adjunto" : "adjuntos"}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </View>
    </AppScreen>
  );
}
