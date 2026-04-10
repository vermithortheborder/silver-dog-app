import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Dog, Pill, Calendar, Heart } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";

export default function VeterinaryHealthCard({ pet, reminders = [] }) {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  if (!fontsLoaded || !pet) return null;

  const upcomingReminders = reminders.slice(0, 2);

  return (
    <View style={{ marginBottom: 32 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Heart size={24} color={colors.accent} />
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 22,
              color: colors.primary,
            }}
          >
            Salud Veterinaria
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/veterinary")}>
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 14,
              color: colors.accent,
            }}
          >
            Ver Todo
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: 16,
          padding: 16,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
          {pet.photo ? (
            <Image
              source={{ uri: pet.photo }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
              contentFit="cover"
              transition={100}
            />
          ) : (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.accent + "20",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Dog size={32} color={colors.accent} />
            </View>
          )}
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginBottom: 4,
              }}
            >
              {pet.name}
            </Text>
            {pet.breed && (
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                {pet.breed}
              </Text>
            )}
          </View>
        </View>

        {upcomingReminders.length > 0 ? (
          <View>
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 14,
                color: colors.secondary,
                marginBottom: 12,
              }}
            >
              Próximos Recordatorios
            </Text>
            {upcomingReminders.map((reminder) => (
              <View
                key={reminder.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  paddingVertical: 8,
                }}
              >
                {reminder.reminder_type === "vacuna" && (
                  <Pill size={18} color={colors.accent} />
                )}
                {reminder.reminder_type === "desparacitacion" && (
                  <Pill size={18} color={colors.accent} />
                )}
                {reminder.reminder_type === "medicamento" && (
                  <Pill size={18} color={colors.accent} />
                )}
                {reminder.reminder_type === "revision" && (
                  <Calendar size={18} color={colors.accent} />
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Sora_600SemiBold",
                      fontSize: 14,
                      color: colors.primary,
                    }}
                  >
                    {reminder.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Sora_400Regular",
                      fontSize: 12,
                      color: colors.secondary,
                    }}
                  >
                    {new Date(reminder.due_date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 14,
              color: colors.secondary,
              textAlign: "center",
              paddingVertical: 8,
            }}
          >
            No hay recordatorios pendientes
          </Text>
        )}
      </View>
    </View>
  );
}
