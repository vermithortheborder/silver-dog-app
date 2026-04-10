import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { Plus, X } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";

export function AddPetCard({ onAdd, isAdding }) {
  const { colors, isDark } = useAppTheme();
  const [showForm, setShowForm] = useState(false);
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("");

  const handleAdd = () => {
    if (petName.trim()) {
      onAdd({
        name: petName,
        breed: petBreed || null,
      });
      setPetName("");
      setPetBreed("");
      setShowForm(false);
    } else {
      Alert.alert("Error", "Por favor ingresa el nombre de la mascota");
    }
  };

  if (!showForm) {
    return (
      <View style={{ paddingHorizontal: 12, marginTop: 8, marginBottom: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            padding: 24,
            alignItems: "center",
            borderWidth: 2,
            borderColor: colors.accent + "40",
            borderStyle: "dashed",
          }}
          onPress={() => setShowForm(true)}
        >
          <Plus size={48} color={colors.accent} />
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 18,
              color: colors.primary,
              marginTop: 12,
            }}
          >
            Agregar mi Mascota
          </Text>
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 14,
              color: colors.secondary,
              marginTop: 4,
              textAlign: "center",
            }}
          >
            Registra a tu perro para llevar control de su salud
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 12, marginTop: 8, marginBottom: 12 }}>
      <View
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: 16,
          padding: 20,
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
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 18,
              color: colors.primary,
            }}
          >
            Registrar Mascota
          </Text>
          <TouchableOpacity onPress={() => setShowForm(false)}>
            <X size={24} color={colors.secondary} />
          </TouchableOpacity>
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
          placeholder="Nombre de la mascota"
          placeholderTextColor={colors.secondary}
          value={petName}
          onChangeText={setPetName}
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
          placeholder="Raza (opcional)"
          placeholderTextColor={colors.secondary}
          value={petBreed}
          onChangeText={setPetBreed}
        />

        <TouchableOpacity
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "#bc6622",
            borderRadius: 12,
            padding: 18,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            elevation: 5,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            opacity: isAdding ? 0.6 : 1,
          }}
          onPress={handleAdd}
          disabled={isAdding}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 17,
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            {isAdding ? "Guardando..." : "Guardar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
