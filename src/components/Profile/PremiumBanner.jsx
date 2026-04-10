import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Crown, Sparkles, ChevronRight } from "lucide-react-native";

export function PremiumBanner({ colors, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginBottom: 24,
        borderRadius: 24,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View
        style={{
          backgroundColor: colors.accent,
          padding: 24,
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -20,
            right: -20,
            opacity: 0.15,
          }}
        >
          <Crown size={120} color="#FFFFFF" fill="#FFFFFF" />
        </View>

        <View style={{ zIndex: 2 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.25)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Crown size={26} color="#FFFFFF" fill="#FFFFFF" />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 22,
                  color: "#FFFFFF",
                  marginBottom: 2,
                }}
              >
                Hazte Premium
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Sparkles size={14} color="#FFFFFF" />
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  Acceso ilimitado a todo
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 14,
              color: "rgba(255,255,255,0.9)",
              marginBottom: 16,
              lineHeight: 20,
            }}
          >
            • Todos los cursos desbloqueados{"\n"}• Clases personalizadas{"\n"}•
            Chat prioritario 24/7{"\n"}• Certificados profesionales
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: 2,
                }}
              >
                Desde solo
              </Text>
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 28,
                  color: "#FFFFFF",
                }}
              >
                $4.99
                <Text style={{ fontSize: 16 }}>/mes</Text>
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 15,
                  color: colors.accent,
                }}
              >
                Ver Planes
              </Text>
              <ChevronRight size={18} color={colors.accent} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
