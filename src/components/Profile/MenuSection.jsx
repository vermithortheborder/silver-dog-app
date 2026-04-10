import React from "react";
import { View, Text } from "react-native";
import { MenuItem } from "./MenuItem";
import {
  BookOpen,
  Calendar,
  CreditCard,
  Scissors,
  Heart,
  Shield,
  Home,
  Baby,
  Stethoscope,
  FileText,
  Trash2,
} from "lucide-react-native";

export function MenuSection({ colors, isDark, router }) {
  return (
    <>
      {/* Sección Principal */}
      <View
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <MenuItem
          icon={BookOpen}
          title="Mis Cursos"
          subtitle="Ver cursos inscritos"
          onPress={() => router.push("/(tabs)/courses")}
          colors={colors}
        />
        <MenuItem
          icon={Calendar}
          title="Mi Agenda"
          subtitle="Ver clases programadas"
          onPress={() => router.push("/(tabs)/schedule")}
          colors={colors}
        />
        <MenuItem
          icon={CreditCard}
          title="Pagos"
          subtitle="Historial de pagos"
          onPress={() => router.push("/payments")}
          colors={colors}
          isLast
        />
      </View>

      {/* Sección de Servicios */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontFamily: "Sora_800ExtraBold",
            fontSize: 18,
            color: colors.primary,
            marginBottom: 12,
            paddingHorizontal: 4,
          }}
        >
          Servicios
        </Text>
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
          <MenuItem
            icon={Scissors}
            title="Peluquería Canina"
            subtitle="Servicios de estética para tu perro"
            onPress={() =>
              router.push({
                pathname: "/service-request",
                params: { serviceType: "peluqueria" },
              })
            }
            colors={colors}
          />
          <MenuItem
            icon={Heart}
            title="Servicio Funerario"
            subtitle="Despedida digna para tu compañero"
            onPress={() =>
              router.push({
                pathname: "/service-request",
                params: { serviceType: "funerario" },
              })
            }
            colors={colors}
          />
          <MenuItem
            icon={Shield}
            title="Seguro"
            subtitle="Protección y cobertura médica"
            onPress={() =>
              router.push({
                pathname: "/service-request",
                params: { serviceType: "seguro" },
              })
            }
            colors={colors}
          />
          <MenuItem
            icon={Home}
            title="Hospedaje"
            subtitle="Alojamiento seguro para tu perro"
            onPress={() =>
              router.push({
                pathname: "/service-request",
                params: { serviceType: "hospedaje" },
              })
            }
            colors={colors}
          />
          <MenuItem
            icon={Baby}
            title="Daycare"
            subtitle="Cuidado diurno profesional"
            onPress={() =>
              router.push({
                pathname: "/service-request",
                params: { serviceType: "daycare" },
              })
            }
            colors={colors}
          />
          <MenuItem
            icon={Stethoscope}
            title="Clínica Veterinaria"
            subtitle="Atención médica especializada"
            onPress={() =>
              router.push({
                pathname: "/service-request",
                params: { serviceType: "clinica" },
              })
            }
            colors={colors}
            isLast
          />
        </View>
      </View>

      {/* Sección Legal y Privacidad */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontFamily: "Sora_800ExtraBold",
            fontSize: 18,
            color: colors.primary,
            marginBottom: 12,
            paddingHorizontal: 4,
          }}
        >
          Legal y Privacidad
        </Text>
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
          <MenuItem
            icon={FileText}
            title="Política de Privacidad"
            subtitle="Cómo protegemos tus datos"
            onPress={() => router.push("/privacy-policy")}
            colors={colors}
          />
          <MenuItem
            icon={FileText}
            title="Términos de Servicio"
            subtitle="Condiciones de uso"
            onPress={() => router.push("/terms-of-service")}
            colors={colors}
          />
          <MenuItem
            icon={Trash2}
            title="Eliminar Cuenta"
            subtitle="Borrar todos tus datos permanentemente"
            onPress={() => router.push("/delete-account")}
            colors={colors}
            iconColor={colors.destructive}
            isLast
          />
        </View>
      </View>
    </>
  );
}
