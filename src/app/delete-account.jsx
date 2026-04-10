import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, AlertTriangle, Trash2 } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/useUser";

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useAppTheme();
  const { signOut } = useAuth();
  const { data: user } = useUser();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== "ELIMINAR") {
      Alert.alert("Error", 'Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    Alert.alert(
      "¿Estás absolutamente seguro?",
      "Esta acción NO SE PUEDE DESHACER. Todos tus datos se eliminarán permanentemente en un plazo de 30 días.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, eliminar mi cuenta",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const response = await fetch("/api/user/delete", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (!response.ok) {
                throw new Error("Error al eliminar la cuenta");
              }

              Alert.alert(
                "Cuenta Eliminada",
                "Tu cuenta ha sido marcada para eliminación. Todos tus datos serán borrados en 30 días.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      signOut();
                      router.replace("/");
                    },
                  },
                ],
              );
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                "No se pudo eliminar la cuenta. Por favor, intenta de nuevo o contáctanos.",
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontSize: 20, fontWeight: "700", color: colors.primary }}
          >
            Eliminar Cuenta
          </Text>
        </View>
        <AlertTriangle size={24} color={colors.destructive} />
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}>
        {/* Warning Card */}
        <View
          style={{
            backgroundColor: colors.destructiveBackground,
            padding: 20,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: colors.destructive,
            marginBottom: 32,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <AlertTriangle size={24} color={colors.destructive} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.destructive,
                marginLeft: 12,
              }}
            >
              ¡ADVERTENCIA!
            </Text>
          </View>
          <Text style={{ fontSize: 14, color: colors.primary, lineHeight: 22 }}>
            Eliminar tu cuenta es una acción{" "}
            <Text style={{ fontWeight: "700" }}>permanente e irreversible</Text>
            .
          </Text>
        </View>

        {/* What will be deleted */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Se eliminará permanentemente:
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              padding: 16,
              borderRadius: 12,
            }}
          >
            <Text
              style={{ fontSize: 14, color: colors.secondary, lineHeight: 24 }}
            >
              • Tu perfil y foto de perfil{"\n"}• Todos los datos de tus
              mascotas{"\n"}• Historial médico y citas veterinarias{"\n"}•
              Recordatorios y programaciones{"\n"}• Inscripciones a cursos y
              clases{"\n"}• Historial de chat con instructores{"\n"}• Paquetes
              de clases y asistencias{"\n"}• Historial de pagos y compras{"\n"}•
              Carnet digital de estudiante
            </Text>
          </View>
        </View>

        {/* Note */}
        <View
          style={{
            backgroundColor: colors.accentBackground,
            padding: 16,
            borderRadius: 12,
            marginBottom: 32,
          }}
        >
          <Text
            style={{ fontSize: 13, color: colors.secondary, lineHeight: 20 }}
          >
            <Text style={{ fontWeight: "700" }}>Nota:</Text> La eliminación se
            procesará en un plazo de 30 días. Algunos datos pueden conservarse
            por obligaciones legales (historial de transacciones).
          </Text>
        </View>

        {/* Confirmation Input */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.primary,
              marginBottom: 12,
            }}
          >
            Para confirmar, escribe{" "}
            <Text style={{ fontWeight: "700", color: colors.destructive }}>
              ELIMINAR
            </Text>{" "}
            a continuación:
          </Text>
          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder="Escribe ELIMINAR"
            placeholderTextColor={colors.searchPlaceholder}
            autoCapitalize="characters"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 2,
              borderColor:
                confirmText === "ELIMINAR" ? colors.destructive : colors.border,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
              color: colors.primary,
              fontWeight: "600",
            }}
          />
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDeleteAccount}
          disabled={confirmText !== "ELIMINAR" || isDeleting}
          style={{
            backgroundColor:
              confirmText === "ELIMINAR" && !isDeleting
                ? colors.destructive
                : colors.border,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          {isDeleting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Trash2 size={20} color="#FFFFFF" />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#FFFFFF",
                  marginLeft: 8,
                }}
              >
                Eliminar Mi Cuenta Permanentemente
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: insets.bottom + 20,
          }}
        >
          <Text
            style={{ fontSize: 16, fontWeight: "600", color: colors.primary }}
          >
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
