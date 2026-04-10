import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppTheme } from "@/components/AppTheme";
import AppScreen from "@/components/AppScreen";
import AppHeader from "@/components/AppHeader";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";

export default function AddReminderScreen() {
  const { colors } = useAppTheme();
  const { petId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [fontsLoaded, fontsError] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  const [reminderType, setReminderType] = useState("vacuna");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [frequency, setFrequency] = useState("unica");
  const [saving, setSaving] = useState(false);

  const reminderTypes = [
    { value: "vacuna", label: "💉 Vacuna", color: "#FF6B35" },
    { value: "desparacitacion", label: "🐛 Desparacitación", color: "#4ECDC4" },
    { value: "medicamento", label: "💊 Medicamento", color: "#95E1D3" },
    { value: "revision", label: "📋 Revisión", color: "#F38181" },
  ];

  const frequencies = [
    { value: "unica", label: "Una vez" },
    { value: "diaria", label: "Diaria" },
    { value: "semanal", label: "Semanal" },
    { value: "mensual", label: "Mensual" },
    { value: "anual", label: "Anual" },
  ];

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    if (!dueDate.trim()) {
      Alert.alert("Error", "La fecha es obligatoria (formato: YYYY-MM-DD)");
      return;
    }

    // Validar formato de fecha
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      Alert.alert(
        "Error",
        "Formato de fecha incorrecto. Use: YYYY-MM-DD (ej: 2024-12-25)",
      );
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/pets/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet_id: parseInt(petId),
          reminder_type: reminderType,
          title: title.trim(),
          description: description.trim() || null,
          due_date: dueDate,
          frequency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar el recordatorio");
      }

      // Invalidar el query de recordatorios para recargar los datos
      await queryClient.invalidateQueries({
        queryKey: ["reminders", parseInt(petId)],
      });

      Alert.alert("Éxito", "Recordatorio creado correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error.message || "No se pudo guardar el recordatorio",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  const header = (
    <AppHeader
      title="Nuevo Recordatorio"
      showBackButton={true}
      titleStyle={{
        fontFamily: "Sora_800ExtraBold",
        fontSize: 20,
      }}
    />
  );

  return (
    <AppScreen header={header}>
      <View
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
          flexGrow: 1,
        }}
      >
        {/* Reminder Type */}
        <View style={{ marginTop: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            Tipo de Recordatorio
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {reminderTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                onPress={() => setReminderType(type.value)}
                style={{
                  backgroundColor:
                    reminderType === type.value
                      ? type.color
                      : colors.cardBackground,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor:
                    reminderType === type.value ? type.color : "transparent",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 14,
                    color:
                      reminderType === type.value ? "#FFFFFF" : colors.primary,
                  }}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            Título *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ej: Vacuna contra rabia"
            placeholderTextColor={colors.secondary + "80"}
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 12,
              padding: 16,
              fontFamily: "Sora_400Regular",
              fontSize: 16,
              color: colors.primary,
            }}
          />
        </View>

        {/* Description */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            Descripción
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Notas adicionales..."
            placeholderTextColor={colors.secondary + "80"}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 12,
              padding: 16,
              fontFamily: "Sora_400Regular",
              fontSize: 16,
              color: colors.primary,
              minHeight: 100,
              textAlignVertical: "top",
            }}
          />
        </View>

        {/* Due Date */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            Fecha (YYYY-MM-DD) *
          </Text>
          <TextInput
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="2024-12-31"
            placeholderTextColor={colors.secondary + "80"}
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 12,
              padding: 16,
              fontFamily: "Sora_400Regular",
              fontSize: 16,
              color: colors.primary,
            }}
          />
        </View>

        {/* Frequency */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            Frecuencia
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {frequencies.map((freq) => (
              <TouchableOpacity
                key={freq.value}
                onPress={() => setFrequency(freq.value)}
                style={{
                  backgroundColor:
                    frequency === freq.value
                      ? colors.accent
                      : colors.cardBackground,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor:
                    frequency === freq.value ? colors.accent : "transparent",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 14,
                    color:
                      frequency === freq.value ? "#FFFFFF" : colors.primary,
                  }}
                >
                  {freq.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button - CORRECCIONES DE EMERGENCIA */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.7}
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "#bc6622",
            borderRadius: 12,
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
            opacity: saving ? 0.6 : 1,
            zIndex: 10000,
            elevation: 5,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 17,
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            {saving ? "Guardando..." : "Guardar Recordatorio"}
          </Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}
