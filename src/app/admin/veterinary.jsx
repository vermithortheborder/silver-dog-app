import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  Calendar,
  Pill,
  Plus,
  X,
  Search,
  Dog,
  Clock,
} from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import AppScreen from "@/components/AppScreen";
import AppHeader from "@/components/AppHeader";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import useUser from "@/utils/useUser";

export default function AdminVeterinaryScreen() {
  const { colors, isDark } = useAppTheme();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const [showAddReminder, setShowAddReminder] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [reminderType, setReminderType] = useState("vacuna");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminderDate, setReminderDate] = useState("");

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  // Verificar permisos
  const isAuthorized = user?.role === "veterinario" || user?.role === "admin";

  const { data: allPetsData } = useQuery({
    queryKey: ["pets", "all"],
    queryFn: async () => {
      const response = await fetch("/api/pets?all=true");
      if (!response.ok) throw new Error("Failed to fetch pets");
      return response.json();
    },
    enabled: isAuthorized,
  });

  const createReminderMutation = useMutation({
    mutationFn: async (reminderData) => {
      console.log(
        "📤 Enviando datos del recordatorio:",
        JSON.stringify(reminderData, null, 2),
      );

      const response = await fetch("/api/pets/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminderData),
      });

      console.log(
        "📥 Estado de respuesta:",
        response.status,
        response.statusText,
      );

      const data = await response.json();
      console.log("📥 Datos de respuesta:", JSON.stringify(data, null, 2));

      if (!response.ok) {
        const errorMsg =
          data.details ||
          data.error ||
          `Error ${response.status}: ${response.statusText}`;
        console.error("❌ Error del servidor:", errorMsg);
        throw new Error(errorMsg);
      }

      return data;
    },
    onSuccess: () => {
      console.log("✅ Recordatorio creado exitosamente");
      queryClient.invalidateQueries(["reminders"]);
      setShowAddReminder(false);
      setReminderTitle("");
      setReminderDescription("");
      setReminderDate("");
      setSelectedPet(null);
      Alert.alert("¡Éxito!", "Recordatorio creado correctamente");
    },
    onError: (error) => {
      console.error("❌ Error completo:", error);
      console.error("❌ Mensaje de error:", error.message);
      console.error("❌ Stack:", error.stack);

      Alert.alert(
        "Error al crear recordatorio",
        error.message || "Error desconocido. Revisa los logs de la consola.",
      );
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  if (!isAuthorized) {
    return (
      <AppScreen
        header={
          <AppHeader
            title="Sin Acceso"
            showBackButton={true}
            titleStyle={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 20,
            }}
          />
        }
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              textAlign: "center",
            }}
          >
            No tienes permisos para acceder a esta sección
          </Text>
        </View>
      </AppScreen>
    );
  }

  const header = (
    <AppHeader
      title="Gestión Veterinaria"
      showBackButton={true}
      titleStyle={{
        fontFamily: "Sora_800ExtraBold",
        fontSize: 20,
      }}
    />
  );

  const filteredPets = allPetsData?.pets?.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AppScreen header={header}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View
          style={{ paddingHorizontal: 20, marginTop: 16, marginBottom: 24 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.cardBackground,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              gap: 12,
              shadowColor: colors.cardShadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Search size={20} color={colors.secondary} />
            <TextInput
              style={{
                flex: 1,
                fontFamily: "Sora_400Regular",
                fontSize: 16,
                color: colors.primary,
              }}
              placeholder="Buscar mascota o dueño..."
              placeholderTextColor={colors.secondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* Pets List */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 20,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Mascotas Registradas ({filteredPets?.length || 0})
          </Text>

          {filteredPets && filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
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
                onPress={() => {
                  console.log("🐕 Mascota seleccionada:", pet);
                  setSelectedPet(pet);
                  setShowAddReminder(true);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
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
                  <View style={{ flex: 1 }}>
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
                          marginBottom: 4,
                        }}
                      >
                        {pet.breed}
                      </Text>
                    )}
                    <Text
                      style={{
                        fontFamily: "Sora_400Regular",
                        fontSize: 12,
                        color: colors.secondary,
                      }}
                    >
                      Dueño: {pet.owner_name}
                    </Text>
                  </View>
                  <Plus size={24} color={colors.accent} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 16,
                color: colors.secondary,
                textAlign: "center",
                marginTop: 20,
              }}
            >
              No hay mascotas registradas
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Add Reminder Modal */}
      <Modal
        visible={showAddReminder}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddReminder(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              paddingBottom: 40,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 20,
                  color: colors.primary,
                }}
              >
                Agregar Recordatorio
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddReminder(false);
                  setReminderTitle("");
                  setReminderDescription("");
                  setReminderDate("");
                  setReminderType("vacuna");
                }}
              >
                <X size={24} color={colors.secondary} />
              </TouchableOpacity>
            </View>

            {selectedPet && (
              <View
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 16,
                    color: colors.primary,
                  }}
                >
                  {selectedPet.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Sora_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  Dueño: {selectedPet.owner_name}
                </Text>
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Tipo de Recordatorio
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                {["vacuna", "desparacitacion", "medicamento", "revision"].map(
                  (type) => (
                    <TouchableOpacity
                      key={type}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor:
                          reminderType === type
                            ? colors.accent
                            : colors.cardBackground,
                      }}
                      onPress={() => setReminderType(type)}
                    >
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 14,
                          color:
                            reminderType === type
                              ? "#FFFFFF"
                              : colors.secondary,
                        }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>

              <TextInput
                style={{
                  backgroundColor: isDark ? "#1A1A1A" : "#F5F5F5",
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 12,
                }}
                placeholder="Título del recordatorio"
                placeholderTextColor={colors.secondary}
                value={reminderTitle}
                onChangeText={setReminderTitle}
              />

              <TextInput
                style={{
                  backgroundColor: isDark ? "#1A1A1A" : "#F5F5F5",
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 12,
                  minHeight: 80,
                }}
                placeholder="Descripción (opcional)"
                placeholderTextColor={colors.secondary}
                value={reminderDescription}
                onChangeText={setReminderDescription}
                multiline
                textAlignVertical="top"
              />

              <TextInput
                style={{
                  backgroundColor: isDark ? "#1A1A1A" : "#F5F5F5",
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 20,
                }}
                placeholder="Fecha (YYYY-MM-DD)"
                placeholderTextColor={colors.secondary}
                value={reminderDate}
                onChangeText={setReminderDate}
              />

              <TouchableOpacity
                style={{
                  backgroundColor: colors.accent,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  opacity: createReminderMutation.isPending ? 0.7 : 1,
                }}
                onPress={() => {
                  console.log("🔍 Validando campos...");
                  console.log("Título:", reminderTitle);
                  console.log("Fecha:", reminderDate);
                  console.log("Mascota seleccionada:", selectedPet);

                  if (!reminderTitle.trim()) {
                    Alert.alert("Error", "Por favor ingresa un título");
                    return;
                  }

                  if (!reminderDate.trim()) {
                    Alert.alert("Error", "Por favor ingresa una fecha");
                    return;
                  }

                  if (!selectedPet) {
                    Alert.alert("Error", "No hay mascota seleccionada");
                    return;
                  }

                  const reminderData = {
                    pet_id: selectedPet.id,
                    reminder_type: reminderType,
                    title: reminderTitle.trim(),
                    description: reminderDescription.trim() || null,
                    due_date: reminderDate.trim(),
                    frequency: "unica",
                  };

                  console.log(
                    "✅ Validación exitosa, enviando datos:",
                    reminderData,
                  );
                  createReminderMutation.mutate(reminderData);
                }}
                disabled={createReminderMutation.isPending}
              >
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  {createReminderMutation.isPending
                    ? "Guardando..."
                    : "Crear Recordatorio"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}
