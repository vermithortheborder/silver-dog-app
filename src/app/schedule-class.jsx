import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import { Calendar } from "react-native-calendars";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MessageSquare,
  Check,
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

export default function ScheduleClassScreen() {
  const { courseId } = useLocalSearchParams();
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState("");

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  // Fetch course details
  const { data: courseData } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) return null;
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!courseId,
  });

  const scheduleMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDate) {
        throw new Error("Por favor selecciona una fecha");
      }

      // Combine date and time
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: courseId || null,
          scheduledDate: scheduledDateTime.toISOString(),
          durationMinutes: parseInt(duration),
          notes: notes.trim() || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al agendar clase");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["scheduled-classes"]);
      Alert.alert(
        "¡Clase Agendada!",
        "Tu clase ha sido agendada exitosamente",
        [
          {
            text: "Ver Agenda",
            onPress: () => router.push("/(tabs)/schedule"),
          },
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  const course = courseData?.course;

  // Time slots (from 7 AM to 9 PM)
  const timeSlots = [];
  for (let hour = 7; hour <= 21; hour++) {
    const time24 = `${hour.toString().padStart(2, "0")}:00`;
    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const ampm = hour >= 12 ? "PM" : "AM";
    timeSlots.push({
      value: time24,
      label: `${hour12}:00 ${ampm}`,
    });
  }

  // Duration options
  const durationOptions = [
    { value: "30", label: "30 min" },
    { value: "60", label: "1 hora" },
    { value: "90", label: "1.5 horas" },
    { value: "120", label: "2 horas" },
  ];

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Marked dates for calendar
  const markedDates = selectedDate
    ? {
        [selectedDate]: {
          selected: true,
          selectedColor: colors.accent,
        },
      }
    : {};

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 12,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ArrowLeft size={24} color={colors.primary} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 16,
                color: colors.primary,
              }}
            >
              Volver
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontFamily: "Sora_800ExtraBold",
            fontSize: 28,
            color: colors.primary,
            marginTop: 16,
          }}
        >
          Agendar Clase
        </Text>
        {course && (
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 14,
              color: colors.secondary,
              marginTop: 4,
            }}
          >
            {course.title}
          </Text>
        )}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ padding: 20 }}>
          {/* Calendar Section */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <CalendarIcon size={20} color={colors.accent} />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                Selecciona la fecha
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                overflow: "hidden",
                shadowColor: colors.cardShadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.06,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Calendar
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                }}
                markedDates={markedDates}
                minDate={today}
                enableSwipeMonths={true}
                theme={{
                  backgroundColor: colors.cardBackground,
                  calendarBackground: colors.cardBackground,
                  textSectionTitleColor: colors.secondary,
                  selectedDayBackgroundColor: colors.accent,
                  selectedDayTextColor: "#FFFFFF",
                  todayTextColor: colors.accent,
                  dayTextColor: colors.primary,
                  textDisabledColor: colors.secondary + "40",
                  dotColor: colors.accent,
                  selectedDotColor: "#FFFFFF",
                  arrowColor: colors.accent,
                  monthTextColor: colors.primary,
                  textMonthFontFamily: "Sora_800ExtraBold",
                  textDayFontFamily: "Sora_400Regular",
                  textDayHeaderFontFamily: "Sora_600SemiBold",
                  textMonthFontSize: 18,
                  textDayFontSize: 14,
                  textDayHeaderFontSize: 12,
                }}
              />
            </View>
            {selectedDate && (
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 14,
                  color: colors.accent,
                  marginTop: 8,
                }}
              >
                Fecha seleccionada:{" "}
                {new Date(selectedDate).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            )}
          </View>

          {/* Time Section */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Clock size={20} color={colors.accent} />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                Selecciona la hora
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.value}
                  onPress={() => setSelectedTime(slot.value)}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor:
                      selectedTime === slot.value
                        ? colors.accent
                        : colors.surface,
                    borderWidth: 1,
                    borderColor:
                      selectedTime === slot.value
                        ? colors.accent
                        : colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Sora_600SemiBold",
                      fontSize: 14,
                      color:
                        selectedTime === slot.value
                          ? "#FFFFFF"
                          : colors.primary,
                    }}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Duration Section */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <Clock size={20} color={colors.accent} />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                Duración de la clase
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {durationOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setDuration(option.value)}
                  style={{
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor:
                      duration === option.value
                        ? colors.accent
                        : colors.surface,
                    borderWidth: 1,
                    borderColor:
                      duration === option.value ? colors.accent : colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Sora_600SemiBold",
                      fontSize: 14,
                      color:
                        duration === option.value ? "#FFFFFF" : colors.primary,
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes Section */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <MessageSquare size={20} color={colors.accent} />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                }}
              >
                Notas (opcional)
              </Text>
            </View>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Agrega notas para el instructor..."
              placeholderTextColor={colors.secondary + "80"}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                fontFamily: "Sora_400Regular",
                fontSize: 14,
                color: colors.primary,
                borderWidth: 1,
                borderColor: colors.border,
                minHeight: 100,
              }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.cardBackground,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
        }}
      >
        <TouchableOpacity
          onPress={() => scheduleMutation.mutate()}
          disabled={!selectedDate || scheduleMutation.isPending}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: selectedDate
              ? colors.accent
              : colors.secondary + "40",
            paddingVertical: 16,
            borderRadius: 16,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: selectedDate ? 0.3 : 0,
            shadowRadius: 8,
            elevation: selectedDate ? 4 : 0,
          }}
        >
          <Check size={20} color="#FFFFFF" />
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 16,
              color: "#FFFFFF",
            }}
          >
            {scheduleMutation.isPending ? "Agendando..." : "Confirmar Clase"}
          </Text>
        </TouchableOpacity>
        {!selectedDate && (
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 12,
              color: colors.secondary,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Selecciona una fecha para continuar
          </Text>
        )}
      </View>
    </View>
  );
}
