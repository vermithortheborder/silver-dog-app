import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Image } from "expo-image";
import {
  Dog,
  Calendar,
  Heart,
  Pill,
  Syringe,
  TestTube,
  FileText,
  Stethoscope,
  Building2,
  AlertTriangle,
  UtensilsCrossed,
  Edit3,
  X,
  Save,
} from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import { InfoField } from "./InfoField";

export function PetInfoCard({
  pet,
  editMode,
  onEditModeChange,
  editedValues,
  onSave,
  isSaving,
}) {
  const { colors, isDark } = useAppTheme();

  return (
    <View style={{ paddingHorizontal: 6, marginTop: 8, marginBottom: 12 }}>
      <View
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: 16,
          padding: 12,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {/* Header con botón de editar */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 20,
              color: colors.primary,
            }}
          >
            Información General
          </Text>
          {!editMode && (
            <TouchableOpacity
              onPress={() => onEditModeChange(true)}
              style={{
                backgroundColor: colors.accent + "20",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <Edit3 size={20} color={colors.accent} />
            </TouchableOpacity>
          )}
        </View>

        {/* Foto y nombre */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          {pet.photo ? (
            <Image
              source={{ uri: pet.photo }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
              contentFit="cover"
              transition={100}
            />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.accent + "20",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Dog size={40} color={colors.accent} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            {editMode ? (
              <TextInput
                style={{
                  backgroundColor: isDark ? "#1A1A1A" : "#F5F5F5",
                  borderRadius: 12,
                  padding: 12,
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 24,
                  color: colors.primary,
                  marginBottom: 8,
                }}
                placeholder="Nombre"
                placeholderTextColor={colors.secondary}
                value={editedValues.editedName}
                onChangeText={editedValues.setEditedName}
              />
            ) : (
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 24,
                  color: colors.primary,
                  marginBottom: 4,
                }}
              >
                {pet.name}
              </Text>
            )}
          </View>
        </View>

        {/* Información básica */}
        <InfoField
          icon={Dog}
          label="Raza"
          value={editedValues.editedBreed}
          editable={true}
          onChangeText={editedValues.setEditedBreed}
          placeholder="Ej: Labrador"
          editMode={editMode}
        />

        <InfoField
          icon={Calendar}
          label="Edad (años)"
          value={editedValues.editedAge}
          editable={true}
          onChangeText={editedValues.setEditedAge}
          placeholder="Ej: 3"
          editMode={editMode}
        />

        <InfoField
          icon={Heart}
          label="Peso (kg)"
          value={editedValues.editedWeight}
          editable={true}
          onChangeText={editedValues.setEditedWeight}
          placeholder="Ej: 25.5"
          editMode={editMode}
        />

        {/* Desparasitación */}
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.secondary + "20",
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            Desparasitación
          </Text>

          <InfoField
            icon={Pill}
            label="Última desparasitación"
            value={editedValues.editedLastDeworming}
            editable={true}
            onChangeText={editedValues.setEditedLastDeworming}
            placeholder="Ej: 2024-01-15"
            editMode={editMode}
          />

          <InfoField
            icon={Calendar}
            label="Próxima desparasitación"
            value={editedValues.editedNextDeworming}
            editable={true}
            onChangeText={editedValues.setEditedNextDeworming}
            placeholder="Ej: 2024-04-15"
            editMode={editMode}
          />
        </View>

        {/* Vacunas */}
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.secondary + "20",
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            Vacunas
          </Text>

          <InfoField
            icon={Syringe}
            label="Última vacuna"
            value={editedValues.editedLastVaccine}
            editable={true}
            onChangeText={editedValues.setEditedLastVaccine}
            placeholder="Ej: 2024-01-10"
            editMode={editMode}
          />

          <InfoField
            icon={Calendar}
            label="Próxima vacuna"
            value={editedValues.editedNextVaccine}
            editable={true}
            onChangeText={editedValues.setEditedNextVaccine}
            placeholder="Ej: 2025-01-10"
            editMode={editMode}
          />
        </View>

        {/* Exámenes y Rx */}
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.secondary + "20",
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            Exámenes y Radiografías
          </Text>

          <InfoField
            icon={TestTube}
            label="Último examen"
            value={editedValues.editedLastExam}
            editable={true}
            onChangeText={editedValues.setEditedLastExam}
            placeholder="Ej: 2024-02-20"
            editMode={editMode}
          />

          <InfoField
            icon={FileText}
            label="Última radiografía"
            value={editedValues.editedLastRx}
            editable={true}
            onChangeText={editedValues.setEditedLastRx}
            placeholder="Ej: 2024-03-05"
            editMode={editMode}
          />
        </View>

        {/* Veterinario y Clínica */}
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.secondary + "20",
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            Atención Médica
          </Text>

          <InfoField
            icon={Stethoscope}
            label="Veterinario"
            value={editedValues.editedVeterinarian}
            editable={true}
            onChangeText={editedValues.setEditedVeterinarian}
            placeholder="Ej: Dr. Juan Pérez"
            editMode={editMode}
          />

          <InfoField
            icon={Building2}
            label="Clínica"
            value={editedValues.editedClinic}
            editable={true}
            onChangeText={editedValues.setEditedClinic}
            placeholder="Ej: Clínica Veterinaria Central"
            editMode={editMode}
          />
        </View>

        {/* Alergias y Alimentación */}
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.secondary + "20",
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 16,
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            Salud y Nutrición
          </Text>

          <InfoField
            icon={AlertTriangle}
            label="Alergias"
            value={editedValues.editedAllergies}
            editable={true}
            onChangeText={editedValues.setEditedAllergies}
            placeholder="Ej: Pollo, lácteos"
            editMode={editMode}
          />

          <InfoField
            icon={UtensilsCrossed}
            label="Tipo de alimentación"
            value={editedValues.editedFoodType}
            editable={true}
            onChangeText={editedValues.setEditedFoodType}
            placeholder="Ej: Croquetas premium, dieta BARF"
            editMode={editMode}
          />
        </View>

        {/* Botones de Guardar y Cancelar - CORRECCIONES DE EMERGENCIA */}
        {editMode && (
          <View
            style={{
              position: "relative",
              marginTop: 16,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: colors.secondary + "20",
              flexDirection: "column",
              gap: 15,
              zIndex: 9999,
            }}
          >
            {/* Botón Guardar - Naranja sobre fondo oscuro */}
            <TouchableOpacity
              onPress={onSave}
              activeOpacity={0.7}
              style={{
                position: "relative",
                width: "100%",
                backgroundColor: "#bc6622",
                padding: 18,
                borderRadius: 12,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                opacity: isSaving ? 0.6 : 1,
                zIndex: 10000,
                elevation: 5,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
              disabled={isSaving}
            >
              <Save size={22} color="#FFFFFF" />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 17,
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                {isSaving ? "Guardando..." : "Guardar"}
              </Text>
            </TouchableOpacity>

            {/* Botón Cancelar - Gris sobre fondo oscuro */}
            <TouchableOpacity
              onPress={() => onEditModeChange(false)}
              activeOpacity={0.7}
              style={{
                position: "relative",
                width: "100%",
                backgroundColor: "#444444",
                padding: 18,
                borderRadius: 12,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                zIndex: 10000,
                elevation: 5,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
            >
              <X size={22} color="#FFFFFF" />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 17,
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
