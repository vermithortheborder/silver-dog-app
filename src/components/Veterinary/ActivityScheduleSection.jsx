import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Plus, Clock, Trash2, Navigation, Dumbbell } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";

export function ActivityScheduleSection({
  petName,
  walkSchedules = [],
  exerciseSchedules = [],
  onAddWalk,
  onAddExercise,
  onRemoveWalk,
  onRemoveExercise,
}) {
  const { colors, isDark } = useAppTheme();

  const activityEmojis = {
    correr: "🏃",
    jugar: "🎾",
    nadar: "🏊",
    entrenar: "🎯",
  };

  return (
    <View style={{ paddingHorizontal: 12, marginBottom: 12 }}>
      {/* Paseos */}
      <View style={{ marginBottom: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Navigation size={24} color={colors.accent} />
            <Text
              style={{
                fontFamily: "Sora_800ExtraBold",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              Paseos
            </Text>
          </View>
          <TouchableOpacity
            onPress={onAddWalk}
            style={{
              backgroundColor: colors.accent,
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {walkSchedules.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 16,
              padding: 24,
              alignItems: "center",
            }}
          >
            <Navigation size={48} color={colors.secondary} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 16,
                color: colors.primary,
                marginTop: 12,
                marginBottom: 4,
              }}
            >
              Sin paseos programados
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              Programa recordatorios para no olvidar sacar a {petName} a pasear
            </Text>
          </View>
        ) : (
          walkSchedules.map((schedule) => (
            <View
              key={schedule.id}
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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.accent + "20",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 24 }}>🐕</Text>
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
                    Paseo {schedule.duration && `- ${schedule.duration} min`}
                  </Text>
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
                        fontSize: 14,
                        color: colors.secondary,
                      }}
                    >
                      {schedule.time}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Eliminar paseo",
                    "¿Deseas eliminar este recordatorio de paseo?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Eliminar",
                        style: "destructive",
                        onPress: () => onRemoveWalk(schedule.id),
                      },
                    ],
                  );
                }}
                style={{
                  backgroundColor: colors.destructiveBackground,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Trash2 size={18} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Ejercicios */}
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Dumbbell size={24} color={colors.accent} />
            <Text
              style={{
                fontFamily: "Sora_800ExtraBold",
                fontSize: 20,
                color: colors.primary,
              }}
            >
              Ejercicios
            </Text>
          </View>
          <TouchableOpacity
            onPress={onAddExercise}
            style={{
              backgroundColor: colors.accent,
              width: 36,
              height: 36,
              borderRadius: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {exerciseSchedules.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 16,
              padding: 24,
              alignItems: "center",
            }}
          >
            <Dumbbell size={48} color={colors.secondary} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 16,
                color: colors.primary,
                marginTop: 12,
                marginBottom: 4,
              }}
            >
              Sin ejercicios programados
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              Programa actividades para mantener a {petName} en forma
            </Text>
          </View>
        ) : (
          exerciseSchedules.map((schedule) => (
            <View
              key={schedule.id}
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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.accent + "20",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 24 }}>
                    {activityEmojis[schedule.activityType] || "💪"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Sora_600SemiBold",
                      fontSize: 16,
                      color: colors.primary,
                      marginBottom: 4,
                      textTransform: "capitalize",
                    }}
                  >
                    {schedule.activityType}
                  </Text>
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
                        fontSize: 14,
                        color: colors.secondary,
                      }}
                    >
                      {schedule.time}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Eliminar ejercicio",
                    `¿Deseas eliminar el recordatorio de ${schedule.activityType}?`,
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Eliminar",
                        style: "destructive",
                        onPress: () => onRemoveExercise(schedule.id),
                      },
                    ],
                  );
                }}
                style={{
                  backgroundColor: colors.destructiveBackground,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Trash2 size={18} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
