import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, Clock, Pill, Plus } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import { useRouter } from "expo-router";

export function RemindersSection({ reminders, isVetOrAdmin, petId }) {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();

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
          Recordatorios
        </Text>
        {isVetOrAdmin && petId && (
          <TouchableOpacity
            onPress={() => router.push(`/add-reminder/${petId}`)}
          >
            <Plus size={24} color={colors.accent} />
          </TouchableOpacity>
        )}
      </View>

      {reminders?.length === 0 ? (
        <View
          style={{
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 24,
            alignItems: "center",
          }}
        >
          <Calendar size={48} color={colors.secondary} />
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 16,
              color: colors.secondary,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            No hay recordatorios pendientes
          </Text>
        </View>
      ) : (
        reminders?.map((reminder) => (
          <View
            key={reminder.id}
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
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.accent + "20",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {(reminder.reminder_type === "vacuna" ||
                  reminder.reminder_type === "desparacitacion" ||
                  reminder.reminder_type === "medicamento") && (
                  <Pill size={20} color={colors.accent} />
                )}
                {reminder.reminder_type === "revision" && (
                  <Calendar size={20} color={colors.accent} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 16,
                    color: colors.primary,
                    marginBottom: 4,
                  }}
                >
                  {reminder.title}
                </Text>
                {reminder.description && (
                  <Text
                    style={{
                      fontFamily: "Sora_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                      marginBottom: 8,
                    }}
                  >
                    {reminder.description}
                  </Text>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Clock size={14} color={colors.secondary} />
                  <Text
                    style={{
                      fontFamily: "Sora_400Regular",
                      fontSize: 12,
                      color: colors.secondary,
                    }}
                  >
                    {new Date(reminder.due_date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                {reminder.medication_times &&
                  reminder.medication_times.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                      <Text
                        style={{
                          fontFamily: "Sora_400Regular",
                          fontSize: 12,
                          color: colors.secondary,
                        }}
                      >
                        Horarios: {reminder.medication_times.join(", ")}
                      </Text>
                    </View>
                  )}
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
